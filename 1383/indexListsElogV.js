//Java: add, peek, poll, size

const assert = (e) => {
  if (!e) {
    throw new Error('assertion failed');
  }
};
/* 
  делаем min heap специально под алгоритм Дейкстры:
  - можно compare не передавать, а параметр constructor - кол-во v
  - вместо одного массива heap - три массива. один с heap по dist, второй - с v соответствующим этому dist, третий - по номеру вершины говорит в каком индексе лежит ее dist
  - при каждом swap обновляется не только первые два массива, но и третий
  - при добавлении явно указываются два параметра - v, dist, если такая вершина уже есть в heap - то в этом месте уменьшаем значение до dist и продвигаем к родителю
*/

class VertexDistHeap {
  constructor(nV) { // number of vertices
    this.distHeap = [null];
    this.v = [null]; // v[index as in distHeap] -> vertex number
    this.vToIndex = Array.from({ length: nV }, () => -1); // vToIndex[vertex number] -> index in distHeap
  }

  getLeftChildIndex(index) {
    return index << 1;
  }

  getRightChildIndex(index) {
    return (index << 1) + 1;
  }

  getParentIndex(index) {
    return index >> 1;
  }

  swap(index1, index2) {
    const dist1 = this.distHeap[index1];
    const dist2 = this.distHeap[index2];
    this.distHeap[index1] = dist2;
    this.distHeap[index2] = dist1;

    const v1 = this.v[index1];
    const v2 = this.v[index2];
    this.v[index1] = v2;
    this.v[index2] = v1;

    this.vToIndex[v2] = index1;
    this.vToIndex[v1] = index2;
  }

  peek() {
    assert(this.distHeap.length > 1);
    return this.distHeap[1];
  }

  add(dist, vertex) {
    assert(0 <= vertex && vertex < this.vToIndex.length);
    let currentIndex;

    if (this.vToIndex[vertex] === -1) {
      this.distHeap.push(dist);
      this.v.push(vertex);
      this.vToIndex[vertex] = this.v.length - 1;
      currentIndex = this.distHeap.length - 1;
    } else {
      currentIndex = this.vToIndex[vertex];
      const oldDist = this.distHeap[currentIndex];
      assert(dist < oldDist);

      this.distHeap[currentIndex] = dist;
    }

    let parentIndex = this.getParentIndex(currentIndex);

    while (currentIndex > 1 && this.distHeap[currentIndex] < this.distHeap[parentIndex]) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  poll() {
    assert(this.distHeap.length > 1);

    this.swap(1, this.distHeap.length - 1);

    const minDist = this.distHeap.pop();
    const minV = this.v.pop();
    this.vToIndex[minV] = -1;

    if (this.distHeap.length > 2) { // distHeap[0] = null 
      let currentIndex = 1;
      let leftChildIndex = this.getLeftChildIndex(currentIndex);
      let rightChildIndex = this.getRightChildIndex(currentIndex);

      while (true) {
        assert(leftChildIndex < rightChildIndex);

        if (!(leftChildIndex < this.distHeap.length)) {
          break;
        }

        const smallerChildIndex = !(rightChildIndex < this.distHeap.length) ||
          this.distHeap[leftChildIndex] < this.distHeap[rightChildIndex]
          ? leftChildIndex : rightChildIndex;

        if (this.distHeap[currentIndex] < this.distHeap[smallerChildIndex]) {
          break;
        }

        this.swap(currentIndex, smallerChildIndex);
        currentIndex = smallerChildIndex;
        leftChildIndex = this.getLeftChildIndex(currentIndex);
        rightChildIndex = this.getRightChildIndex(currentIndex);
      }
    }

    return [minDist, minV];
  }

  size() {
    return this.distHeap.length - 1;
  }
}

let lines = require('fs').readFileSync(0, 'binary').trim().split(/\r?\n/);
const [nv, ne, s] = lines[0].trim().split(/\s+/).map(Number);
const adj = Array.from({ length: nv }, () => -1);
const vertices = Array.from({ length: ne * 2 }, () => 0);
const distances = Array.from({ length: ne * 2 }, () => 0);
const nexts = Array.from({ length: ne * 2 }, () => 0);

for (let i = 0; i < ne; i++) {
  const [v1, v2, dist] = lines[i + 1].trim().split(/\s+/).map(Number);

  vertices[i * 2] = v2;
  distances[i * 2] = dist;
  nexts[i * 2] = adj[v1];
  adj[v1] = i * 2;

  vertices[i * 2 + 1] = v1;
  distances[i * 2 + 1] = dist;
  nexts[i * 2 + 1] = adj[v2];
  adj[v2] = i * 2 + 1;
}

lines = null;

const INF = 2_009_000_999;
const minDist = Array.from({ length: nv }, () => INF);
minDist[s] = 0;

const pq = new VertexDistHeap(nv);
pq.add(0, s);

while (pq.size() > 0) {
  const [dist, v] = pq.poll();
  assert(dist === minDist[v]);

  for (let i = adj[v]; i !== -1; i = nexts[i]) {
    const to = vertices[i];
    const d = distances[i];
    const newDist = dist + d;

    if (newDist < minDist[to]) {
      minDist[to] = newDist;
      pq.add(newDist, to);
    }
  }
}

console.log(minDist.join(' '));

/*
5 7 1
1 2 5
1 3 2
2 3 4
2 4 3
3 4 6
0 3 20
0 4 10
*/