class Compiler {
  constructor (el, vm) {
    vm.$el = document.querySelector(el)
    this.replace(vm.$el, vm)
  }
  replace (el, vm) {
    let childNodes = [...el.childNodes]
    let self = this
    childNodes.forEach(node => {
      let txt = node.textContent
      // 正则匹配{{}}
      let reg = /\{\{(.*?)\}\}/g
      if (node.nodeType === Node.TEXT_NODE && reg.test(txt)) {
        // 考虑文本内容出现多次{{}}
        let moustache = txt.match(reg)
        moustache.forEach(subMoustache => {
          // 为{{}}中的属性绑定watcher
          this.watch(node, subMoustache, vm, moustache, txt)
        })
      }
      // 如果是元素节点
      if (node.nodeType === Node.ELEMENT_NODE) {
        let nodeAttr = [...node.attributes]
        nodeAttr.forEach(attr => {
          let name = attr.name
          let exp = attr.value
          switch (name) {
            case 'v-model':
                node.value = this.getExpValue(exp, vm)
                vm.$watch(exp, function(newVal) {
                  node.value = newVal
                })
                node.addEventListener('input', e => {
                  let newVal = e.target.value
                  self.setExpValue(exp, newVal, vm)
                })
                break
            case '@click':
                node.addEventListener('click', e => {
                  let tep = /(.+)\((.*)\)/.exec(exp)
                  let [func, params] = [tep[1], tep[2].split(',')]
                  // 判断参数是否来自data选项，若否则直接以字符形式作为入参
                  params = params.map(key => {
                    return self.getExpValue(key, vm) || key
                  })
                  vm.$options.methods[func].apply(vm, params)
                })
                break
          }
        })
      }
      // 如果还有子节点，继续递归replace
      if (node.childNodes && node.childNodes.length) {
        this.replace(node, vm);
      }
    })
  }
  watch (node, content, vm, moustache, txt) {
    let self = this
    let prop = (/\{\{(\S*)\}\}/).exec(content)[1]
    self.replaceContent(node, moustache, vm, txt)
    vm.$watch(prop, function () {
      self.replaceContent(node, moustache, vm, txt)
    })
  }
  replaceContent (node, moustache, vm, txt) {
    for (let mkey of moustache) {
      let prop = (/\{\{(\S*)\}\}/).exec(mkey)[1]
      let value = this.getExpValue(prop, vm)
      txt = txt.replace(mkey, value).trim()
    }
    node.textContent = txt
  }
  getExpValue (exp, vm) {
    if (/^\'(.*)\'$/.test(exp) || /^(\d+)$/.test(exp)) return RegExp.$1
    let arr = exp.trim().split('.')
    let val = vm
    for (let key of arr) {
      val = val[key]
    }
    return val
  }
  setExpValue (exp, value, vm) {
    let arr = exp.split('.')
    let val = vm
    arr.forEach((key, i)=> {
      if (i === arr.length - 1) {
        val[key] = value
        return
      }
      val = val[key]
    })
  }
}