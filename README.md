# Cancelable Awaiter
A replacement for Typescript's default awaiter helper that supports Bluebird promise cancellations.

## Installation
`npm install --save cancelable-awaiter`

## Usage
Depends on [bluebird](https://www.npmjs.com/package/bluebird) being installed as a dependency and configured to support [cancellations](http://bluebirdjs.com/docs/api/cancellation.html):
```typescript
import * as tslib from "tslib";
import * as Bluebird from "bluebird";
import * as awaiter from "cancelable-awaiter";

Bluebird.config({
    cancellation: true
});

(tslib as any).__awaiter = awaiter;
```

Then async/await syntax can be used in conjunction with promise cancellations:

```typescript
async function doSomeThings() {
    await doFirstThing()
        .then(() => console.log("Done first thing!"))
        // will be invoked anyway:
        .finally(() => console.log("May have done first thing."));
    
    await doSecondThing()
        .then(() => console.log("Done second thing!"));
}

const promise = doSomeThings()
    .finally(() => console.log("May have done some things."));

Promise.delay(1000)
    .then(() => promise.cancel());
```
