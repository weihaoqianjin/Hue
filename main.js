class Hue {
    constructor (options) {
        let vm = this
        vm.$options = options
        vm._data = options.data
        for (let key in vm._data) {
            proxy(vm, '_data', key)
        }
        // 初始化$watch监听函数
        vm.$watch = function (key, cb) {
            new Watcher(vm, key, cb)
        }
        initOptions(vm)
        // watch 选项解析
        resolveWatch(vm)
        // 编译模板
        new Compiler(vm.$options.el, vm)
    }
}