<template>
    <el-dialog :title="title"
               width="700px"
               append-to-body
               :visible="propShowDialog"
               @close="close">
        <div>
            <el-form ref="addDialog" label-position="right" label-width="110px" label-suffix="："
                     :rules="rules"
                     :model="param">
                <el-form-item label="标签" prop="label">
                    <div class="btn-wrapper">
                        <div class="form-tips">该标签展示于客户端商品详情页和订单详情页中，请认真填写</div>
                        <el-button type="primary" size="mini" plain :loading="labelTransLoading" @click="translate(param.label, 'label')">一键翻译</el-button>
                    </div>
                    <table class="table table-bordered table-info">
                        <tbody>
                        <tr v-for="(item, index) in param.label" :key="index">
                            <th><span class="required" v-if="item.languageCode === 'cn' || item.languageCode === 'en'">*</span> {{getLangName(item.languageCode)}}{{item.languageCode}}： </th>
                            <td>
                                <el-form-item ref="multiLangForm" :required="item.languageCode === 'cn' || item.languageCode === 'en' ? true : false"  :prop="`label[${index}].name`">
                                    <el-input v-model="item.name" :show-word-limit="true" maxlength="100" clearable size="medium" placeholder="请输入"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </el-form-item>
                <el-form-item label="文案" prop="document">
                    <div class="btn-wrapper">
                        <div class="form-tips">该标签展示于客户端商品详情页和订单详情页中，请认真填写</div>
                        <el-button type="primary" size="mini" plain :loading="documentTransLoading" @click="translate(param.document, 'document')">一键翻译</el-button>
                    </div>
                    <table class="table table-bordered table-info">
                        <tbody>
                        <tr v-for="(item, index) in param.document" :key="index">
                            <th><span class="required" v-if="item.languageCode === 'cn' || item.languageCode === 'en'">*</span> {{getLangName(item.languageCode)}}{{item.languageCode}}： </th>
                            <td>
                                <el-form-item ref="multiLangForm" :required="item.languageCode === 'cn' || item.languageCode === 'en' ? true : false"  :prop="`document[${index}].name`">
                                    <el-input v-model="item.name" :show-word-limit="true" maxlength="1000" clearable size="medium" placeholder="请输入"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </el-form-item>
                <el-form-item label="详情图">
                    <div class="form-tips mar-t-10">如有需要可上传详情图作为规则的补充说明</div>
                    <multi-lang-file-upload :propFileList="param.detailPicture" @setData="setCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
                <el-form-item label="售后期限" prop="afterSaleRestrict">
                    <el-input-number v-model="param.afterSaleRestrict" label="小时"></el-input-number>
                    <span class="mar-l-10">指商品确认收货后，售后申请通道的开放时长</span>
                </el-form-item>
                <el-form-item label="适用范围" prop="rangeType">
                    <el-select class="mar-b-10" v-model="param.rangeType" placeholder="请选择">
                        <el-option v-for="(item, i) in rangeTypeEum"
                                   :key="i"
                                   :label="item"
                                   :value="parseInt(i)">
                        </el-option>
                    </el-select>
                    <el-form-item v-if="param.rangeType == 2" ref="rangeTyForm" model="param" :required="true" error="请选择" prop="productType">
                        <el-select v-model="param.productType" multiple placeholder="请选择">
                            <el-option v-for="(item, key) in productType"
                                       :key="key"
                                       :label="item"
                                       :value="parseInt(key)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="param.rangeType == 1" ref="rangeTyForm" model="param" :required="true" error="请选择" prop="afterSaleCate">
                        <div>
                            <el-tag v-for="(tag, i) in param.afterSaleCate"
                                    :key="tag.cateId"
                                    @close="removeCategory(tag, i)"
                                    closable>{{tag.cateName}}
                            </el-tag>
                        </div>
                        <el-cascader filterable
                                     clearable
                                     remote
                                     @visible-change="clearSelectCategory"
                                     @change="addCategory"
                                     :props="{label: 'cateName',multiple: true, checkStrictly: false, children: 'levelValue', value: 'prop', lazy: true, lazyLoad: getSubCategory}"
                                     placeholder="请选择"
                                     :options="categoryOptions"
                                     v-model="selectedOptions"
                                     class="normalOperatorBox"
                                     size="medium">
                        </el-cascader>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="外显类型" prop="showType">
                    <div class="form-tips mar-t-10">选择“全部外显”代表该标签将展示于APP商品详情页、搜索列表页、购物车、订单列表页及详情页；</div>
                    <el-radio-group v-model="param.showType">
                        <el-radio v-for="(item, key) in showType" :key="parseInt(key)" :label="parseInt(key)">{{ item }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="close">取 消</el-button>
                <el-button size="small" type="primary" @click="confirm()">确 定</el-button>
            </span>
    </el-dialog>
</template>
<script>
    import { getOneKeyTranslation } from '@/request/i18n'
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    import { addAfterSale, updateAfterSale } from '@/request/pledge'
    import productCommon from '../../common/common'
    export default {
        props: {
            propShowDialog: Boolean,
            propParam: {
                type: Object,
                default: () => { return {} }
            },
            title: {
                type: String,
                default: '售后策略'
            },
            productType: Object,
            rangeTypeEum: Object,
            showType: Object
        },
        data () {
            return {
                rules: {
                    label: [{ required: true, message: '不能为空', trigger: 'change' }],
                    document: [{ required: true, message: '不能为空', trigger: 'change' }],
                    afterSaleRestrict: [{ required: true, message: '不能为空', trigger: 'change' }],
                    showType: [{ required: true, message: '不能为空', trigger: 'change' }],
                    rangeType: [{ required: true, message: '不能为空', trigger: 'change' }]
                },
                param: {
                    label: [],
                    document: [],
                    detailPicture: [],
                    afterSaleRestrict: '',
                    afterSaleCate: [],
                    productType: [],
                    showType: 3,
                    rangeType: 1,
                    afterSaleId: null
                },
                labelTransLoading: false,
                documentTransLoading: false,
                selectedOptions: [],
                categoryOptions: []
            }
        },
        components: {
            multiLangFileUpload
        },
        mixins: [productCommon],
        computed: {
            languageList () {
                return this.$store.state.dict.languageList
            }
        },
        watch: {
            propParam (val) {
                if (val) {
                    Object.assign(this.param, JSON.parse(JSON.stringify(val)))
                    this.init()
                }
            },
            propShowDialog (val) {
                if (val) {
                    Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)))
                    this.init()
                }
            }
        },
        created () {
            this.fetchCategory({
                cateType: 2,
                level: 1,
                resolve: (data) => {
                    this.categoryOptions = data
                }
            })
        },
        methods: {
            init () {
                for (let i = 0; i < this.languageList.length; i++) {
                    let lang = this.languageList[i].code
                    let label = this.param.label.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!label) {
                        this.param.label.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                    let desc = this.param.document.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!desc) {
                        this.param.document.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                }
            },
            // 一键翻译
            translate (data, type) {
                let item = data.find((val) => {
                    return val.languageCode == 'cn'
                })
                if (!item || !item.name) {
                    return this.$message.warning('请先填写中文')
                }
                let param = []
                for (let i = 0; i < this.languageList.length; i++) {
                    if (this.languageList[i].code != 'cn') {
                        param.push({
                            fromLanguageCode: 'cn',
                            originContent: item.name,
                            toLanguageCode: this.languageList[i].code
                        })
                    }
                }
                this[type + 'TransLoading'] = true
                getOneKeyTranslation({
                    oneKeyTranslationUnit: param
                }).then((res) => {
                    this[type + 'TransLoading'] = false
                    if (res.ret.errcode === 1) {
                        console.log(res.oneKeyTranslationUnit.length)
                        for (let i = 0; i < res.oneKeyTranslationUnit.length; i++) {
                            let transItem = res.oneKeyTranslationUnit[i]
                            let itemI = this.param[type].findIndex((val) => {
                                return val.languageCode == transItem.toLanguageCode
                            })
                            console.log(item)
                            console.log(this.param[type][itemI].name)
                            if (itemI != -1 && !this.param[type][itemI].name) {
                                this.param[type][itemI].name = transItem.translation
                            }
                        }
                    }
                }).catch(() => {
                    this[type + 'TransLoading'] = false
                })
            },
            getLangName (code) {
                let item = this.languageList.find((val) => {
                    return val.code == code
                })
                return item ? item.desc : ''
            },
            setCover (data) {
                this.param.detailPicture = data
            },
            // 后台类目
            addCategory () {
                for (let i = 0; i < this.selectedOptions.length; i++) {
                    let data = JSON.parse(this.selectedOptions[i][2])
                    let item = this.param.afterSaleCate.find((val) => {
                        return val.cateId == data.cateId
                    })
                    if (!item) {
                        this.param.afterSaleCate.push(data)
                    }
                }
            },
            clearSelectCategory (show) {
                if (!show) {
                    this.selectedOptions = []
                }
            },
            removeCategory (tag, i) {
                this.param.afterSaleCate.splice(i, 1)
            },
            close () {
                this.reset()
                this.$emit('close')
            },
            reset () {
                this.param = {
                    label: [],
                    document: [],
                    detailPicture: [],
                    afterSaleRestrict: '',
                    afterSaleCate: [],
                    productType: [],
                    showType: 3,
                    rangeType: 1,
                    afterSaleId: null
                }
                this.$refs['addDialog'].clearValidate()
                for (let i = 0; i < this.$refs['multiLangForm'].length; i++) {
                    this.$refs['multiLangForm'][i].clearValidate()
                }
                for (let i = 0; i < this.$refs['rangeTyForm'].length; i++) {
                    this.$refs['rangeTyForm'][i].clearValidate()
                }
            },
            confirm () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        let canSubmit = true
                        for (let i = 0; i < this.$refs['multiLangForm'].length; i++) {
                            this.$refs['multiLangForm'][i].validate((isValid) => {
                                if (!isValid) {
                                    canSubmit = false
                                }
                            })
                        }
                        for (let i = 0; i < this.$refs['rangeTyForm'].length; i++) {
                            this.$refs['rangeTyForm'][i].validate((isValid) => {
                                if (!isValid) {
                                    canSubmit = false
                                }
                            })
                        }
                        if (canSubmit) {
                            let fetchUrl = addAfterSale
                            if (this.param.afterSaleId) {
                                fetchUrl = updateAfterSale
                            }
                            fetchUrl(this.filterData(this.param)).then((res) => {
                                if (res.ret.errcode === 1) {
                                    this.reset()
                                    this.$emit('confirm')
                                }
                            })
                        }
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .btn-wrapper{
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .table{
        width: 100%;
        margin-top: 10px;
        th{
            width: 100px;
        }
    }
</style>
