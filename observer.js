class Observer {
    constructor (data) {
        this.walk(data)
    }
    walk (data) {
        for (let key in data) {
            if (typeof data[key] === 'object') {
                this.walk(data[key])
                continue
            }
            defineReactive(data, key, data[key])
        }
    }
}