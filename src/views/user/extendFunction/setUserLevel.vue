<template>
    <el-card class="basic-info-card">
        <div slot="header" class="clearfix">
            <span>预设等级</span>
        </div>
        <el-form label-width="120px" ref="setLevelForm" :model="setLevelModel" :rules="ruleValidate">
            <el-form-item label="用户ID：" prop="userId">
                <el-input style="width: 210px;" v-model="setLevelModel.userId" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="会员类型：" prop="memberType">
                <el-select v-model="setLevelModel.memberType" size="medium">
                    <el-option v-for="(val, key) in memberTypeList" :key="key" :label="val" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="原来等级：" prop="source">
                <el-select v-model="setLevelModel.source" size="medium">
                    <el-option v-for="(val, key) in memberLevel" :key="key" :label="val" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="要升到的等级：" prop="target">
                <el-select v-model="setLevelModel.target" size="medium">
                    <el-option v-for="(val, key) in memberLevel" :key="key" :label="val" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="submit" :loading="loading">确定</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'setUserLevel',
    data() {
        return {
            loading: false,
            setLevelModel: {
                userId: '',
                memberType: '0',
                source: '2',
                target: '2'
            },
            ruleValidate: {
                userId: [{
                    required: true,
                    message: '用户ID不能为空',
                    trigger: 'blur'
                }]
            },
            memberTypeList: {
                '0': '普通',
                '1': '小礼包 ',
                '2': '大礼包 ',
                '3': '虚拟',
                '4': '课程 ',
                '5': '直播'
            },
        }
    },
    computed: {
        ...mapState({
            memberLevel: state => state.dict.memberLevel
        })
    },
    methods: {
        submit() {
            this.$refs.setLevelForm.validate((valid) => {
                if (valid) {
                    this.loading = true
                    this.$emit('on-submit', this.setLevelModel)
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


