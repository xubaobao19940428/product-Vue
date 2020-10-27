import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router/index.js'
let moment = require('moment')

/**
 * 过滤数据中为空的属性, 在vue的数据对象请求前的过滤
 * @param data
 * @returns data
 */
const filterData = (data) => {
    let newData = JSON.parse(JSON.stringify(data))
    for (let item in newData) {
        if (!newData[item] && newData[item] !== 0) {
            delete newData[item]
        } else if (typeof newData[item] === 'string') {
            newData[item] = newData[item].trim()
        }else if(typeof newData[item] === 'object'){
            if(Object.keys(newData[item].length!=0)){
                newData[item] = filterData(newData[item])
            }else{
                delete newData[item]
            }
        }
    }
    return newData
}
/**
 * 图片上传之前校验
 * @param file
 * @returns boolean
 */
const onImgBeforeUpload = (file) => {
    const isIMAGE = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isIMAGE) {
        Message.error('上传文件只能是图片格式!')
        return false
    }
    if (!isLt2M) {
        Message.error('上传文件大小不能超过 2MB!')
        return false
    }
    return true
}
/**
 * 按钮权限
 * @param key
 * @returns boolean
 */
const hasPermission = (key) => {
    let userInfo = localStorage.adminUserInfo ? JSON.parse(localStorage.adminUserInfo) : {
        account: ''
    }
    if (userInfo.account == 'admin') {
        return true
    }

    let item = store.state.user.permissionKey[key]
    if (item) {
        return true
    }
    return false
}
const downLoadByUrl = (url, name) => {
    let xhr = new XMLHttpRequest()
    // GET请求,请求路径url,async(是否异步)
    xhr.open('GET', url, true)
    // 设置请求头参数的方式,如果没有可忽略此行代码
    xhr.setRequestHeader('token', localStorage.getItem('adminToken'))
    xhr.setRequestHeader('deviceId', new DeviceUUID().get())
    xhr.setRequestHeader('version', '2.4.0')
    // 设置响应类型为 blob
    xhr.responseType = 'blob'
    // 关键部分
    xhr.onload = function (e) {
    // 如果请求执行成功
        if (this.status == 200) {
            let blob = this.response
            let a = document.createElement('a')
            // 创键临时url对象
            let url = URL.createObjectURL(blob)
            a.download = name

            a.href = url
            a.click()
            // 释放之前创建的URL对象
            window.URL.revokeObjectURL(url)
        }
    }
    // 发送请求
    xhr.send()
}

const triggerToOderList = (orderNo) => {
    router.push({
        name: 'orderList',
        query: {
            orderNo: orderNo
        }
    })
}
const clickToUserInfo = (userId) => {
    router.push({
        name: 'userInfo',
        query: {
            userId: userId
        }
    })
}
const clickToMemberInfo = (id) => {
    router.push({
        name: 'memberInfo',
        query: {
            userId: id
        }
    })
}
const dealShowFileSrc = (img) => {
    if (img && img.indexOf('http') != -1) {
        return img
    }
    return img ? (process.env.VUE_APP_FILE_URL + img) : ''
}

// 获取积分单位
const getCurrencyUnit = (code, key) => {
    let countryList = store.state.dict.countryList
    let item = countryList.find((val) => {
        return val.shortCode == code
    })
    if (key) {
        return item ? item[key] : null
    }
    return item ? key : null
}
//时间戳转化为年/月/日 时:分:秒
const timestampToTime =(timestamp)=> {
    var date = new Date(timestamp) 
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = (date.getDate()+1 <= 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
      var h = (date.getHours()+1 <= 10 ? '0'+(date.getHours()) : date.getHours())  + ':';
      var m = (date.getMinutes()+1 <= 10 ? '0'+(date.getMinutes()) : date.getMinutes())  + ':';
      var s = (date.getSeconds()+1 <= 10 ? '0'+(date.getSeconds()) : date.getSeconds());
      return Y+M+D+h+m+s;
  }
  //时间转时间戳
  const timeTotimestamp=(val)=>{
      var time = new Date(val)
      var timer=time.getTime()
      return timer
  }
  //对象数组去重
  const  deleteObject=(obj)=> {
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < obj.length; i++) {
      var keys = Object.keys(obj[i]);
      keys.sort(function (a, b) {
        return Number(a) - Number(b);
      });
      var str = "";
      for (var j = 0; j < keys.length; j++) {
        str += JSON.stringify(keys[j]);
        str += JSON.stringify(obj[i][keys[j]]);
      }
      if (!stringify.hasOwnProperty(str)) {
        uniques.push(obj[i]);
        stringify[str] = true;
      }
    }
    uniques = uniques;
    return uniques;
  }
export default {
    filterData,
    onImgBeforeUpload,
    hasPermission,
    downLoadByUrl,
    triggerToOderList,
    clickToUserInfo,
    clickToMemberInfo,
    dealShowFileSrc,
    getCurrencyUnit,
    timestampToTime,
    timeTotimestamp,
    deleteObject
}
