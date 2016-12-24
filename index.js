var Bluebird = require("bluebird");

module.exports = function (thisArg, _arguments, P, generator) {
    // always use Bluebird:
    P = Bluebird;

    // keep track of the currently awaited promise:
    var currentPromise = P.resolve();

    return new P(function (resolve, reject, onCancel) {
        // The currently awaited promise is also canceled:
        onCancel(function () {currentPromise.cancel()});

        function step(result) {
            if (currentPromise.isCancelled()) {
                return;
            }

            currentPromise = P.resolve(result.value);

            if (result.done) {
                resolve(currentPromise);
            }
            else {
                currentPromise.then(fulfilled, rejected);
            }
        }

        // Rest is copied from original awaiter:
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        step((generator = generator.apply(thisArg, _arguments)).next());
    })
        // This ensures any consumer lastly-s will be invoked only after the last awaited promise's lastly is resolved:
        .lastly(function () {return currentPromise.reflect()});
};
