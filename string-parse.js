const simdJson = require('simdjson');
const FastJson = require('fast-json');
const TurboJSON = require('turbo-json-parse');
const avsc = require('avsc');

const Data = require('./data');
const TurboCompile = TurboJSON(Data.JSONSchema);
const AvroCompile = avsc.Type.forSchema(Data.AVROSchema);

const table = [];
let result_1x = 0;

const bench = (name, fn, init = false) => {
  const startTime = Date.now();
  for (let i = 0; i < 2e5; i++) {
    fn();
  }
  const difference = Date.now() - startTime;
  let speed = 1;
  if (init) {
    result_1x = difference;
  } else {
    speed = Math.round((result_1x / difference) * 100) / 100;
  }
  table.push({
    name,
    'time taken': difference + 'ms',
    'speed ratio': speed
  });
};

console.log(
  'JSON buffer size',
  parseFloat(Data.JSONString.length / 1024).toFixed(3),
  'Kb'
);

const run = () =>
  new Promise((resolve) => {
    bench('JSON.parse', () => JSON.parse(Data.JSONString), true);
    bench('@dalisoft/turbo-json-parse', () => TurboCompile(Data.JSONString));
    bench('avsc', () => AvroCompile.fromString(Data.JSONString));
    bench('simdJson.parse', () => simdJson.parse(Data.JSONString));
    bench('simdJson.lazyParse', () => {
      const lazyParse = simdJson.lazyParse(Data.JSONString);
      const json = {};
      for (
        let i = 0, property, len = Data.JSONSchemaKeys.length;
        i < len;
        i++
      ) {
        property = Data.JSONSchemaKeys[i];
        json[property] = lazyParse.valueForKeyPath(property);
      }
      return json;
    });

    const options = {};
    bench('fast-json', () => {
      const fj = new FastJson(options);
      const json = {};
      for (
        let i = 0, property, len = Data.JSONSchemaKeys.length;
        i < len;
        i++
      ) {
        property = Data.JSONSchemaKeys[i];
        fj.on(property, function addToJson(value) {
          json[property] = value;
        });
      }
      fj.write(Data.JSONString);
      return json;
    });

    resolve();
  });

async function main() {
  console.log('Benchmark started...');
  await run();
  console.log('Benchmark done');

  console.table(table);
}

main();
