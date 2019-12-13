function proxy (target, sourceKey, key) {
    Reflect.defineProperty(target, key, {
        set (newVal) {
            target[sourceKey][key] = newVal
        },
        get () {
            return target[sourceKey][key]
        }
    })
}

function observe (data) {
    if (typeof data !== 'object') return false
    return new Observer(data)
}

function defineReactive (obj, key, value) {
    let dep = new Dep()
    Reflect.defineProperty(obj, key, {
        get () {
            if (Dep.target) {
                dep.addDepend()
            }
            return value
        },
        set (newVal) {
            value = newVal
            dep.notify()
        }
    })
}

function pushTarget (watcher) {
    Dep.target = watcher
}

function popTarget () {
    Dep.target = null
}

function resolveWatch (vm) {
    let watch = vm.$options.watch
    if (!watch) return 'no watch'
    Object.keys(watch).forEach(item => {
        if (typeof watch[item] === 'function') {
            vm.$watch(item, watch[item])
        }
        if (typeof watch[item] === 'object') {
            if (watch[item].deep) {
                Object.keys(vm[item]).forEach(key => {
                    vm.$watch(item + '.' + key, watch[item].handler)
                })
            } else {
                vm.$watch(item, watch[item].handler)
            }
        }
    })
}

function initOptions (vm) {
    observe(vm._data)
}