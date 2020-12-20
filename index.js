const simdJson = require("simdjson");
const FastJson = require("fast-json");
const TurboJSON = require("turbo-json-parse");

const bench = (name, fn) => {
  console.time(name);
  for (let i = 0; i < 200000; i++) {
    fn();
  }
  console.timeEnd(name);
};

// Create large JSON file
let JSON_BUFF_LARGE = {};
let schema = { type: "object", properties: {} };
for (let i = 0; i < 40; i++) {
  // 20 is close to 0.5Kb which very small, but you can increase this value
  JSON_BUFF_LARGE["key_" + i] = Math.round(Math.random() * 1e16).toString(16);
  schema.properties["key_" + i] = { type: "string" };
}
JSON_BUFF_LARGE = JSON.stringify(JSON_BUFF_LARGE);

console.log(
  "JSON buffer LARGE size is ",
  parseFloat(JSON_BUFF_LARGE.length / 1024).toFixed(2),
  "Kb"
);

bench("json.parse - large", () => JSON.parse(JSON_BUFF_LARGE));
bench("simdjson - large", () => simdJson.parse(JSON_BUFF_LARGE));

const schemaKeys = Object.keys(schema.properties);
bench("simdjson - lazyParse", () => {
  const lazyParse = simdJson.lazyParse(JSON_BUFF_LARGE);
  const json = {};
  for (let i = 0, property, len = schemaKeys.length; i < len; i++) {
    property = schemaKeys[i];
    json[property] = lazyParse.valueForKeyPath(property);
  }
  return json;
});

const options = {};
bench("fast-json stream", () => {
  const fj = new FastJson(options);
  const json = {};
  for (let i = 0, property, len = schemaKeys.length; i < len; i++) {
    property = schemaKeys[i];
    fj.on(property, function addToJson(value) {
      json[property] = value;
      fj._events.off(property, addToJson);
    });
  }
  fj.write(JSON_BUFF_LARGE);
  return json;
});

const _schema = TurboJSON(schema);
bench("turbo-json?", () => {
  return _schema(JSON_BUFF_LARGE);
});
