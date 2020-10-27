export default {
    data () {
        return {}
    },
    methods: {
        // 多语言展示中文
        getMultiLangShowInfo (langData, type) {
            if (!langData) {
                return ''
            }
            let item = langData.find((val) => {
                return val.languageCode == 'cn'
            })
            switch (type) {
                case 'image':
                    return item ? this.dealShowFileSrc(item.name.split(',')) : ''
                default:
                    return item ? item.name : ''
            }
        }
    }
}
