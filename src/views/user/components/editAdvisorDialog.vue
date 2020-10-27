<template>
    <el-dialog
        class="edit-advisor-dialog"
        :visible="advisorShow"
        @close="handleClose"
        width="650px"
        :title="type == 'edit' ? '编辑导师信息' : '新增导师信息'"
    >
        <el-form label-position="right" label-width="130px" :model="param"
            ref="editAdvisorForm"
            :rules="rules"
        >
            <el-form-item label="等级：" prop="code">
                <el-select v-model="param.code"
                    :disabled="type == 'edit'"
                >
                    <el-option 
                        v-for="item in fingoMasterList" 
                        :key="item.key" 
                        :value="item.key" 
                        :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="国家：" prop="countryCode">
                <el-select v-model="param.countryCode"
                        :disabled="type == 'edit'"
                         filterable
                         >
                    <el-option v-for="item in countryList"
                            :key="item.shortCode"
                            :label="item.nameCn"
                            :value="item.shortCode">
                    </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="昵称：" prop="nickName">
                <el-input v-model="param.nickName"></el-input>
            </el-form-item>
            <el-form-item label="微信号：">
                <el-input v-model="param.wechatId"></el-input>
            </el-form-item>
            <el-form-item label="WhatsApp：">
                <el-input v-model="param.whatsApp"></el-input>
            </el-form-item>
            <el-form-item label="WhatsApp群链接：">
                <el-input v-model="param.whatsAppLink"></el-input>
            </el-form-item>
            <el-form-item label="line：">
                <el-input v-model="param.lineId"></el-input>
            </el-form-item>
            <el-form-item label="line群链接：">
                <el-input v-model="param.lineLink"></el-input>
            </el-form-item>
            <el-form-item label="头像：">
                <c-upload :limit="1"
                        accept="image/jpeg,image/jpg,image/png,image/gif"
                        :fileList="param.headImg"
                        @setData="setHeadImg"></c-upload>
            </el-form-item>
        </el-form>

        <div slot="footer" class="footer-box">
            <el-button size="medium" @click="handleClose">取消</el-button>
            <el-button type="primary" size="medium" @click="handleConfirm">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import cUpload from '@/components/fileUpload/'

export default {
    props: {
        advisorShow: Boolean,
        type: String,
        propParam: {
            type: Object,
            default: {}
        },
        countryCode: String,
        countryList: Array,
        fingoMasterList: Array
    },
    data () {
        return {
            param: {
                code: '',
                countryCode: '',
                nickName: '',
                headImg: '',
                whatsApp: '',
                whatsAppLink: '',
                lineId: '',
                lineLink: '',
                wechatId: '' // 微信号
            },
            rules: {
                nickName: [{ required: true, message: '必填', trigger: 'change' }],
                code: [{ required: true, message: '必选', trigger: 'change' }],
                countryCode: [{ required: true, message: '必选', trigger: 'change' }]
            }
        }
    },
    created () {
        let temp = { ...this.propParam }
        if (this.type == 'edit' || this.type == 'copy') { // 编辑的话，会带有id
            Object.assign(this.param, temp)
        } else {
            this.param.countryCode = this.countryCode
        }
    },
    components: {
        cUpload
    },
    methods: {
        reset () {
            this.param = {
                code: '',
                countryCode: '',
                nickName: '',
                headImg: '',
                whatsApp: '',
                whatsAppLink: '',
                lineId: '',
                lineLink: '',
                wechatId: '' // 微信号
            }
            this.$refs['editAdvisorForm'].clearValidate()
        },
        handleClose () {
            this.reset()
            this.$emit('close')
        },
        handleConfirm () {
            this.$refs['editAdvisorForm'].validate(valid => {
                if (valid) {
                    this.$emit('confirm', this.filterData(this.param))
                }
            })
        },
        setHeadImg (res) {
            this.param.headImg = res.data
        }
    }
}
</script>