export namespace debug {

    let loggers: any = Object.create(null);

    export const isActive = true;
    export const log = (value: string, logger?: any) => {
        if (!isActive) return;

        if (logger) {
            window.console.debug('[' + logger.id + '] ' + value);
        } else {
            window.console.debug('value');
        }
    };

    // TODO: LOGGERLOGGERLOGGERLOGGERLOGGER
    export const id = (logger: any, loggerClass: string) => {
        if (!isActive) return;

        if (!loggers[loggerClass]){
            loggers[loggerClass] = Object.create(null);
            loggers[loggerClass].currentIndex = 0;
        }

        loggers[loggerClass][loggers[loggerClass].currentIndex] = logger;

        return loggerClass + ' ' + loggers[loggerClass].currentIndex++;
    };
}

export default debug;