import { getModulePages, getVariableListByLanguage } from '@/request/i18n.js'

export default {
    data () {
        return {
            searchParam: {
                languageCode: '',
                variableCodeKey: '',
                nameCnKey: '',
                nameEnKey: '',
                translationKey: '',
                pageId: '0',
                platform: 'APP',
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                }
            },
            totals: 0,
            moduleList: [],
            langList: [],
            pageTranslateList: []
        }
    },
    computed: {
        languageList () {
            return this.$store.state.dict.languageList
        }
    },
    methods: {
        getSelectLangInfo () {
            let item = this.languageList.find((val) => {
                return val.code == this.searchParam.languageCode
            })
            return item || { name: '' }
        },
        getModuleList (platform) {
            console.log(this.searchParam.platform)
            this.searchParam.platform = platform || this.searchParam.platform
            getModulePages({platform:this.searchParam.platform}).then((res) => {
                if (res.ret.errcode === 1) {
                    this.moduleList = res.moduleInfo
                }
            })
        },
        handleSizeChange (value) {
            this.searchParam.page.pageSize = value
            this.getList()
        },
        // 获取翻译项
        getList (page, platform) {
            setTimeout(() => {
                if (this.$refs.multipleTable) {
                    this.$refs.multipleTable.doLayout()
                }
            }, 200)
            if (!this.searchParam.pageId && this.searchParam.pageId != 0) {
                return
            }
            this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
            this.searchParam.platform = platform || this.searchParam.platform
            console.log(this.searchParam.platform)
            getVariableListByLanguage(this.filterData(this.searchParam)).then((res) => {
                if (res.ret.errcode === 1) {
                    this.pageTranslateList = res.variableTranslation
                    this.totals = res.total
                }
            })
        }
    }
}
