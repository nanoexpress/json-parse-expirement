const msgpack = require('msgpackr');

const raw = Buffer.from('Hello world');
const res = msgpack.unpack(raw);
const unres = msgpack.pack('Hello world');

console.log('raw', raw);
console.log('result', res);
console.log('result 2', unres);