const AssemJSON = require("./assemblyscript-json");

class Handler extends AssemJSON.JSONHandler {
  stack = new Array();

  reset() {
    while (this.stack.length > 0) {
      this.stack.pop();
    }
  }

  get peek() {
    return this.stack[this.stack.length - 1];
  }

  setString(name, value) {
    const obj = JSON.Value.String(value);
    this.addValue(name, obj);
  }

  setBoolean(name, value) {
    const obj = JSON.Value.Bool(value);
    this.addValue(name, obj);
  }

  setNull(name) {
    const obj = JSON.Value.Null();
    this.addValue(name, obj);
  }

  setInteger(name, value) {
    const obj = JSON.Value.Number(value);
    this.addValue(name, obj);
  }

  pushArray(name) {
    const obj = JSON.Value.Array();
    if (this.stack.length == 0) {
      this.stack.push(obj);
    } else {
      this.addValue(name, obj);
      this.stack.push(obj);
    }
    return true;
  }

  popArray() {
    if (this.stack.length > 1) {
      this.stack.pop();
    }
  }

  pushObject(name) {
    const obj = JSON.Value.Object();
    this.addValue(name, obj);
    this.stack.push(obj);
    return true;
  }

  popObject() {
    if (this.stack.length > 1) {
      this.stack.pop();
    }
  }

  addValue(name, obj) {
    if (name.length == 0 && this.stack.length == 0) {
      this.stack.push(obj);
      return;
    }
    if (this.peek instanceof JSON.Obj) {
      this.peek.set(name, obj);
    } else if (this.peek instanceof JSON.Arr) {
      this.peek.push(obj);
    }
  }
}

const decoder = new AssemJSON.JSONDecoder(new JSONHandler());
const parse = (str) => {
  let arr;
  if (typeof str === "string") {
    arr = Buffer.fromString(str);
  }
  decoder.deserialize(arr);
  const res = decoder.handler.peek;
  decoder.handler.reset();
  return res;
};

module.exports = { decoder, parse };
