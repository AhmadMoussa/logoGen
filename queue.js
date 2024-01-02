
class MinPriorityQueue {
    constructor() {
      this.heap = [];
    }
  
    // Insert an element with a specified priority.
    insert(element, priority) {
      const node = { element, priority };
      this.heap.push(node);
      this.bubbleUp(this.heap.length - 1);
    }
  
    // Extract the element with the lowest priority.
    extractMin() {
      if (this.heap.length === 0) {
        return null; // Queue is empty
      }
  
      if (this.heap.length === 1) {
        return this.heap.pop().element;
      }
  
      const min = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.bubbleDown(0);
      return min.element;
    }
  
    // Peek at the element with the lowest priority without removing it.
    peek() {
      if (this.heap.length === 0) {
        return null; // Queue is empty
      }
      return this.heap[0].element;
    }
  
    // Helper function to maintain the min-heap property by bubbling up.
    bubbleUp(index) {
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        if (this.heap[index].priority < this.heap[parentIndex].priority) {
          [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
          index = parentIndex;
        } else {
          break;
        }
      }
    }
  
    // Helper function to maintain the min-heap property by bubbling down.
    bubbleDown(index) {
      while (true) {
        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        let smallest = index;
  
        if (leftChildIndex < this.heap.length && this.heap[leftChildIndex].priority < this.heap[smallest].priority) {
          smallest = leftChildIndex;
        }
  
        if (rightChildIndex < this.heap.length && this.heap[rightChildIndex].priority < this.heap[smallest].priority) {
          smallest = rightChildIndex;
        }
  
        if (smallest !== index) {
          [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
          index = smallest;
        } else {
          break;
        }
      }
    }
  }