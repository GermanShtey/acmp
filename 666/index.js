const assert = (e) => {
  if (!e) {
    throw new Error('assertion failed');
  }
};

class Scanner {
  constructor() {
    this.fs = require('fs');
    this.b = Buffer.alloc(1 << 16);
    this.pos = 0;
    this.size = 0;
    this.EOF = -1;
    this.nextInt = this.nextInt.bind(this);
  }

  _nextChar() { // returns code of next char and skips it or returns EOF if the stream ended
    if (this.pos === this.size) {
      this.size = this.fs.readSync(0, this.b, 0, this.b.length);
      this.pos = 0;

      if (this.size === 0) {
        return this.EOF;
      }
    }

    assert(this.pos < this.size);

    const ans = this.b[this.pos];
    this.pos++;

    return ans;
  }

  nextInt() {
    const SPACE = ' '.charCodeAt(0);
    const CR = '\r'.charCodeAt(0);
    const LF = '\n'.charCodeAt(0);
    const ZERO = '0'.charCodeAt(0);
    const NINE = '9'.charCodeAt(0);
    const MINUS = '-'.charCodeAt(0);
    let ch = this._nextChar();

    while (ch === SPACE || ch === CR || ch === LF) {
      ch = this._nextChar();
    }

    let multiply = 1;

    if (ch === MINUS) {
      ch = this._nextChar();
      multiply = -1;
    }

    assert(ZERO <= ch && ch <= NINE);

    let n = ch - ZERO;
    ch = this._nextChar();

    while (ZERO <= ch && ch <= NINE) {
      const d = ch - ZERO;
      n = n * 10 + d;
      ch = this._nextChar();
    }

    assert(ch === SPACE || ch === CR || ch === LF || ch === this.EOF);

    return n * multiply;
  }
}

const input = new Scanner();
const nextInt = input.nextInt;

let pos = nextInt();
let found = false;

for (let step = 26; step >= 1 && !found; step--) {
  const prevSize = (1 << (step - 1)) - 1;

  if (pos === 1) {
    console.log(String.fromCharCode('a'.charCodeAt() + (step - 1)));
    found = true;
  } else if (pos <= 1 + prevSize) {
    pos--;
  } else {
    pos -= 1 + prevSize;
  }
}

assert(found);

/*
шаг 1 - 1 = 2^1 - 1;
шаг 2 - 1 + (шаг 1) * 2 = 1 + 1 * 2 = 3 = 2^2 - 1;
шаг 3 - 1 + (шаг 2) * 2 = 1 + 3 * 2 = 7 = 2^3 - 1;
шаг 4 - 1 + (шаг 3) * 2 = 1 + 7 * 2 = 15 = 2^4 - 1;

найти символ на позиции N = 10 в строке после шага 4
найти символ на позиции N = 2 в строке после шага 3
найти символ на позиции N = 1 в строке после шага 2 для первого символа шага ответ получается по кодам символов String.fromCharCode('a'.charCodeAt() + (step - 1))
dcbaabaacbaabaa
???????????????
d#######$$$$$$$
         ^
шаг 4 = d + (шаг 3 длины 7) + (шаг 3 длины 7);

10

10 - 7 + 1 = 2

шаг 3 = c + (шаг 2 длины 3) + (шаг 2 длины 3);

c###$$$
 ^
*/
