export namespace debug {

    export let loggers: any = Object.create(null);

    export const isActive = true;
    export function log(value: string, logger?: any) {
        if (!isActive) return;

        if (logger) {
            window.console.debug('[' + logger.id + '] ' + value);
        } else {
            window.console.debug('value');
        }
    };

    // TODO: LOGGERLOGGERLOGGERLOGGERLOGGER
    export function id(logger: any, loggerClass: string) {
        if (!isActive) return;

        if (!loggers[loggerClass]) {
            loggers[loggerClass] = Object.create(null);
            loggers[loggerClass].currentIndex = 0;
        }

        loggers[loggerClass][loggers[loggerClass].currentIndex] = logger;

        return loggerClass + ' ' + loggers[loggerClass].currentIndex++;
    };

    export function compare(left: any, right: any) {
        // First check if number of keys is identical. This is needed in case right has keys that left does not.
        if (Object.keys(left).length !== Object.keys(right).length) {
            console.log('Object.keys(left).length !== Object.keys(right).length');
            console.log(Object.keys(left).length + ' !== ' + Object.keys(right).length);
            return false;
        }

        for (let prop in left) {
            // Check if left has a key that right does not
            if (!right[prop]) {
                console.log('!right[prop]');
                console.log('prop === ' + prop);
                return false;
            }

            // If the left[prop] is a primitive, compare it to right[prop]
            if (typeof left[prop] === 'string' || typeof left[prop] === 'number') {
                if (left[prop] !== right[prop]) {
                    console.log('left[' + prop + '] !== right[' + prop + ']');
                    console.log(left[prop] + ' !== ' + right[prop]);
                    return false;
                } else {
                    continue;
                }
            }

            // if we've reached this point then left[prop] must be an object so lets see if right[prop] is also an object
            if (typeof right[prop] === 'string' || typeof left[prop] === 'number') {
                console.log('typeof right[' + prop + '] === \'string\' || typeof left[' + prop + '] === \'number\')');
                console.log(left[prop] + ' !== ' + right[prop]);
                return false;
            }

            // By now, we've established that both left[prop] and right[prop] are objects, so lets recurse on them
            if (!compare(left[prop], right[prop])) return false;
        }



        return true;
    }
}

export default debug;