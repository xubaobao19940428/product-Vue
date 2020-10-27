<template>
    <el-card class="basic-info-card">
        <div slot="header" class="clearfix">
            <span>修改Fingo导师微信信息</span>
        </div>
        <el-form label-width="120px" ref="mentorInfoForm" :model="mentorInfoModel" :rules="ruleValidate">
            <el-form-item label="等级：" prop="code">
                <el-select v-model="mentorInfoModel.code" size="medium">
                    <el-option v-for="(val, key) in codeList" :key="key" :label="val" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="国家：">
                <el-select v-model="mentorInfoModel.countryCode" clearable placeholder="请选择" size="medium">
                    <el-option v-for="(item, index) in countryList"
                               :key="index"
                               :label="item.nameEn + '/' + item.nameCn "
                               :value="item.shortCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="昵称：" prop="memberType">
                <el-input style="width: 194px" v-model="mentorInfoModel.nickName" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="微信号：" prop="wechatId">
                <el-input style="width: 194px" v-model="mentorInfoModel.wechatId" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="whatsApp：" prop="whatsApp">
                <el-input style="width: 194px" v-model="mentorInfoModel.whatsApp" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="whatsApp群链接：" prop="whatsAppLink">
                <el-input style="width: 194px" v-model="mentorInfoModel.whatsAppLink" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="line：" prop="lineId">
                <el-input style="width: 194px" v-model="mentorInfoModel.lineId" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="line群链接：" prop="lineLink">
                <el-input style="width: 194px" v-model="mentorInfoModel.lineLink" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="头像：">
                <c-upload :fileList="mentorInfoModel.headImg" @setData="setCoverImg"
                          :limit="1"></c-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="submit" :loading="loading">确定</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import cUpload from '@/components/fileUpload/'
export default {
    name: 'setUserLevel',
    data() {
        return {
            loading: false,
            mentorInfoModel: {
                code: 'V3_FINGO_MASTER0',
                nickName: '',
                headImg: '',
                wechatId: '',
                whatsApp: '',
                countryCode: '',
                whatsAppLink: '',
                lineLink: '',
                lineId: ''
            },
            ruleValidate: {},
            codeList: {
                'V3_FINGO_MASTER0': 'PS的fingo导师0',
                'V3_FINGO_MASTER1': 'PS的fingo导师1',
                'V3_FINGO_MASTER2': 'PS的fingo导师2',
                'V4_V5_FINGO_MASTER': 'AM和AT的Fingo导师',
                'MERCHANTS_WILL_PICK_UP_PEOPLE': '招商会对接人'
            },
        }
    },
    computed: {
        countryList () {
            return this.$store.state.dict.countryList
        }
    },
    components: {
        cUpload
    },
    methods: {
        setCoverImg (res) {
            this.mentorInfoModel.headImg = res.data
        },
        submit() {
            this.$refs.mentorInfoForm.validate((valid) => {
                if (valid) {
                    this.loading = true
                    this.$emit('on-submit', this.mentorInfoModel)
                }
            })
        },
        setLoading () {
            this.loading = false
        }
    }
}
</script>

<style lang="scss" scoped>

</style>


