<template>
    <el-dialog
        title="展示商品设置"
        :visible="showProductDialog"
        @close="handleClose"
        :close-on-click-modal="false"
        class="show-product-dialog"
    >
        <el-form :rules="rules" label-width="100px">
            <el-form-item label="奖品名称：" prop="nameList">
                <ul class="lang-list">
                    <li v-for="(val, key) in nameList"
                        :key="key"
                    >
                        <span class="text">{{ getLangName(key) }}：</span><el-input v-model="nameList[key]"></el-input>
                    </li>
                </ul>
            </el-form-item>
            <el-form-item label="图片：" prop="iconList">
                <multi-lang-file-upload :propFileList="iconList"  @setData="setData"></multi-lang-file-upload>
            </el-form-item>
            <el-form-item label="商品价值：">
                <el-select v-model="param.type">
                    <el-option v-for="item in priceList" :key="item.key" :value="item.key" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="footer" slot="footer">
            <el-button size="medium" @click="handleClose">取消</el-button>
            <el-button size="medium" type="primary" :loading="loading" @click="handleConfirm">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { addShowProductList, editShowProductList } from '@/api/shake.js'
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    export default {
        props: {
            showProductDialog: Boolean,
            priceList: Array,
            propParam: Object,
            countryCode: String
        },
        data () {
            return {
                param: {
                    icon: '',
                    name: '',
                    type: 1
                },
                loading: false,
                nameList: {},
                iconList: []
            }
        },
        components: {
            multiLangFileUpload
        },
        computed: {
            languageList () {
                return this.$store.state.dict.languageList
            }
        },
        mounted () {
            if (this.propParam) {
                Object.assign(this.param, this.propParam)
                if (this.propParam.name) {
                    this.nameList = JSON.parse(this.propParam.name)
                }
                if (this.propParam.icon) {
                    let data = JSON.parse(this.propParam.icon)
                    for (let key in data) {
                        this.iconList.push({
                            languageCode: key,
                            name: data[key]
                        })
                    }
                }
            }
            this.init()
        },
        methods: {
            init () {
                for (let i = 0; i < this.languageList.length; i++) {
                    let lang = this.languageList[i].code
                    let nameItem = this.nameList[lang]
                    if (!nameItem) {
                        this.$set(this.nameList, lang, '')
                    }
                }
            },
            getLangName (code) {
                let item = this.languageList.find((val) => {
                    return val.code == code
                })
                return item ? item.desc : ''
            },
            setData (data) {
                this.iconList = data
            },
            handleClose () {
                this.$emit('close')
            },
            handleConfirm () {
                if (!this.nameList['cn'] || !this.nameList['en']) {
                    return this.$message.warning('中英文奖品名称不能为空')
                }
                let iconItem = this.iconList.filter((val) => {
                    return (val.languageCode == 'cn' && val.name) || (val.languageCode == 'en' && val.name)
                })
                if (iconItem.length < 2) {
                    return this.$message.warning('中英文图片不能为空')
                }
                let Obj = {}
                for (let i = 0; i < this.iconList.length; i++) {
                    Obj[this.iconList[i].languageCode] = this.iconList[i].name
                }
                let param = JSON.parse(JSON.stringify(this.param))
                this.loading = true
                param.icon = JSON.stringify(this.filterData(Obj))
                param.name = JSON.stringify(this.filterData(this.nameList))
                param.countryCode = this.countryCode
                let fetchUrl = addShowProductList
                if (param.id) {
                    fetchUrl = editShowProductList
                }
                fetchUrl(param).then((res) => {
                    this.loading = false
                    if (res.ret.errCode === 0) {
                        this.$emit('confirm')
                    }
                }).catch(() => {
                    this.loading = false
                })
            }
        }
    }
</script>

<style scoped lang="scss">
.show-product-dialog {
    .lang-list {
        li {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
            .text {
                width: 90px;
            }
        }
    }
}
</style>
