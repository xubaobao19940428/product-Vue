<template>
    <el-dialog :title="title"
               width="900px"
               append-to-body
               :visible="propShowDialog"
               @close="close">
        <div>
            <el-form ref="addDialog" label-position="right" label-width="110px" label-suffix="："
                     :rules="rules"
                     :model="param">
                <el-form-item label="类目名" prop="cateNameValue">
                    <table class="table table-bordered table-info">
                        <tbody>
                        <tr v-for="(item, index) in param.cateNameValue" :key="index">
                            <th><span class="required" v-if="item.languageCode === 'cn' || item.languageCode === 'en'">*</span> {{getLangName(item.languageCode)}}{{item.languageCode}} </th>
                            <td>
                                <el-form-item ref="categoryForm" :rules="{ required: item.languageCode == 'cn' || item.languageCode == 'en' ? true : false, message: '请输入', trigger: 'change' }"  :prop="`cateNameValue[${index}].name`">
                                    <el-input v-model="item.name" clearable size="medium" placeholder="请输入"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </el-form-item>
                <el-form-item label="类目图" prop="cover">
                    <div>尺寸800*800像素以上，大小2M以下，支持jpg/jpeg/png格式</div>
                    <c-upload v-if="propShowDialog" :fileList="param.cover" @setData="setCoverImg"></c-upload>
                </el-form-item>
                <el-form-item label="Icon" v-if="level == 1" prop="selectIcon">
                    <div>尺寸800*800像素以上，大小2M以下，支持jpg/jpeg/png格式</div>
                    <div class="flex">
                        <div>
                            <c-upload v-if="propShowDialog" :fileList="param.iconInfo.unselected" @setData="(res) => { setIcon(res, 'unselected') }"></c-upload>
                            <div>未选中</div>
                        </div>
                        <div class="mar-l-10">
                            <c-upload v-if="propShowDialog" :fileList="param.iconInfo.selected" @setData="(res) => { setIcon(res, 'selected') }"></c-upload>
                            <div>已选中</div>
                        </div>
                    </div>
                </el-form-item>
                <template v-if="level > 1">
                    <el-form-item label="后台类目" prop="bindCateInfo">
                        <div>
                            <el-tag v-for="(tag, i) in param.bindCateInfo"
                                    :key="tag.cateId"
                                    @close="removeCategory(tag, i)"
                                    closable>{{tag.cateName}}
                            </el-tag>
                        </div>
                        <el-cascader style="width: 45%"
                                     filterable
                                     clearable
                                     remote
                                     @visible-change="clearSelectCategory"
                                     @change="addCategory"
                                     :props="{label: 'cateName',multiple: true, checkStrictly: false, children: 'levelValue', value: 'prop', lazy: true, lazyLoad: getSubCategory}"
                                     placeholder="请选择商品后台分组"
                                     :options="categoryOptions"
                                     v-model="selectedOptions"
                                     class="normalOperatorBox"
                                     size="medium">
                        </el-cascader>
                    </el-form-item>
                </template>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="close">取 消</el-button>
            <el-button size="small" type="primary" @click="confirm()">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import cUpload from '@/components/fileUpload/index'
    import { categoryAdd, categoryUpdate, categoryQueryByName } from '@/request/product'
    import productCommon from '../../common/common'
    export default {
        props: {
            propShowDialog: Boolean,
            level: {
                type: Number,
                default: 1
            },
            propParam: {
                type: Object,
                default: () => { return {} }
            },
            title: {
                type: String,
                default: '前台类目新增'
            },
            countryCode: {
                type: String,
                default: ''
            }
        },
        data () {
            const validCover=(rule,value,callback)=>{
                if(this.param.cover==''){
                    callback(new Error('类目图不能为空'))
                }else{
                    callback()
                }
            }
            const validBindCateInfo=(rule,value,callback)=>{
                if(value.length==0){
                    callback(new Error('请挑选后台类目'))
                }else{
                    callback()
                }
            }
            const validSelectIcon = (rule,value,callback)=>{
                if(this.param.iconInfo.selected==''){
                    callback(new Error('Icon已选中不能为空'))
                }else if(this.param.iconInfo.unselected==''){
                    callback(new Error('Icon未选中不能为空'))
                }else{
                    callback()
                }
            }
            return {
                rules: {
                    cateNameValue: [{ required: true, message: '不能为空', trigger: 'change' }],
                    cover: [{ required: true, validator:validCover, trigger: 'change' }],
                    bindCateInfo:[{required:true,validator:validBindCateInfo,trigger:'change'}],
                    selectIcon:[{required:true,validator:validSelectIcon,trigger:'change'}]
                },
                param: {
                    cateNameValue: [],
                    bindCateInfo: [],
                    bindId: '',
                    cover: '',
                    pid: 0,
                    cateType: 1,
                    iconInfo: {
                        selected: '',
                        unselected: ''
                    }
                },
                selectedOptions: [],
                categoryOptions: [],
                hasCoverImg:false,
            }
        },
        mixins: [productCommon],
        components: {
            cUpload
        },
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
                    if(this.$refs['addDialog']){
                        this.$refs['addDialog'].resetFields();
                    }
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
                if (!this.param.iconInfo) {
                    Object.assign(this.param, {
                        iconInfo: {
                            selected: '',
                            unselected: ''
                        }
                    })
                }
                for (let i = 0; i < this.languageList.length; i++) {
                    let lang = this.languageList[i].code
                    let item = this.param.cateNameValue.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!item) {
                        this.param.cateNameValue.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                }
            },
            getLangName (code) {
                let item = this.languageList.find((val) => {
                    return val.code == code
                })
                return item ? item.desc : ''
            },
            setCoverImg (res) {
                
                this.param.cover = res.data
                if (res.data != "") {
                    this.$refs["addDialog"].validateField("cover");
                } else {
                    this.$refs["addDialog"].validateField("cover");
                }
            },
            setIcon (res, key) {
                this.param.iconInfo[key] = res.data
                this.$refs["addDialog"].validateField("selectIcon");
                
            },
            // 模糊查询后台类目
            queryBackCategory (value) {
                if (value) {
                    categoryQueryByName({
                        categoryName: value
                    }).then((res) => {
                        if (res.ret.errcode === 1) {
                        }
                    })
                }
            },
            addCategory () {
                for (let i = 0; i < this.selectedOptions.length; i++) {
                    let data = JSON.parse(this.selectedOptions[i][2])
                    let item = this.param.bindCateInfo.find((val) => {
                        return val.cateId == data.cateId
                    })
                    if (!item) {
                        this.param.bindCateInfo.push(data)
                    }
                }
            },
            clearSelectCategory (show) {
                if (!show) {
                    this.selectedOptions = []
                }
            },
            removeCategory (tag, i) {
                this.param.bindCateInfo.splice(i, 1)
            },
            reset () {
                this.param = {
                    cateNameValue: [],
                    bindCateInfo: [],
                    bindId: '',
                    cover: '',
                    pid: 0,
                    cateType: 1,
                    iconInfo: {
                        selected: '',
                        unselected: ''
                    }
                }
            },
            close () {
                this.reset()
                this.$emit('close')
            },
            confirm () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        let canSubmit = true
                        for (let i = 0; i < this.$refs['categoryForm'].length; i++) {
                            this.$refs['categoryForm'][i].validate((isValid) => {
                                if (!isValid) {
                                    canSubmit = false
                                }
                            })
                        }
                        if (canSubmit) {
                            let fetchUrl = categoryAdd
                            if (this.param.cateId) {
                                fetchUrl = categoryUpdate
                            }
                            let bindId = []
                            for (let i = 0; i < this.param.bindCateInfo.length; i++) {
                                bindId.push(this.param.bindCateInfo[i].cateId)
                            }
                            if(this.level==2){
                                delete this.param.iconInfo
                            }
                            
                            this.param.bindId = bindId.join(',')
                            fetchUrl(this.filterData(Object.assign(this.param, {
                                level: this.level,
                                countryCode: this.countryCode
                            }))).then((res) => {
                                if (res.ret.errcode === 1) {
                                    this.reset()
                                    this.$emit('confirm', res.categoryUnit)
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
    .table {
        width: 100%;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        th {
            background: #f2f2f2;
            width: 120px;
            border: 1px solid #DCDFE6;
            padding: 10px;
            box-sizing: border-box;
        }
        tr td {
            border: 1px solid #DCDFE6;
        }
        td {
            padding: 10px 10px;
        }
        .limit {
            width: 120px;
            text-align: center;
        }
        .required {
            font-size: 16px;
            color: red;
            vertical-align: middle;
        }
    }
</style>
