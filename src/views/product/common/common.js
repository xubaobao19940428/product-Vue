import { categoryListGet } from '@/request/product'
export default {
    data () {
        return {}
    },
    methods: {
        // 获取下一级分类
        getSubCategory (data, resolve) {
            if (data.level == 0) {
                return
            }
            let value = JSON.parse(data.value)
            this.fetchCategory({
                pid: parseInt(value.cateId),
                cateType: this.cateType ? this.cateType : 2,
                level: data.level + 1,
                resolve
            })
        },
        // 获取分类
        fetchCategory({ id, cateType, level, pid, page, countryCode, resolve }) {
            categoryListGet(this.filterData({
                pid: pid,
                id: id,
                level: level,
                cateType: cateType,
                page: page,
                countryCode: countryCode
            })).then((res) => {
                if (res.ret.errcode === 1) {
                    for (let i = 0; i < res.categoryUnit.length; i++) {
                        res.categoryUnit[i]['levelValue'] = []
                        let item = res.categoryUnit[i].cateNameValue.find((val) => {
                            return val.languageCode == 'cn'
                        })
                        res.categoryUnit[i]['cateName'] = item ? item.name : ''
                        res.categoryUnit[i]['prop'] = JSON.stringify({
                            cateId: String(res.categoryUnit[i].cateId),
                            cateName: item ? item.name : ''
                        })
                        if (cateType == 2) {
                            res.categoryUnit[i]['leaf'] = level > 2
                        } else {
                            res.categoryUnit[i]['leaf'] = level > 1
                        }
                    }
                    resolve && resolve(res.categoryUnit, res)
                }
            })
        }
    }
}
