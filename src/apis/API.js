module.exports = class API {
  constructor(name, env = []) {
    this.name = name;
    this.env = env;

    Object.defineProperty(this, 'env', {
      enumerable: false
    });
  }
}
