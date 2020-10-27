<template>
    <el-card class="basic-info-card">
        <div slot="header" class="clearfix">
            <span>修改用户国家</span>
        </div>
        <el-form label-width="120px" ref="changeCountryForm" :model="changeCountryModel" :rules="ruleValidate">
            <el-form-item label="注意：" prop="userId">
                <div> <span style="color: red">修改用户国家会自动将该用户的积分转换成新国家币种的积分</span></div>
                <div><span  style="color: red">并且收支流水记录也会被转换为新币种对应的积分</span></div>
            </el-form-item>
            <el-form-item label="用户ID：" prop="userId">
                <el-input style="width: 210px;" v-model="changeCountryModel.userId" size="medium" clearable></el-input>
            </el-form-item>
            <!--<el-form-item label="原来国家：" prop="orgCountryCode">-->
                <!--<el-select v-model="changeCountryModel.orgCountryCode" filterable clearable size="medium">-->
                    <!--<el-option v-for="(item, key) in countryList" :key="key" :label="item.label" :value="item.value"></el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="修改国家为：" prop="newCountryCode">
                <el-select v-model="changeCountryModel.newCountryCode" filterable clearable size="medium">
                    <el-option v-for="(item, key) in countryList" :key="key" :label="item.label" :value="item.value"></el-option>
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
        name: 'changeCountry',
        data () {
            return {
                loading: false,
                changeCountryModel: {
                    userId: '',
                    orgCountryCode: '',
                    newCountryCode: ''
                },
                ruleValidate: {
                    userId: [{
                        required: true,
                        message: '用户ID不能为空',
                        trigger: 'blur'
                    }],
                    orgCountryCode: [{
                        required: true,
                        message: '原先国家不能为空',
                        trigger: 'blur'
                    }],
                    newCountryCode: [{
                        required: true,
                        message: '修改国家不能为空',
                        trigger: 'blur'
                    }]
                },
                countryList: [{
                    label: '马来西亚',
                    value: 'MY'
                }, {
                    label: '新加坡',
                    value: 'SG'
                }, {
                    label: '泰国',
                    value: 'TH'
                }, {
                    label: '印尼',
                    value: 'ID'
                }]
            }
        },
        computed: {

        },
        methods: {
            submit () {
                this.$refs.changeCountryForm.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$emit('on-submit', this.changeCountryModel)
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
