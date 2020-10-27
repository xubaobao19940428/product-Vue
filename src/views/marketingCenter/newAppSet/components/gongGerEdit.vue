<template>
    <el-dialog
        title="编辑宫格区"
        :visible="dialogVisible"
        width="800px"
        @close="handleClose">
        <div style="height: 100%; width: 100%">
            <el-form :rules="adDialogRules"
                     ref="addDialog"
                     :model="param"
                     label-position="right"
                     label-width="120px"
                     class="demo-ruleForm">
                <el-form-item label="国家：" prop="countryCode">
                    <el-select v-model="param.countryCode" :disabled="param.id ? true : false" filterable clearable>
                        <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型：" prop="marketingGridType">
                    <el-select v-model="param.marketingGridType" filterable clearable>
                        <el-option v-for="(val, key) in marketingGridType" :key="key" :label="val" :value="parseInt(key)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="跳转类型：" prop="urlType">
                    <el-radio-group v-model="param.urlType" @change="param.url = ''">
                        <el-radio v-for="(val, key) in urlType" :key="key" :label="parseInt(key)">{{ val }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="跳转链接：" prop="url">
                    <el-select v-if="param.urlType == 2" v-model="param.url" filterable>
                        <el-option v-for="(val, key) in appPageEnum" :key="key" :label="val" :value="key"></el-option>
                    </el-select>
                    <el-input v-else v-model="param.url" size="medium" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="展示商品ID：" prop="spuId">
                    <el-input v-model="param.spuId" size="medium" placeholder="请填写商品id，多个使用,号隔开"></el-input>
                </el-form-item>
                <el-form-item v-if="param.url === 'PRODUCT_DETAILS'" label="兼容性链接：" prop="compatibilityUrl">
                    <el-input v-model="param.compatibilityUrl" size="medium" placeholder="请填写" clearable style="width: 550px; margin-right:10px;"></el-input>
                    <el-button type="text" @click="aotoCreate">自动生成</el-button>
                </el-form-item>
                <el-form-item label="背景图：" prop="cover">
                    <multi-lang-file-upload v-if="dialogVisible" :propFileList="param.cover" @setData="setCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
                <el-form-item label="标题：" prop="title">
                    <div class="flex form-content">
                        <el-select v-model="titleLang" placeholder="请选择">
                            <el-option v-for="(item, i) in langList"
                                       :key="i"
                                       :label="item.desc"
                                       :value="item.code">
                            </el-option>
                        </el-select>
                        <el-form-item v-for="(item, i) in param.title" :key="i"
                                      :rules="{ required: item.languageCode == 'cn' || item.languageCode == 'en' ? true : false, message: '中英文必填', trigger: 'blur' }"
                                      ref="hotWordForm"
                                      :prop="`title[${i}].name`"
                                      v-show="titleLang == item.languageCode" class="flex1 mar-l-10">
                            <el-input v-model="item.name" show-word-limit maxlength="100" type="text" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item label="副标题：" prop="subTitle">
                    <div class="flex form-content">
                        <el-select v-model="subTitleLang" placeholder="请选择">
                            <el-option v-for="(item, i) in langList"
                                       :key="i"
                                       :label="item.desc"
                                       :value="item.code">
                            </el-option>
                        </el-select>
                        <el-form-item v-for="(item, i) in param.subTitle" :key="i"
                                      :rules="{ required: item.languageCode == 'cn' || item.languageCode == 'en' ? true : false, message: '中英文必填', trigger: 'blur' }"
                                      ref="hotWordForm"
                                      :prop="`subTitle[${i}].name`"
                                      v-show="subTitleLang == item.languageCode" class="flex1 mar-l-10">
                            <el-input v-model="item.name" show-word-limit maxlength="100" type="text" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item label="开始时间：" prop="startTime">
                    <el-date-picker size="medium" v-model="param.startTime" type="datetime" value-format="timestamp"
                                    placeholder="请输入开始时间" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间：" prop="endTime">
                    <el-date-picker size="medium" v-model="param.endTime" type="datetime"
                                    :picker-options="pickerOptions" placeholder="请输入结束时间" value-format="timestamp">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleClose">取 消</el-button>
                <el-button size="small" :loading="loading" type="primary" @click="conformAddItem()">确 定</el-button>
            </span>
    </el-dialog>
</template>
<script>
    import { InsertMarketingGrid, UpdateMarketingGrid } from '@/request/promotion.js'
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    import common from '../../common/common'
    import {
        splitData
    } from '@/utils/index'
    export default {
        props: {
            dialogVisible: Boolean,
            countryList: Array,
            propParam: Object,
            langList: Array,
            marketingGridType: Object
        },
        components: {
            multiLangFileUpload
        },
        mixins: [common],
        data () {
            return {
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                },
                titleLang: 'cn',
                subTitleLang: 'cn',
                param: {
                    id: null,
                    countryCode: '',
                    marketingGridType: '',
                    urlType: 1,
                    url: '',
                    title: [],
                    subTitle: [],
                    spuId: '',
                    startTime: '',
                    cover: [],
                    endTime: '',
                    compatibilityUrl: ''
                },
                loading: false,
                adDialogRules: {
                    marketingGridType: [{ required: true, message: '不能为空', trigger: 'change' }],
                    subTitle: [{ required: true, message: '不能为空', trigger: 'change' }],
                    title: [{ required: true, message: '不能为空', trigger: 'change' }],
                    url: [{ required: true, message: '不能为空', trigger: 'change' }],
                    urlType: [{ required: true, message: '不能为空', trigger: 'change' }],
                    compatibilityUrl: [{ required: true, message: '不能为空', trigger: 'change' }]
                }
            }
        },
        watch: {
            propParam: {
                handler (val) {
                    if (val) {
                        Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)))
                        this.initLangData()
                    }
                },
                deep: true
            },
            dialogVisible (val) {
                if (val) {
                    Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)))
                    this.initLangData()
                }
            }
        },
        methods: {
            initLangData () {
                for (let i = 0; i < this.langList.length; i++) {
                    let lang = this.langList[i].code
                    let title = this.param.title.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!title) {
                        this.param.title.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                    let subTitle = this.param.subTitle.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!subTitle) {
                        this.param.subTitle.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                }
            },
            reset () {
                this.param = {
                    id: null,
                    countryCode: '',
                    marketingGridType: '',
                    urlType: 1,
                    url: '',
                    title: [],
                    subTitle: [],
                    spuId: '',
                    startTime: '',
                    cover: [],
                    endTime: '',
                    compatibilityUrl: ''
                }
                this.$refs['addDialog'] && this.$refs['addDialog'].clearValidate()
            },
            handleClose () {
                this.reset()
                this.$emit('close')
            },
            setCover (data) {
                this.param.cover = data
            },
            conformAddItem () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        let temp = JSON.parse(JSON.stringify(this.param))
                        temp.spuId = splitData(temp.spuId)
                        if (temp.marketingGridType == 4) {
                            // 爆款好物
                            if (temp.urlType == 2) {
                                // 应用内
                                if (temp.spuId.length < 1) {
                                    this.$message.error('爆款好物的跳应用内，商品ID至少为1个')
                                    return
                                }
                            } else if (temp.urlType == 1) {
                                // H5的
                                if (temp.spuId.length < 3) {
                                    this.$message.error('爆款好物的跳H5，商品ID至少为3个')
                                    return
                                }
                                if (!temp.cover.length) {
                                    this.$message.error('跳转类型为H5时，背景图必填')
                                    return
                                }
                            }
                        }
                        this.loading = true

                        let fetchUrl = InsertMarketingGrid
                        if (this.param.id) {
                            fetchUrl = UpdateMarketingGrid
                        }
                        fetchUrl({ marketingGrid: this.filterData(temp) }).then((res) => {
                            this.loading = false
                            if (res.ret.errcode === 1) {
                                this.$message.success('成功')
                                this.reset()
                                this.$emit('confirm')
                            }
                        }).catch(() => {
                            this.loading = false
                        })
                    }
                })
            },
            aotoCreate() {
                if(this.param.spuId) {
                    this.param.compatibilityUrl = process.env.VUE_APP_BASIC_URL + 'goodsDetailNew?goodsId=' + this.param.spuId.split(',')[0]
                } else {
                    this.$message.warning('请填写商品ID')
                }
            }
        }
    }
</script>
