# koa-awaitable
A couple of functions to allow Koa to accept async / await endpoints and middleware

# Api

## Handler

`.handler: (fn: () => Promise<any>): Generator<any, any, any>`

The above signature expresses the interface for this function in [flowtype's](http://flowtype.org/) syntax.

In plain english, the handler function expects as its argument a function which returns a promise. That function, when executed, will have its context bound to Koa's request context.

It returns a generator function, which is what Koa will expect to receive.

## Middleware

`.middleware: (before: () => Promise<any>, after: () => Promise<any>): () => Generator<any, any, any>`

The above signature expresses the interface for this function in [flowtype's](http://flowtype.org/) syntax.

The middleware function expects as its arguments two functions which return a promise. Those functions, when executed, will have their context bound to Koa's request context.

The first function will be executed prior to the execution of the subsequent middleware or handlers in the stack, the second function after.

That's all!

# Usage

Note, the examples are in ES6 / ES7 syntax. Sorry if that doesn't float your boat. I'd love a PR. :)

```javascript
import koa from 'koa'
import koaRouter from 'koa-router'
import awaitable from 'koa-awaitable'

let app = koa()
let router = koaRouter()

let middle = awaitable.middleware(async function() {
  this.body = '1'
}, async function() {
  this.body += ' 3'
  return
})

router.get('/', middle, awaitable.handler(async function() {
  this.body += ' 2'
}))

app.use(router.routes())

app.listen(8888)

// Sending a GET to localhost:8888 should return '1 2 3'
```
