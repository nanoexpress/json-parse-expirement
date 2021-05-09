const avro = require('avsc');

const type = avro.Type.forSchema({
  type: 'record',
  fields: [{ name: 'name', type: 'string' }]
});

// Buffer
const buff = Buffer.from(JSON.stringify({ name: 'John' }));

// String
const from_str = type.fromBuffer(buff); // Encoded buffer

console.log('str', from_str);
