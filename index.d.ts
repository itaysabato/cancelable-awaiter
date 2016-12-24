declare namespace awaiter {}

declare interface awaiter {
    (thisArg: any, _arguments: any, P: Function, generator: Function): any;
}

export = awaiter;
