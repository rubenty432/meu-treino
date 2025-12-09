/**
 * habit_kernel.c - Habit Tracker Kernel Module
 * 
 * A kernel-level habit tracking system with advanced synchronization,
 * memory management, and performance optimization.
 * 
 * Compile: gcc -o habit_kernel habit_kernel.c -Wall -O3
 * Usage: ./habit_kernel
 * 
 * Author: inspired by Linux kernel architecture
 * Created: 2025
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#include <pthread.h>
#include <stdint.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

/* Kernel-style macros */
#define HABIT_MAX_NAME 64
#define HABIT_MAX_ENTRIES 1024
#define HABIT_HASH_SIZE 256
#define likely(x) __builtin_expect(!!(x), 1)
#define unlikely(x) __builtin_expect(!!(x), 0)

/* Memory pool for efficient allocation */
#define MEMORY_POOL_SIZE (64 * 1024)

/* Kernel logging */
#define pr_err(fmt, ...) fprintf(stderr, "[ERROR] " fmt "\n", ##__VA_ARGS__)
#define pr_warn(fmt, ...) fprintf(stderr, "[WARN] " fmt "\n", ##__VA_ARGS__)
#define pr_info(fmt, ...) printf("[INFO] " fmt "\n", ##__VA_ARGS__)
#define pr_debug(fmt, ...) printf("[DEBUG] " fmt "\n", ##__VA_ARGS__)

/* Spinlock implementation */
typedef struct {
    volatile int lock;
} spinlock_t;

static inline void spin_lock(spinlock_t *lock) {
    while (__sync_lock_test_and_set(&lock->lock, 1)) {
        __asm__("pause");
    }
}

static inline void spin_unlock(spinlock_t *lock) {
    __sync_lock_release(&lock->lock);
}

/* RCU (Read-Copy-Update) - Linux kernel pattern */
typedef struct {
    uint32_t read_count;
    spinlock_t lock;
} rcu_t;

/* Memory allocator - Kernel style buddy system simulation */
typedef struct memory_block {
    size_t size;
    int is_free;
    struct memory_block *next;
} memory_block_t;

static char memory_pool[MEMORY_POOL_SIZE];
static memory_block_t *pool_head = NULL;

void memory_pool_init(void) {
    pool_head = (memory_block_t *)memory_pool;
    pool_head->size = MEMORY_POOL_SIZE - sizeof(memory_block_t);
    pool_head->is_free = 1;
    pool_head->next = NULL;
    pr_info("Memory pool initialized: %zu bytes", MEMORY_POOL_SIZE);
}

void *kmalloc(size_t size) {
    memory_block_t *block = pool_head;
    
    while (block) {
        if (block->is_free && block->size >= size) {
            block->is_free = 0;
            
            if (block->size > size + sizeof(memory_block_t)) {
                memory_block_t *new_block = (memory_block_t *)
                    ((char *)block + sizeof(memory_block_t) + size);
                new_block->size = block->size - size - sizeof(memory_block_t);
                new_block->is_free = 1;
                new_block->next = block->next;
                block->next = new_block;
                block->size = size;
            }
            
            return (char *)block + sizeof(memory_block_t);
        }
        block = block->next;
    }
    
    pr_err("kmalloc: out of memory!");
    return NULL;
}

void kfree(void *ptr) {
    if (!ptr) return;
    
    memory_block_t *block = (memory_block_t *)((char *)ptr - sizeof(memory_block_t));
    block->is_free = 1;
}

/* Entry structure */
typedef struct {
    time_t timestamp;
    char date[16];
} entry_t;

/* Habit structure */
typedef struct habit_node {
    uint32_t id;
    char name[HABIT_MAX_NAME];
    entry_t entries[HABIT_MAX_ENTRIES];
    uint32_t entry_count;
    spinlock_t lock;
    struct habit_node *next;
} habit_node_t;

/* Hash table for O(1) lookups */
typedef struct {
    habit_node_t *bucket[HABIT_HASH_SIZE];
    spinlock_t bucket_lock[HABIT_HASH_SIZE];
    uint32_t count;
    rcu_t rcu;
} habit_table_t;

static habit_table_t habit_table;

/* Hash function - from Linux kernel */
static inline uint32_t hash_long(unsigned long val, unsigned int bits) {
    unsigned long hash = val;
    hash = hash ^ (hash >> (8 * sizeof(unsigned long) - bits));
    return hash & ((1 << bits) - 1);
}

void habit_table_init(void) {
    memset(&habit_table, 0, sizeof(habit_table_t));
    habit_table.count = 0;
    pr_info("Habit hash table initialized with %d buckets", HABIT_HASH_SIZE);
}

/* Insert habit into hash table */
int habit_insert(const char *name) {
    uint32_t hash = hash_long((unsigned long)name[0], 8);
    spinlock_t *lock = &habit_table.bucket_lock[hash];
    
    spin_lock(lock);
    
    habit_node_t *new_habit = (habit_node_t *)kmalloc(sizeof(habit_node_t));
    if (unlikely(!new_habit)) {
        spin_unlock(lock);
        return -1;
    }
    
    new_habit->id = __sync_add_and_fetch(&habit_table.count, 1);
    strncpy(new_habit->name, name, HABIT_MAX_NAME - 1);
    new_habit->entry_count = 0;
    new_habit->lock.lock = 0;
    new_habit->next = habit_table.bucket[hash];
    habit_table.bucket[hash] = new_habit;
    
    spin_unlock(lock);
    
    pr_info("Habit inserted: %s (id: %u)", name, new_habit->id);
    return new_habit->id;
}

/* Lookup habit */
habit_node_t *habit_lookup(const char *name) {
    uint32_t hash = hash_long((unsigned long)name[0], 8);
    spinlock_t *lock = &habit_table.bucket_lock[hash];
    
    spin_lock(lock);
    
    habit_node_t *node = habit_table.bucket[hash];
    while (node) {
        if (likely(strcmp(node->name, name) == 0)) {
            spin_unlock(lock);
            return node;
        }
        node = node->next;
    }
    
    spin_unlock(lock);
    return NULL;
}

/* Add entry to habit */
int habit_add_entry(const char *habit_name) {
    habit_node_t *habit = habit_lookup(habit_name);
    if (unlikely(!habit)) {
        pr_err("Habit not found: %s", habit_name);
        return -1;
    }
    
    spin_lock(&habit->lock);
    
    if (unlikely(habit->entry_count >= HABIT_MAX_ENTRIES)) {
        spin_unlock(&habit->lock);
        pr_err("Entry limit reached for habit: %s", habit_name);
        return -1;
    }
    
    time_t now = time(NULL);
    entry_t *entry = &habit->entries[habit->entry_count];
    entry->timestamp = now;
    
    struct tm *tm_info = localtime(&now);
    strftime(entry->date, sizeof(entry->date), "%d/%m/%Y", tm_info);
    
    habit->entry_count++;
    
    spin_unlock(&habit->lock);
    
    pr_info("Entry added to %s: %s", habit_name, entry->date);
    return 0;
}

/* Calculate streak */
uint32_t habit_calculate_streak(const char *habit_name) {
    habit_node_t *habit = habit_lookup(habit_name);
    if (unlikely(!habit)) {
        return 0;
    }
    
    spin_lock(&habit->lock);
    
    if (unlikely(habit->entry_count == 0)) {
        spin_unlock(&habit->lock);
        return 0;
    }
    
    uint32_t streak = 0;
    time_t now = time(NULL);
    time_t day_seconds = 86400;
    
    for (int i = habit->entry_count - 1; i >= 0; i--) {
        time_t diff = now - habit->entries[i].timestamp;
        
        if (diff <= day_seconds) {
            streak++;
            now = habit->entries[i].timestamp;
        } else {
            break;
        }
    }
    
    spin_unlock(&habit->lock);
    
    return streak;
}

/* Get statistics */
void habit_print_stats(const char *habit_name) {
    habit_node_t *habit = habit_lookup(habit_name);
    if (unlikely(!habit)) {
        pr_err("Habit not found: %s", habit_name);
        return;
    }
    
    spin_lock(&habit->lock);
    
    uint32_t streak = habit_calculate_streak(habit_name);
    float completion_rate = (float)habit->entry_count / 30.0 * 100;
    
    pr_info("===== Statistics: %s =====", habit->name);
    pr_info("Total entries: %u", habit->entry_count);
    pr_info("Current streak: %u days", streak);
    pr_info("Completion rate: %.2f%%", completion_rate);
    
    if (habit->entry_count > 0) {
        pr_info("Last entry: %s", 
            habit->entries[habit->entry_count - 1].date);
    }
    
    spin_unlock(&habit->lock);
}

/* Parallel processing with threads */
struct thread_args {
    const char *habit_name;
    int entries_to_add;
};

void *thread_add_entries(void *arg) {
    struct thread_args *args = (struct thread_args *)arg;
    
    pr_info("Thread %lu: adding %d entries to %s", 
        pthread_self(), args->entries_to_add, args->habit_name);
    
    for (int i = 0; i < args->entries_to_add; i++) {
        habit_add_entry(args->habit_name);
        usleep(100000); /* 100ms between entries */
    }
    
    free(args);
    return NULL;
}

/* Performance benchmark */
void benchmark_operations(void) {
    pr_info("\n===== Performance Benchmark =====");
    
    clock_t start = clock();
    
    /* Insert 100 habits */
    for (int i = 0; i < 100; i++) {
        char name[32];
        snprintf(name, sizeof(name), "habit_%d", i);
        habit_insert(name);
    }
    
    clock_t after_insert = clock();
    pr_info("Insert 100 habits: %.2f ms", 
        (double)(after_insert - start) / CLOCKS_PER_SEC * 1000);
    
    /* Add 1000 entries */
    for (int i = 0; i < 1000; i++) {
        char name[32];
        snprintf(name, sizeof(name), "habit_%d", i % 100);
        habit_add_entry(name);
    }
    
    clock_t after_entries = clock();
    pr_info("Add 1000 entries: %.2f ms", 
        (double)(after_entries - after_insert) / CLOCKS_PER_SEC * 1000);
    
    /* Lookup 10000 times */
    for (int i = 0; i < 10000; i++) {
        char name[32];
        snprintf(name, sizeof(name), "habit_%d", i % 100);
        habit_lookup(name);
    }
    
    clock_t after_lookup = clock();
    pr_info("Lookup 10000 times: %.2f ms", 
        (double)(after_lookup - after_entries) / CLOCKS_PER_SEC * 1000);
    
    pr_info("Total time: %.2f ms\n", 
        (double)(after_lookup - start) / CLOCKS_PER_SEC * 1000);
}

/* Demo with threading */
void demo_multithreaded(void) {
    pr_info("\n===== Multithreaded Demo =====");
    
    habit_insert("Exercício");
    habit_insert("Leitura");
    habit_insert("Meditação");
    
    pthread_t threads[3];
    
    const char *habits[] = {"Exercício", "Leitura", "Meditação"};
    
    for (int i = 0; i < 3; i++) {
        struct thread_args *args = malloc(sizeof(struct thread_args));
        args->habit_name = habits[i];
        args->entries_to_add = 5;
        
        pthread_create(&threads[i], NULL, thread_add_entries, args);
    }
    
    for (int i = 0; i < 3; i++) {
        pthread_join(threads[i], NULL);
    }
    
    for (int i = 0; i < 3; i++) {
        habit_print_stats(habits[i]);
    }
}

int main(int argc, char **argv) {
    pr_info("=== Habit Tracker Kernel Module ===");
    pr_info("Compiled: %s %s", __DATE__, __TIME__);
    
    /* Initialize kernel subsystems */
    memory_pool_init();
    habit_table_init();
    
    /* Single-threaded demo */
    pr_info("\n===== Single-Threaded Demo =====");
    
    habit_insert("Exercício");
    habit_insert("Leitura");
    habit_insert("Meditação");
    
    for (int i = 0; i < 7; i++) {
        habit_add_entry("Exercício");
        habit_add_entry("Leitura");
    }
    
    for (int i = 0; i < 5; i++) {
        habit_add_entry("Meditação");
    }
    
    habit_print_stats("Exercício");
    habit_print_stats("Leitura");
    habit_print_stats("Meditação");
    
    /* Multithreaded demo */
    demo_multithreaded();
    
    /* Benchmark */
    benchmark_operations();
    
    pr_info("===== Kernel Module Unloading =====");
    
    return 0;
}
