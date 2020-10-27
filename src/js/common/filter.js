// import Vue from 'vue'
import lodash from 'lodash'
// let moment = require('moment')
let moment = window.moment
import store from '@/store'

Vue.filter('formatTime', function (value, format) {
    if (!format) {
        format = 'YYYY-MM-DD HH:mm:ss'
    }

    return value && parseInt(value) ? moment(parseInt(value)).format(format) : '-'
})

Vue.filter('time', function (value) {
    if (!value) return ''
    let date = new Date(value)
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    let getDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return `${year}-${month}-${getDate}`
}) // permission control

Vue.filter('statusFilter', function (status) {
    switch (status) {
        case 0: return '待支付'
        case 1: return '待发货'
        case 2: return '待收货'
        case 3: return '交易成功'
        case 4: return '交易关闭'
        case 5: return '部分发货'
    }
    return '待支付'
})
Vue.filter('afterStatusFilter', function (status) {
    switch (status) {
        case 0: return '审核中'
        case 1: return '审核通过'
        case 2: return '售后成功'
        case 3: return '售后关闭(用户取消)'
        case 4: return '售后驳回(拒绝)'
        case 5: return '售后失败(信息有误，重新填写)'
    }
    return '无售后'
})
Vue.filter('groupStatusFilter', function (status) {
    switch (status) {
        case 1: return '待成团'
        case 2: return '拼团成功'
        case 3: return '拼团失败'
    }
    return ''
})
Vue.filter('divideFilter', (value) => {
    var float = parseFloat(value || 0)
    return (float / 100).toFixed(2)
})

export function divide (value) {
    var float = parseFloat(value || 0)
    return (float / 100).toFixed(2)
}

/*
*return 整数
*/
Vue.filter('multiplyFilter', (value) => {
    var float = parseFloat(value || 0)
    return (float * 100).toFixed(0)
})

export function multiply (value) {
    var float = parseFloat(value || 0)
    return (float * 100).toFixed(0)
}

/*
* 数组转字符串，逗号分割
*/
export function arrayToString (array, char) {
    if (!char) {
        char = ','
    }
    let str = ''
    array.forEach((value, index) => {
        if (index) {
            str += char
        }
        str += value.url
    })
    return str
}

/*
* 字符串转数组：图片
*/
export function stringToArray (str, char) {
    if (!str) {
        return []
    }
    if (!char) {
        char = ','
    }
    let array = str.split(char)
    array = array.map((item) => {
        return {
            url: item
        }
    })
    return array
}

Vue.filter('specFilter', (value) => {
    if (!value) {
        return
    }
    let spec = '规格：'
    try {
        let specJson = JSON.parse(value)
        let flag = 0
        for (let key in specJson) {
            if (flag) {
                spec += '，'
            }
            flag = 1
            spec += specJson[key]
        }
    } catch (e) {
        return
    }
    return spec
})

Vue.filter('filterSpecialChar', (value) => {
    if (!value) {
        return
    }
    let spec = '规格：'
    try {
        let specJson = JSON.parse(value)
        let flag = 0
        for (let key in specJson) {
            if (flag) {
                spec += '，'
            }
            flag = 1
            spec += specJson[key]
        }
    } catch (e) {
        return
    }
    return spec
})
export function formatTime (time, format) {
    if (!format) {
        format = 'YYYY-MM-DD HH:mm:ss'
    }
    return moment(parseInt(time)).format(format)
}

Vue.filter('customTimeFormat', (value, formatter) => {
    if (value) {
        var mo = moment(value)
        if (mo.isValid()) {
            value = mo.format(formatter)
        }
        return value
    } else {
        return '-'
    }
})

Vue.filter('dateTimeFormat', value => {
    if (value) {
        var mo = moment(value)
        if (mo.isValid()) {
            value = mo.format('YYYY-MM-DD')
        }
        return value
    } else {
        return '-'
    }
})

Vue.filter('hourTimeFormat', value => {
    if (value) {
        var mo = moment(value)
        if (mo.isValid()) {
            value = mo.format('YYYY-MM-DD HH')
        }
        return value
    } else {
        return '-'
    }
})

Vue.filter('minuteTimeFormat', value => {
    if (value) {
        value = parseInt(value)
        var mo = moment(value)
        if (mo.isValid()) {
            value = mo.format('YYYY-MM-DD HH:mm')
        }
        return value
    } else {
        return '-'
    }
})

Vue.filter('secondTimeFormat', value => {
    if (value) {
        value = parseInt(value)
        var mo = moment(value)
        if (mo.isValid()) {
            value = mo.format('YYYY-MM-DD HH:mm:ss')
        }
        return value
    } else {
        return '-'
    }
})

Vue.filter('countryFilter', function (code) {
    let countryList = store.state.dict.countryList
    let item = countryList.find((val) => {
        return val.shortCode == code
    })
    if (code == 'ID') {
        return '印尼'
    }
    if (code == 'CN') {
        return '中国'
    }
    return item ? item.nameCn : code
})

Vue.filter('currencyUnitFilter', function (code) {
    let countryList = store.state.dict.countryList
    let item = countryList.find((val) => {
        return val.shortCode == code
    })
    return item ? item.currencyUnit : ''
})
