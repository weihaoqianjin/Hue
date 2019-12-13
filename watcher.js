class Watcher {
    constructor (vm, expression, cb) {
        this.vm = vm
        this.expression = expression
        this.cb = cb
        this.value = this.get()
    }
    get () {
        let val = this.vm
        pushTarget(this)
        this.expression.split('.').forEach(item => {
            val = val[item]
        })
        popTarget()
        return val
    }
    update () {
        let val = this.vm
        this.expression.split('.').forEach((key) => {
            val = val[key]
        })
        this.cb.call(this.vm, val, this.value)
        this.value = val
    }
    addDep (dep) {
        dep.addSub(this)
    }
}