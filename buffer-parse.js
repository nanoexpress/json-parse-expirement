const simdJson = require('simdjson');
const FastJson = require('fast-json');
const TurboJSON = require('turbo-json-parse');
const avsc = require('avsc');

const TurboCompile = TurboJSON(
  {
    type: 'object',
    properties: { hello: { type: 'string' } }
  },
  {
    buffer: true
  }
);
const AvroCompile = avsc.Type.forSchema({
  type: 'record',
  fields: [{ name: 'hello', type: 'string' }]
});

const data = ['{', '"hello"', ':', '"world"', '}'].map((text) =>
  Buffer.from(text)
);
const table = [];

const runWay = (func) => {
  return func(Buffer.concat(data));
};

const bench = (name, fn) => {
  const startTime = Date.now();
  for (let i = 0; i < 4e5; i++) {
    fn();
  }
  table.push({ name, 'time taken': Date.now() - startTime + 'ms' });
};

const run = () =>
  new Promise((resolve) => {
    bench('JSON.parse', () => runWay((data) => JSON.parse(data.toString())));
    bench('@dalisoft/turbo-json-parse', () =>
      runWay((data) => TurboCompile(data))
    );
    bench('avsc', () =>
      runWay((data) => AvroCompile.fromString(data.toString()))
    );
    bench('simdJson.parse', () =>
      runWay((data) => simdJson.parse(data.toString()))
    );

    resolve();
  });

async function main() {
  console.log('Benchmark started...');
  await run();
  console.log('Benchmark done');

  console.table(table);
}

main();
