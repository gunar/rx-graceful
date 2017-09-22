# rx-graceful ![rxjs logo](https://frontendmasters.com/assets/logo-128.png)

[![CircleCI](https://circleci.com/gh/gunar/rx-graceful/tree/master.svg?style=svg)](https://circleci.com/gh/gunar/rx-graceful/tree/master)

Makes RxJS Subjects graceful. Why? Because...

- Exceptions usually terminate Subjects and often swallow errors.
- It's naive to be confident our code does not contain an exception.

## Installation

```
npm install rx-graceful
```

## Example

```js
'use strict'

const Rx = require('rxjs')

require('rx-graceful')(Rx)

const $ = new Rx.Subject()

$
  // (1) catches exceptions inside map
  .map(() => { throw Error() })
  // (2) catches rejections inside flatMap
  .flatMap(x => Promise.reject())
  // (3) catches exceptions inside async functions (as these are rejections as well)
  .flatMap(async x => { throw Error() })
  .subscribe(x => {
    // (4) catches exceptions inside the subscription handler
    throw Error()
  }, e => {
    // Handles errors (1), (2), (3), (4)
  })

$.next('some value')
```

## Future improvements

- Use [lettable operators]() instead of mutating `Subject.prototype`, as soon as
    they're out of beta

[lettable operators]: https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md
