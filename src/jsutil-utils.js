/*
 * @Author: daieh
 * @LastEditors: daieh
 * @Description: 工具函数
 */
// 检验数据类型
export const typeOf = (data) => {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
}

// 防抖: 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
export const debounce = (() => {
  let timer = null
  return (callback, wait = 800) => {
    timer && clearTimeout(timer)
    timer = setTimeout(callback, wait)
  }
})()

// 节流: 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。
export const throttle = (() => {
  let last = 0
  return (callback, wait = 800) => {
    let now = + new Date()
    if (now - last > wait) {
      callback()
      last = now
    }
  }
})()

// 手机号脱敏
export const hideMobile = (mobile) => {
  return mobile.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
}

// 大小写转换 str 待转换的字符串  type 1-全大写 2-全小写 3-首字母大写
export const turnCase = (str, type) => {
  switch (type) {
    case 1:
      return str.toUpperCase()
    case 2:
      return str.toLowerCase()
    case 3:
      return str[0].toUpperCase() + str.substring(1).toLowerCase()
    default:
      return str
  }
}

// 解析URL参数
export const getSearchParams = () => {
  const searchPar = new URLSearchParams(window.location.search)
  const paramsObj = {}
  for (const [key, value] of searchPar.entries()) {
    paramsObj[key] = value
  }
  return paramsObj
}

// 判断手机是Andoird还是IOS
export const getOSType = () => {
  let u = navigator.userAgent, app = navigator.appVersion
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  if (isIOS) {
    return 'IOS'
  }
  if (isAndroid) {
    return 'Android'
  }
  return 'Other'
}

// 滚动到页面顶部
export const scrollToTop = () => {
  const height = document.documentElement.scrollTop || document.body.scrollTop
  if (height > 0) {
    window.requestAnimationFrame(scrollToTop)
    window.scrollTo(0, height - height / 8)
  }
}

// 滚动到元素位置
export const smoothScroll = element => {
  document.querySelector(element).scrollIntoView({
    behavior: 'smooth'
  })
}
// smoothScroll('#target')  平滑滚动到 ID 为 target 的元素

// uuid 唯一标识
export const uuid = () => {
  const temp_url = URL.createObjectURL(new Blob())
  const uuid = temp_url.toString()
  URL.revokeObjectURL(temp_url) //释放这个url
  return uuid.substring(uuid.lastIndexOf('/') + 1)
}

// 下载文件 api-接口 params-请求参数   fileName-文件名
export const downloadFile = (api, params, fileName, type = 'get') => {
  axios({
    method: type,
    url: api,
    responseType: 'blob',
    params: params
  }).then((res) => {
    let str = res.headers['content-disposition']
    if (!res || !str) {
      return
    }
    let suffix = ''
    // 截取文件名和文件类型
    if (str.lastIndexOf('.')) {
      fileName ? '' : fileName = decodeURI(str.substring(str.indexOf('=') + 1, str.lastIndexOf('.')))
      suffix = str.substring(str.lastIndexOf('.'), str.length)
    }
    //  如果支持微软的文件下载方式(ie10+浏览器)
    if (window.navigator.msSaveBlob) {
      try {
        const blobObject = new Blob([res.data])
        window.navigator.msSaveBlob(blobObject, fileName + suffix)
      } catch (e) {
        console.log(e)
      }
    } else {
      //  其他浏览器
      let url = window.URL.createObjectURL(res.data)
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName + suffix)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(link.href)
    }
  }).catch((err) => {
    console.log(err.message)
  })
}

// 深拷贝
export const deepClone = parent => {
  // 判断类型
  const isType = (obj, type) => {
    if (typeof obj !== "object") return false
    const typeString = Object.prototype.toString.call(obj)
    let flag
    switch (type) {
      case "Array":
        flag = typeString === "[object Array]"
        break
      case "Date":
        flag = typeString === "[object Date]"
        break
      case "RegExp":
        flag = typeString === "[object RegExp]"
        break
      default:
        flag = false
    }
    return flag
  }

  // 处理正则
  const getRegExp = re => {
    var flags = ""
    if (re.global) flags += "g"
    if (re.ignoreCase) flags += "i"
    if (re.multiline) flags += "m"
    return flags
  }
  // 维护两个储存循环引用的数组
  const parents = []
  const children = []

  const _clone = parent => {
    if (parent === null) return null
    if (typeof parent !== "object") return parent

    let child, proto

    if (isType(parent, "Array")) {
      // 对数组做特殊处理
      child = []
    } else if (isType(parent, "RegExp")) {
      // 对正则对象做特殊处理
      child = new RegExp(parent.source, getRegExp(parent))
      if (parent.lastIndex) child.lastIndex = parent.lastIndex
    } else if (isType(parent, "Date")) {
      // 对Date对象做特殊处理
      child = new Date(parent.getTime())
    } else {
      // 处理对象原型
      proto = Object.getPrototypeOf(parent)
      // 利用Object.create切断原型链
      child = Object.create(proto)
    }

    // 处理循环引用
    const index = parents.indexOf(parent)

    if (index != -1) {
      // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
      return children[index]
    }
    parents.push(parent)
    children.push(child)

    for (let i in parent) {
      // 递归
      child[i] = _clone(parent[i])
    }

    return child
  }
  return _clone(parent)
}

// 模糊搜索 list-原数组  keyWord-查询的关键词  attribute-数组需要检索属性
export const fuzzyQuery = (list, keyWord, attribute = 'name') => {
  const reg = new RegExp(keyWord)
  const arr = []
  for (let i = 0; i < list.length; i++) {
    if (reg.test(list[i][attribute])) {
      arr.push(list[i])
    }
  }
  return arr
}