// EventEmitter: to emit event on MVC
// adapted from https://alexatnet.com/model-view-controller-mvc-in-javascript/
class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(evt='', listener=()=>{}) {
        (this.events[evt] || (this.events[evt] = [])).push(listener);
        return this;
    }
    emit(evt='', ...args) {
        (this.events[evt] || []).slice().forEach(listener => listener(...args));
    }
}

export {EventEmitter};