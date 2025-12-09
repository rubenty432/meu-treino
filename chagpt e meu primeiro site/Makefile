# Makefile for Habit Kernel Module
# Linus Torvalds style build system

CC = gcc
CFLAGS = -Wall -Wextra -O3 -march=native -pthread -fno-stack-protector
DEBUG_FLAGS = -g -O0 -DDEBUG
LDFLAGS = -lpthread

# Targets
TARGET = habit_kernel
TARGET_DEBUG = habit_kernel_debug

# Source files
SRCS = habit_kernel.c
OBJS = $(SRCS:.c=.o)
OBJS_DEBUG = $(SRCS:.c=_debug.o)

.PHONY: all debug clean run benchmark

all: $(TARGET)

debug: CFLAGS += $(DEBUG_FLAGS)
debug: $(TARGET_DEBUG)

$(TARGET): $(OBJS)
	@echo "Linking kernel module..."
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)
	@echo "✓ Build complete: $(TARGET)"
	@ls -lh $(TARGET)

$(TARGET_DEBUG): $(OBJS_DEBUG)
	@echo "Linking debug build..."
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)
	@echo "✓ Debug build complete: $(TARGET_DEBUG)"

%.o: %.c
	@echo "Compiling $<..."
	$(CC) $(CFLAGS) -c $< -o $@

%_debug.o: %.c
	@echo "Compiling (debug) $<..."
	$(CC) $(CFLAGS) -c $< -o $@

run: $(TARGET)
	@echo "Running habit kernel module..."
	@./$(TARGET)

benchmark: $(TARGET)
	@echo "Running benchmark suite..."
	@./$(TARGET)

clean:
	@echo "Cleaning build artifacts..."
	rm -f $(OBJS) $(OBJS_DEBUG) $(TARGET) $(TARGET_DEBUG)
	@echo "✓ Clean complete"

help:
	@echo "Habit Kernel Module - Build System"
	@echo "  make all       - Build release binary"
	@echo "  make debug     - Build debug binary with symbols"
	@echo "  make run       - Build and run"
	@echo "  make clean     - Remove build artifacts"
	@echo "  make help      - Show this help"
