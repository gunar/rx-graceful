'use strict'

module.exports = function (Rx) {
  const { flatMap, subscribe } = Rx.Subject.prototype
  Rx.Subject.prototype.flatMap = function (predicate) {
    return flatMap.call(this, (...args) => {
      const $ = new Rx.Subject()
      predicate(...args).then(x => {
        $.next(x)
        $.complete()
      }).catch(e => {
        $.error(e)
        $.complete()
      })
      return $
    })
  }

  Rx.Subject.prototype.subscribe = function (onNext, onError, onComplete, ...rest) {
    if (typeof onNext !== 'function') {
      // internal Rx methods calling subscribe,
      // so just give it the original one
      return subscribe.call(this, onNext, onError, onComplete, ...rest)
    }
    const graceful$ = this.catch(function (e, $) {
      if (typeof onError === 'function') onError(e)
      return $
    })
    // return subscribe.call(graceful$, onNext, onError, onComplete, ...rest)
    return subscribe.call(graceful$, (...args) => {
        try {
          return onNext(...args)
        } catch (e) {
          if (typeof onError === 'function') onError(e)
        }
    }, onError, onComplete)
  }
}
