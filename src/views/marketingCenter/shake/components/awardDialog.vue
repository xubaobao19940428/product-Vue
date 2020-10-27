<template>
    <el-dialog
        title="奖品管理"
        width="650px"
        :visible="dialogVisible"
        :close-on-click-modal="false"
        @close="handleClose"
        class="award-manage-dialog">
        <el-form label-width="100px"
            label-position="right"
            :model="param"
            ref="awardManageForm"
            :rules="rules"
        >
            <el-form-item label="选择类型：" prop="type">
                <el-select v-model="param.type" style="width: 90%" :disabled="awardType === 'edit'">
                    <el-option v-for="(val, key) in luckPrizeTypeMap" :key="key" :value="parseInt(key)" :label="val"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="奖品名称：" prop="name">
                <ul class="lang-list">
                    <li v-for="(val, key) in param.name"
                        class="flex mar-b-10"
                        :key="key"
                    >
                        <span class="text label-title">{{ getLangName(key) }}：</span><el-input class="flex1" v-model="param.name[key]"></el-input>
                    </li>
                </ul>
            </el-form-item>
            <el-form-item v-if="param.type == 1" label="优惠券ID：" prop="content">
                <el-input v-model="param.content"></el-input>
            </el-form-item>
            <el-form-item v-else-if="param.type == 2" label="积分金额：" prop="content">
                <el-input v-model="param.content"></el-input>
            </el-form-item>
            <el-form-item v-else-if="param.type == 3" label="商品ID：" prop="content">
                <el-input v-model="param.content"></el-input>
            </el-form-item>
            <el-form-item label="图片：">
                <multi-lang-file-upload :propFileList="imgList"  @setData="setImg"></multi-lang-file-upload>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose" size="small">取 消</el-button>
            <el-button type="primary" size="small" :loading="pending" @click="handleConfirm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    import { addPrize, editPrize } from '@/api/shake'
    export default {
        props: {
            dialogVisible: Boolean,
            awardData: Object,
            luckPrizeTypeMap: [Array, Object],
            awardType: String,
            countryCode: String,
            boxId: [String, Number]
        },
        components: {
            multiLangFileUpload
        },
        data () {
            return {
                param: {
                    type: 1,
                    content: '',
                    name: {},
                    icon: ''
                },
                imgList: [],
                pending: false,
                rules: {
                    type: [{ required: true, message: '必填', trigger: 'change' }],
                    content: [{
                        validator: (rule, value, callback) => {
                            let re = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
                            console.log(!re.test(value))
                            if (value.length < 0) {
                                callback(new Error('不能为空'))
                            } else if (!re.test(value)) {
                                callback(new Error('请输入合法数字'))
                            } else {
                                callback()
                            }
                        }
                    }],
                    name: [{ required: true, message: '必填', trigger: 'change' }]
                }
            }
        },
        computed: {
            languageList () {
                return this.$store.state.dict.languageList
            }
        },
        mounted () {
            if (this.awardData && Object.keys(this.awardData).length > 0) {
                Object.assign(this.param, this.awardData)
                this.param.name = JSON.parse(this.param.name)
                let data = JSON.parse(this.param.icon)
                for (let key in data) {
                    this.imgList.push({
                        languageCode: key,
                        name: data[key]
                    })
                }
            }
            this.init()
        },
        methods: {
            init () {
                for (let i = 0; i < this.languageList.length; i++) {
                    let lang = this.languageList[i].code
                    let nameItem = this.param.name[lang]
                    if (!nameItem) {
                        this.$set(this.param.name, lang, '')
                    }
                }
            },
            getLangName (code) {
                let item = this.languageList.find((val) => {
                    return val.code == code
                })
                return item ? item.desc : ''
            },
            setImg (data) {
                this.imgList = data
            },
            handleClose () {
                this.$emit('close')
            },
            handleConfirm () {
                if (!this.param.name['cn'] || !this.param.name['en']) {
                    return this.$message.warning('中英文奖品名称不能为空')
                }
                let imgList = this.imgList.filter((val) => {
                    return (val.languageCode == 'cn' && val.name) || (val.languageCode == 'en' && val.name)
                })
                if (imgList.length < 2) {
                    return this.$message.warning('中英文图片不能为空')
                }
                let obj = {}
                for (let i = 0; i < this.imgList.length; i++) {
                    if (this.imgList[i].name) {
                        obj[this.imgList[i].languageCode] = this.imgList[i].name
                    }
                }
                let param = JSON.parse(JSON.stringify(this.param))
                param.name = this.filterData(param.name)
                param.icon = JSON.stringify(this.filterData(obj))
                param.countryCode = this.countryCode
                param.boxId = this.boxId
                this.$refs.awardManageForm.validate((valid) => {
                    if (valid) {
                        let fetchUrl = addPrize
                        if (this.awardType == 'edit') {
                            fetchUrl = editPrize
                        }
                        this.pending = true
                        fetchUrl(this.filterData(param)).then((res) => {
                            this.pending = false
                            if (res.ret.errCode === 0) {
                                this.$emit('save')
                            }
                        }).catch(() => {
                            this.pending = false
                        })
                    }
                })
            }
        }

    }
</script>

<style scoped lang="scss">
.award-manage-dialog {
    .tip {
        color: #999999;
        line-height: 24px;
    }
    .mtb10 {
        margin: 10px 0;
    }
    .label-title{
        width: 100px;
        text-align: right;
    }
    .name-input {
        width: 66%;
        display: inline-block;
    }
    .small-width {
        width: 60%;
        display: inline-block;
    }
    .special-item {
        margin-bottom: 10px;
    }
    .radio-line {
        display: block;
        line-height: 40px;
    }
    .config-common-input {
        width: 100%;
    }
}
</style>
