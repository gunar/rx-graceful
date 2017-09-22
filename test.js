'use strict'

const test = require('tape')
const Rx = require('rxjs')

require('.')(Rx)


test('subscribes normally', t => {
  t.plan(1)
  {
    const $ = new Rx.Subject()
    $.subscribe(t.pass, t.fail)
    $.next()
  }
})

test('catches exceptions on map()', t => {
  t.plan(2)
  let err = 0
  const $ = new Rx.Subject()
  $
    .map(x => {
      if (x === 1) throw Error(++err)
      else return x
    })
    .subscribe(x => {
      t.equal(x, 2, 'does not terminate Subject')
    }, function (err) {
      t.equal(err.message, '1', 'calls error handler')
    })
  $.next(1)
  $.next(2)
})

test('catches rejections on flatMap()', t => {
  t.plan(2)
  const $ = new Rx.Subject()
  let err = 0
  $
    .flatMap(async x => {
      if (x === 'A') throw Error(++err)
      else return x
    })
    .subscribe(x => {
      t.equal(x, 'B', 'does not terminate Subject')
    }, err => {
      t.equal(err.message, '1', 'calls error handler')
    })
  $.next('A')
  $.next('B')
})

test('catches exceptions on subscriber function', t => {
  t.plan(1)
  const $ = new Rx.Subject()
  let err = 0
  $
    .subscribe(x => {
      throw Error(++err)
    }, err => {
      t.equal(err.message, '1')
    })
  $.next()
})
