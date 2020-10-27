const axios = window.axios;
import router from '@/router';
import qs from 'qs';
import { Message } from 'element-ui'

// const BASE = 'https://boss-dev.fingo.shop';
const BASE = process.env.VUE_APP_JOSN_API;

//用户信息
let userInfo = localStorage.adminUserInfo ? JSON.parse(localStorage.adminUserInfo) : null;

const http = axios.create({
    baseUrl: BASE,
    timeout: 45000,
    method: 'POST',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // 'Language-Code': 'cn',
        'Operator-ID': userInfo ? userInfo.id : null,
    }
});

http.interceptors.request.use(config => {
    const contentType = config.headers['Content-Type'];

    //删除请求参数中的null和undefined
    for (const key in config.data) {
        if (config.data[key] === null || config.data[key] === undefined) {
            delete config.data[key];
        }
    }

    //Content-Type 为form表单形式时，序列化请求参数
    if (contentType.indexOf('application/x-www-form-urlencoded') >= 0) {
        config.data = qs.stringify(config.data);
    }

    //拼接url
    config.url = config.baseUrl + config.url;

    // if (config.method.toLowerCase() == 'get') {
    //     config.url = config.url + '?' + qs.stringify(config.data);
    // }

    return config;
}, err => {
    return Promise.resolve(err);
});

http.interceptors.response.use(response => {
    if (response.status !== 200) {
        const err = new Error('服务器异常');
        throw err;
    }
    switch (response.data.code) {
        case 1:
            return response.data;
        case 704:
            if (localStorage.getItem('adminToken')) {
                Message.warning(`ErrorMsg: ${response.data.msg ? response.data.msg : response.data.msg}, ErrorCode: ${response.data.code}`)
            }
            localStorage.clear();
            router.push({
                name: 'login'
            });
            break;
        case 1009:
            return response.data;
        default:
            Message.error(response.data.msg);
            throw new Error(response.data.msg);
    }
}, err => {
    if (err.message) {
        Message.error(err.message)
    }
    throw err;
});

export default http;