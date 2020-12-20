const simdJson = require("simdjson");
const FastJson = require("fast-json");
const TurboJSON = require("turbo-json-parse");

const Data = require("./data");
const TurboCompile = TurboJSON(Data.JSONSchema);

const table = [];

const bench = (name, fn) => {
  const startTime = Date.now();
  for (let i = 0; i < 200000; i++) {
    fn();
  }
  table.push({ name, "time taken": Date.now() - startTime + "ms" });
};

console.log(
  "JSON buffer size",
  parseFloat(Data.JSONString.length / 1024).toFixed(3),
  "Kb"
);

const run = () =>
  new Promise((resolve) => {
    bench("JSON.parse", () => JSON.parse(Data.JSONString));
    bench("@dalisoft/turbo-json-parse", () => TurboCompile(Data.JSONString));
    bench("simdJson.parse", () => simdJson.parse(Data.JSONString));
    bench("simdJson.lazyParse", () => {
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
    bench("fast-json", () => {
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
          fj._events.off(property, addToJson);
        });
      }
      fj.write(Data.JSONString);
      return json;
    });

    resolve();
  });

async function main() {
  console.log("Benchmark started...");
  await run();
  console.log("Benchmark done");

  console.table(table);
}

main();
