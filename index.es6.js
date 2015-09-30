// @flow
type PromiseFn = () => Promise<any>;
type GeneratorFn = () => Generator<any, any, any>;

function handler(fn: PromiseFn): GeneratorFn {
  return function* () {
    yield fn.call(this)
  }
}

function middleware(before: PromiseFn, after?: PromiseFn): GeneratorFn {
  return function* (next) {
    yield before.call(this)
    yield next
    if (after) {
      yield after.call(this)
    }
  }
}

export default {handler, middleware}
