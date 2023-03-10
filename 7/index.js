function readline() {
  const fs = require('fs');
  const b = Buffer.alloc(1);
  let s = '';
  while (true) {
      const len = fs.readSync(0, b);
      if (len == 0) {
          return s;
      }
      if (b[0] == 13) {
          continue;
      }
      if (b[0] == 10) {
          return s;
      }
      s += b;
  }
}

const [a, b, c] = readline().split(' ');

const max = (strA, strB) => {
  if (strA.length === strB.length) {
    return strA > strB ? strA : strB;
  }

  return strA.length > strB.length ? strA : strB;
};

console.log(max(max(a, b), c));
