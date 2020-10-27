// import axios from 'axios'
import { Message } from 'element-ui'
// 统一请求路径前缀
let base = process.env.VUE_APP_FILE_URL
// 超时设定
axios.defaults.timeout = 45000

axios.interceptors.request.use(config => {
    return config
}, err => {
    Message.error('请求超时')
    return Promise.resolve(err)
})

/**
 * 上传文件(图片视频)
*/
export const uploadFileRequest = (url, params) => {
    let config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    return axios.post(`${base}${url}`, params, config)
        .then(res => res.data)
}

export const uploadFileRequestByUrl = (url, params) => {
    let config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    return axios.post(`${base}${url}`, params, config)
        .then(res => res.data)
}
