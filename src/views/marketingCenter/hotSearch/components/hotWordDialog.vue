<template>
    <!--添加修改热搜词-->
    <el-dialog
        :title="title"
        :visible="propShowDialog"
        @close="close"
        width="600px">
        <div>
            <el-form :rules="rules"
                     label-width="120px"
                     ref="editDialog"
                     :model="param">
                <el-form-item label="适用国家："
                              prop="countryCode">
                    <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox-group v-model="param.countryCode" @change="selectCountry">
                        <el-checkbox v-for="item in countryList" :key="item.shortCode" :label="item.shortCode">{{ item.nameLocal }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="跳转类型：">
                    <el-radio-group v-model="param.urlType">
                        <el-radio v-for="(val, key) in urlTypeEnum" :key="key" :label="parseInt(key)">{{ val}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="跳转链接：" v-if="param.urlType == 1">
                    <el-input v-model="param.url" size="medium" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接：" v-if="param.urlType == 2">
                    <el-select v-model="param.url" placeholder="请选择">
                        <el-option v-for="(item, i) in appPageEnum" :key="i" :label="item" :value="i"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="热搜词图标：">
                    <multi-lang-file-upload v-if="propShowDialog" :propFileList="param.icon" @setData="setCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
                <el-form-item label="热搜词：" prop="hotWord">
                    <div class="flex form-content">
                        <el-select v-model="hotWordsLang" placeholder="请选择">
                            <el-option v-for="(item, i) in langList" :key="i" :label="item.desc" :value="item.code"></el-option>
                        </el-select>
                        <el-form-item v-for="(item, i) in param.hotWord" :key="i"
                                      :rules="{ required: item.languageCode == 'cn' || item.languageCode == 'en' ? true : false, message: '中英文必填', trigger: 'blur' }"
                                      ref="hotWordForm"
                                      :prop="`hotWord[${i}].name`"
                                      v-show="hotWordsLang == item.languageCode" class="flex1 mar-l-10">
                            <el-input v-model="item.name" show-word-limit maxlength="100" type="text" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item label="开始时间："
                              prop="startTime">
                    <el-date-picker size="medium"
                                    v-model="param.startTime"
                                    type="datetime"
                                    value-format="timestamp"
                                    placeholder="请输入开始时间"
                                    :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间："
                              prop="endTime">
                    <el-date-picker size="medium"
                                    v-model="param.endTime"
                                    type="datetime"
                                    :picker-options="pickerOptions"
                                    placeholder="请输入结束时间"
                                    value-format="timestamp">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="close">取 消</el-button>
            <el-button size="small" type="primary" @click="updateKeywords()">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { addHotWord, updateHotWord } from '@/request/promotion.js'
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    import common from '../../common/common'
    export default {
        props: {
            propShowDialog: Boolean,
            title: String,
            propParam: Object,
            countryList: Array,
            langList: Array,
            urlTypeEnum: [Array, Object]
        },
        data () {
            return {
                param: {
                    countryCode: [],
                    url: '',
                    urlType: '3',
                    icon: [],
                    hotWordId: null,
                    hotWord: [],
                    startTime: '',
                    endTime: ''
                },
                rules: {
                    countryCode: { required: true, trigger: 'change', message: '请选择' },
                    hotWord: { required: true, trigger: 'change', message: '请输入' }
                },
                hotWordsLang: 'cn',
                checkAll: false,
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                }
            }
        },
        mixins: [common],
        components: {
            multiLangFileUpload
        },
        watch: {
            propShowDialog (val) {
                if (val) {
                    Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)))
                    if (this.param.countryCode.length == this.countryList.length) {
                        this.checkAll = true
                    } else {
                        this.checkAll = false
                    }
                }
            },
            propParam (val) {
                if (val) {
                    Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)))
                    if (this.param.countryCode.length == this.countryList.length) {
                        this.checkAll = true
                    } else {
                        this.checkAll = false
                    }
                }
            }
        },
        methods: {
            close () {
                this.$emit('close')
                this.reset()
            },
            // 全选
            handleCheckAllChange () {
                this.param.countryCode = []
                for (let i = 0; i < this.countryList.length; i++) {
                    if (this.checkAll) {
                        this.param.countryCode.push(this.countryList[i].shortCode)
                    }
                }
            },
            reset () {
                this.param = {
                    countryCode: [],
                    url: '',
                    urlType: '3',
                    icon: [],
                    hotWordId: null,
                    hotWord: [],
                    startTime: null,
                    endTime: null
                }
            },
            setCover (data) {
                this.param.icon = data
            },
            selectCountry () {
                let countryLen = this.param.countryCode.length
                this.checkAll = (countryLen == this.countryList.length && countryLen > 0) ? true : false
            },
            // 新增编辑
            updateKeywords () {
                let fetchUrl = addHotWord
                if (this.param.hotWordId) {
                    fetchUrl = updateHotWord
                }
                let param = JSON.parse(JSON.stringify(this.param))
                for (let i = 0; i < param.hotWord.length; i++) {
                    if (param.hotWord[i].languageCode == 'cn' || param.hotWord[i].languageCode == 'en') {
                        if (param.hotWord[i].name == '') {
                            return this.$message.warning('中英文热搜词不能为空')
                        }
                    }
                }
                param.hotWord = param.hotWord.filter((val) => {
                    return val.name
                })
                if (this.param.countryCode.length == 0) {
                    return this.$message.warning('适用国家不能为空')
                }
                fetchUrl(this.filterData(param)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.reset()
                        this.$message.success('成功')
                        this.$emit('confirm')
                    }
                })
            }
        }
    }
</script>
