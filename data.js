const JSONSchema = { type: 'object', properties: {} };
const JSON_LARGE_OBJECT = {};

const AVROSchema = {
  type: 'record',
  fields: []
};

const N_KB = 512;
const DATA_ROW = Math.round(N_KB / 25.7);

for (let i = 0; i < DATA_ROW; i++) {
  // 20 is close to 0.5Kb which very small, but you can increase this value
  JSON_LARGE_OBJECT['key_' + i] = Math.round(Math.random() * 1e16).toString(16);
  JSONSchema.properties['key_' + i] = { type: 'string' };

  // avsc
  AVROSchema.fields[i] = { name: 'key_' + i, type: 'string' };
}
const JSONString = JSON.stringify(JSON_LARGE_OBJECT);
const JSONSchemaKeys = Object.keys(JSONSchema.properties);

module.exports = {
  JSONSchema,
  AVROSchema,
  JSONSchemaKeys,
  JSON_LARGE_OBJECT,
  JSONString
};
