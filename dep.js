class Dep {
    constructor () {
        // 存放watcher
        this.sub = []
    }
    // 依赖添加
    addDepend () {
        if (Dep.target) {
          Dep.target.addDep(this)
        }
    }
    addSub (sub) {
        this.sub.push(sub)
    }
    notify () {
        for (let sub of this.sub) {
            sub.update()
        }
    }
}