package main

import (
    "fmt"
    "log"
    "net/http"
)

func main() {
    fs := http.FileServer(http.Dir("./"))
    http.Handle("/", fs)
    http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "ok")
    })
    port := ":8080"
    log.Printf("Serving on http://localhost%s\n", port)
    log.Fatal(http.ListenAndServe(port, nil))
}

void *kmalloc(size_t size);  // Pre-allocated 64KB pool
void kfree(void *ptr);        // Fragmentation-free
