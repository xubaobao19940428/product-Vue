<template>
    <el-dialog
        :title="dialogTitle"
        :visible="dialogVisible"
        width="800px"
        @close="handleClose">
        <div style="height: 100%; width: 100%">
            <el-form :rules="adDialogRules"
                     ref="addDialog"
                     :model="param"
                     label-suffix="："
                     label-position="right"
                     label-width="160px"
                     class="demo-ruleForm">
                <el-form-item label="选择国家" prop="moduleId">
                    <el-select v-model="param.moduleId" :disabled="curType == 'edit'" filterable clearable>
                        <el-option v-for="item in moduleList" :key="item.id" :label="item.countryName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称：" prop="name">
                    <div class="flex form-content">
                        <el-select v-model="nameLang" placeholder="请选择">
                            <el-option v-for="(item, i) in langList" :key="i" :label="item.desc" :value="item.code"></el-option>
                        </el-select>
                        <el-input v-model="param.name[nameLang]" show-word-limit maxlength="50" type="text" placeholder="请输入"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="跳转类型：" prop="openType">
                    <el-radio-group v-model="param.openType" @change="param.url = ''">
                        <el-radio v-for="(val, key) in openType" :key="key" :label="parseInt(key)">{{ val }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="跳转地址：" prop="url">
                    <el-select v-if="param.openType == 2" v-model="param.url" filterable>
                        <el-option v-for="(val, key) in appPageEnum" :key="key" :label="val" :value="key"></el-option>
                    </el-select>
                    <el-input v-else v-model="param.url" size="medium" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="图标："
                              prop="icon" class="is-required">
                    <div class="form-tips mar-t-10">建议尺寸：335*170像素以上，大小2M以下；支持jpg、jpeg、png；只能上传一张图片。</div>
                    <multi-lang-file-upload v-if="dialogVisible" :propFileList="param.icon" @setData="setIcon" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
                <el-form-item label="状态：" required>
                    <el-radio-group v-model="param.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">停用</el-radio>
                    </el-radio-group>
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
import multiLangFileUpload from '@/components/multiLangFileUpload/'
import { updateData, addData } from '@/api/appSet.js'
export default {
    props: {
        openType: Array,
        propParam: Object,
        curType: String,
        moduleList: Array,
        dialogVisible: Boolean,
        dialogTitle: String,
        appPageEnum: Array
    },
    data () {
        return {
            param: {
                id: '',
                moduleId: '',
                openType: 1, // 1 H5内 2 原生
                url: '',
                name: {},
                icon: [],
                status: 1 // 1 启用 2 停用
            },
            adDialogRules: {
                name: [{ required: true, message: '不能为空', trigger: 'change' }],
                icon: [{ required: true, message: '不能为空', trigger: 'change' }],
                moduleId: [{ required: true, message: '不能为空', trigger: 'change' }],
                type: [{ required: true, message: '不能为空', trigger: 'change' }],
                url: [{ required: true, message: '不能为空', trigger: 'change' }]
            },
            nameLang: 'cn',
            loading: false
        }
    },
    components: {
        multiLangFileUpload
    },
    created () {
        if (this.curType == 'add') {
            // 新增
            let name = {}
            for (let i = 0, len = this.langList.length; i < len; i++) {
                let lang = this.langList[i].code
                name[lang] = ''
            }
            Object.assign(this.param, {name: name})
        } else {
            let temp = JSON.parse(JSON.stringify(this.propParam))
            let resName = JSON.parse(temp.name)
            // 修改或复制
            let name = {}
            for (let i = 0, len = this.langList.length; i < len; i++) {
                let lang = this.langList[i].code
                name[lang] = resName[lang]
                if (!resName[lang]) {
                    name[lang] = ''
                }
            }
            temp.name = name
            Object.assign(this.param, temp)
        }
    },
    computed: {
        langList () {
            return this.$store.state.dict.languageList
        }
    },
    methods: {
        initLangData () {
            for (let i = 0; i < this.langList.length; i++) {
                let lang = this.langList[i].code
                let item = this.param.title.find((val) => {
                    return val.languageCode == lang
                })
                if (!item) {
                    this.param.title.push({
                        languageCode: lang,
                        name: ''
                    })
                }
            }
        },
        reset () {
            this.param = {
                id: '',
                moduleId: 1,
                openType: 1,
                url: '',
                startTime: '',
                endTime: '',
                name: {},
                icon: []
            }
            this.loading = false
            this.$refs['addDialog'] && this.$refs['addDialog'].clearValidate()
        },
        handleClose () {
            this.reset()
            this.$emit('close')
        },
        setIcon (data) {
            this.param.icon = data
        },
        conformAddItem () {
            this.$refs['addDialog'].validate((valid) => {
                if (valid) {
                    let temp = JSON.parse(JSON.stringify(this.param))
                    let icon = {}
                    if (!temp.name['cn'] || !temp.name['en']) {
                        this.$message.error('中英文名称必填')
                        return
                    }
                    this.loading = true
                    temp.icon.forEach(item => {
                        icon[item.languageCode] = item.name
                    })

                    temp.icon = icon

                    let fetchUrl = addData
                    if (this.curType == 'edit') {
                        fetchUrl = updateData
                    }

                    fetchUrl(this.filterData(temp)).then((res) => {
                        this.loading = false
                        if (res.ret.errCode === 0) {
                            this.$message.success('成功')
                            this.reset()
                            this.$emit('confirm')
                        }
                    }).catch(() => {
                        this.loading = false
                    })
                }
            })
        }
    }
}
</script>