import EventEmitter, * as modules from "./index";

for (const name in modules) {
    (EventEmitter as any)[name] = modules[name];
}

export default EventEmitter;
