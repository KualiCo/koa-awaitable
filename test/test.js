import koa from 'koa'
import koaRouter from 'koa-router'
import axios from 'axios'
import assert from 'assert'
import supertest from 'supertest'

import awaitable from '../index'

describe('the endpoint wrapper', function() {
  it('should return a body, just like a normal endpoint', async function() {
    let handler = awaitable.handler(async function() {
      this.body = {msg: 'To be or not to be...'}
    })

    let app = koa()
    let router = koaRouter()
    router.get('/', handler)
    app.use(router.routes())

    let agent = supertest(app.listen())

    let res = await agent.get('/').expect(200)

    assert.equal(res.body.msg, 'To be or not to be...')
  })
})

describe('the middleware wrapper', function() {
  it('should call before and after promise functions', async function() {
    let handler = awaitable.handler(async function() {
      this.body = {msg: this.body.msg + 'that is the question.'}
    })

    let middle = awaitable.middleware(async function() {
      this.body = {msg: 'To be or not to be, '}
    }, async function() {
      this.body = {msg: this.body.msg + ' The end.'}
    })

    let app = koa()
    let router = koaRouter()
    router.get('/', middle, handler)
    app.use(router.routes())

    let agent = supertest(app.listen())

    let res = await agent.get('/').expect(200)

    assert.equal(res.body.msg, 'To be or not to be, that is the question. The end.')
  })
})
