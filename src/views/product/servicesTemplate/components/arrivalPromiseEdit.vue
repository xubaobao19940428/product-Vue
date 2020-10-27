<template>
    <div>
        <el-dialog :title="title"
                   width="900px"
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
                                <th><span class="required" v-if="item.languageCode === 'cn' || item.languageCode === 'en'">*</span> {{getLangName(item.languageCode)}}： </th>
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
                                <th><span class="required" v-if="item.languageCode === 'cn' || item.languageCode === 'en'">*</span> {{getLangName(item.languageCode)}}： </th>
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
                    <el-form-item label="适用国家" prop="countryCode">
                        <el-select v-model="param.countryCode" clearable @change="changeCountryCode" placeholder="请选择" size="medium">
                            <el-option v-for="(item, index) in countryList"
                                       :key="index"
                                       :label="item.nameEn + '/' + item.nameCn "
                                       :value="item.shortCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="配送时效" prop="arrivalDistribution">
                        <div class="form-tips mar-t-10 mar-b-10">未特别指定的地区，按照全国默认时效</div>
                        <el-table border
                                  current-row-key="level"
                                  row-key="level"
                                  ref="freeShipping"
                                  :data="param.arrivalDistribution">
                            <el-table-column label="地区" min-width="100" align="center">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.areaCode.length > 0 && scope.row.areaCode[0] == param.countryCode">全国</div>
                                    <div v-else class="form-item" @click="showAddressDialog(scope.row, scope.$index)">
                                        <span>{{ scope.row.areaCode.join(',') }}</span>
                                        <em class="add-btn mar-l-10">编 辑</em>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="时效" min-width="150" align="center">
                                <template slot-scope="scope">
                                    <div class="form-item">
                                        <el-input-number class="input-item" :controls="false" :precision="0" v-model="scope.row.timeLimitMin" :min="1" :max="50" type="text" placeholder="最小"></el-input-number> -
                                        <el-input-number class="input-item" :controls="false" :precision="0" v-model="scope.row.timeLimitMax" :min="1" :max="50" type="text" placeholder="最大"></el-input-number>
                                        <span class="mar-l-10">天</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="100" align="center">
                                <template slot-scope="scope">
                                    <div class="add-btn" v-if="!(scope.row.areaCode.length > 0 && scope.row.areaCode[0] == param.countryCode)"
                                         @click="deleteArea(scope.$index)">删 除</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="add-btn center" @click="addArea">新增指定地区及时效</div>
                    </el-form-item>
                    <el-form-item label="是否赔付" prop="payment">
                        <div class="form-tips mar-t-10">若标签及文案中注明慢必赔，请务必勾选“系统自动赔付”</div>
                        <el-radio-group v-model="param.payment">
                            <el-radio v-for="(item, key) in paymentEnum" :key="parseInt(key)" :label="parseInt(key)">{{ item }}</el-radio>
                        </el-radio-group>
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
        <select-address v-if="address.show" :propShowDialog="address.show" :propStateList="address.list" :countryCode="param.countryCode" @close="address.show = false" @confirm="confirmSelectAddress"></select-address>
    </div>
</template>
<script>
    import { getOneKeyTranslation } from '@/request/i18n'
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    import { addArrival, updateArrival } from '@/request/pledge'
    import productCommon from '../../common/common'
    import selectAddress from '@/components/addressSelect/backAddress'
    export default {
        props: {
            propShowDialog: Boolean,
            propParam: {
                type: Object,
                default: () => { return {} }
            },
            title: {
                type: String,
                default: '到货承诺'
            },
            showType: Object
        },
        data () {
            return {
                rules: {
                    label: [{ required: true, message: '不能为空', trigger: 'change' }],
                    document: [{ required: true, message: '不能为空', trigger: 'change' }],
                    payment: [{ required: true, message: '不能为空', trigger: 'change' }],
                    showType: [{ required: true, message: '不能为空', trigger: 'change' }],
                    countryCode: [{ required: true, message: '不能为空', trigger: 'change' }],
                    arrivalDistribution: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'change',
                        validator: (rule, value, callback) => {
                            if (value.length < 0) {
                                callback(new Error('不能为空'))
                            } else {
                                callback()
                            }
                        }
                    }]
                },
                param: {
                    label: [],
                    document: [],
                    detailPicture: [],
                    payment: 1,
                    showType: 3,
                    arrivalId: null,
                    countryCode: '',
                    arrivalDistribution: []
                },
                labelTransLoading: false,
                documentTransLoading: false,
                paymentEnum: {
                    1: '系统自动赔付',
                    2: '不赔付'
                },
                address: {
                    show: false,
                    index: -1,
                    list: []
                }
            }
        },
        components: {
            multiLangFileUpload,
            selectAddress
        },
        mixins: [productCommon],
        computed: {
            languageList () {
                return this.$store.state.dict.languageList
            },
            countryList () {
                return this.$store.state.dict.countryList
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
            changeCountryCode () {
                if (this.param.countryCode) {
                    this.param.arrivalDistribution = [{
                        areaCode: [this.param.countryCode],
                        timeLimitMin: '8',
                        timeLimitMax: '15'
                    }]
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
                        for (let i = 0; i < res.oneKeyTranslationUnit.length; i++) {
                            let itemI = this.param[type].findIndex((val) => {
                                return val.languageCode == res.oneKeyTranslationUnit[i].toLanguageCode
                            })
                            if (itemI != -1 && !this.param[type][itemI].name) {
                                this.param[type][itemI].name = res.oneKeyTranslationUnit[i].translation
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
            deleteArea (i) {
                this.param.arrivalDistribution.splice(i, 1)
            },
            addArea () {
                this.param.arrivalDistribution.push({
                    areaCode: [],
                    timeLimitMin: '',
                    timeLimitMax: ''
                })
            },
            showAddressDialog (data, index) {
                if (!this.param.countryCode) {
                    return this.$message.warning('请先选择国家')
                }
                this.address.index = index
                this.address.list = data.areaCode
                this.address.show = true
            },
            confirmSelectAddress (address) {
                for (let i = 0; i < this.param.arrivalDistribution.length; i++) {
                    if (this.address.index != i) {
                        let areaCode = this.param.arrivalDistribution[i].areaCode
                        for (let j = 0; j < areaCode.length; j++) {
                            let item = address.find((val) => {
                                return val === areaCode[j]
                            })
                            if (item) {
                                return this.$message.warning(item + '已经设置过，请更换')
                            }
                        }
                    }
                }
                if (address.length > 0) {
                    this.param.arrivalDistribution[this.address.index].areaCode = address
                }
                this.address.show = false
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
                    payment: 1,
                    showType: 3,
                    arrivalId: null,
                    countryCode: '',
                    arrivalDistribution: []
                }
                this.$refs['addDialog'].clearValidate()
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
                        if (canSubmit) {
                            let fetchUrl = addArrival
                            if (this.param.arrivalId) {
                                fetchUrl = updateArrival
                            }
                            let param = JSON.parse(JSON.stringify(this.param))
                            for (let i = 0; i < param.arrivalDistribution.length; i++) {
                                let val = param.arrivalDistribution[i]
                                if (!val.areaCode || val.areaCode.length <= 0 || !val.timeLimitMin || !val.timeLimitMax) {
                                    return this.$message.warning('请填写配送时效')
                                }
                            }
                            fetchUrl(this.filterData(param)).then((res) => {
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
    .center{
        text-align: center;
    }
    .table{
        width: 100%;
        margin-top: 10px;
        th{
            width: 100px;
        }
    }
    .add-btn{
        color: #409eff;
        cursor: pointer;
    }
    .form-item{
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 10px;
        span{
            flex: 1;
            overflow:hidden;
            text-overflow:ellipsis;
            display:-webkit-box;
            -webkit-line-clamp:4;
            -webkit-box-orient:vertical;
        }
    }
    .input-item{
        width: 100px;
        margin: 0 10px;
    }
</style>
