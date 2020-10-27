import { param } from '@/utils/index.js'
import { Message } from 'element-ui'
const md5 = require('js-md5')
const BASE = process.env.VUE_APP_NEW_API + 'api/proxyboss'

const NO_TOAST_ERRCODE = [] // 不需要弹出其他提示errcode值

const httpService = window.axios.create({
    timeout: 45000
})

/**
 * @param {*} method get post
 * @param {*} serviceName 服务名称
 * @param {*} interfaceName 接口名称
 * @param {*} data 入参
 * @param {*} $header 额外请求头
 * @param {*} baseUrl 请求地址
 * @param {*} noToast 是否需求提示错误码
 * @param {*} timeoutNoToast 超时操作的提示，（特用于针对-1状态码）
 */
function request ({ method, serverName, interfaceName, data, $header, baseUrl, noToast, timeoutNoToast }) {
    // 生成签名
    let signData = data ? JSON.parse(JSON.stringify(data)) : {}
    let date = new Date().getTime()
    Object.assign(signData, {
        timestamp: date
    })
    let md5Req = md5(param(Object.keys(signData).sort()))
    let userInfo = localStorage.adminUserInfo ? JSON.parse(localStorage.adminUserInfo) : null
    // header信息处理
    let headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'Language-Code': 'cn',
        'Operator-ID': userInfo ? userInfo.id : null,
        'Device-Type': 'boss',
        'Signature': md5Req,
        'serverName': serverName,
        'interfaceName': interfaceName,
        'Country-Code': 'MY'
    }
    if ($header) {
        Object.assign(headers, $header)
    }
    Object.assign(data, {
        sign: md5Req,
        operationId: userInfo ? userInfo.id : null,
        timestamp: date,
        operation: userInfo ? userInfo.account : ''
    })
    console.log(`${interfaceName}`)
    console.log(data)
    return httpService({
        url: baseUrl ? baseUrl : BASE,
        method: method ? method : 'post',
        data: data,
        headers: headers
    }).then((res) => {
        console.log(`${interfaceName}`)
        console.log(res.data)
        if (res.status !== 200) {
            const err = new Error('服务器异常')
            throw err
        }
        let result = res.data
        if (result.ret.errCode === 0) {
            return result
        } else {
            if (NO_TOAST_ERRCODE.includes(result.ret.errCode)) {
                console.log('errcode, 特殊处理')
            } else {
                let msg = result.ret.msg ? result.ret.msg : result.ret.errName
                if (timeoutNoToast && result.ret.errCode === -1) {
                    return result
                } else if (!noToast) {
                    Message.warning(msg ? msg : '哇哦，服务器出错啦，请稍候再试~')
                }
            }
            return result
        }
    }).catch((err) => {
        Message.warning('哇哦，服务器出错啦，请稍候再试~')
        throw err
    })
}
export default request
