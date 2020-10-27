// import axios from 'axios'
import {
    Message
} from 'element-ui'
// 统一请求路径前缀
// let base = process.env.VUE_APP_FILE_URL
// http: //192.168.31.70:4000/getText
let base = 'https://text.fingo.shop/'
let url = 'getText'
// 超时设定
axios.defaults.timeout = 45000

axios.interceptors.request.use(config => {
    return config
}, err => {
    Message.error('请求超时')
    return Promise.resolve(err)
})

/**
 * 上传base64
 */
export const ocrRequest = (params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;'
        }
    });
};

