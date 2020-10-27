<template>
    <el-dialog
        title="用户属性筛选"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="cancel">
        <el-form inline :model="queryData" :rules="rules">
            <el-form-item prop="propertyName" label="用户属性名称：" class="filter-item">
                <el-select v-model="queryData.propertyName" @blur="getUserPropertyList" :remote-method="getUserPropertyList"
                    filterable clearable remote reserve-keyword placeholder="支持模糊搜索" style="width: 260px" @change="userChange">
                    <el-option v-for="item in userPropertyList" :key="item.propertyType" :label="item.propertyName" :value="item.propertyName"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div v-if="queryData.propertyDesc">属性描述：{{ queryData.propertyDesc }}</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { GetUserPropertyList } from '@/request/pushtask'

    export default {
        data () {
            return {
                queryData: {
                    propertyName: '',
                    page: {
                        pageNum: 1,
                        pageSize: 100,
                        pagingSwitch: true
                    },
                    propertyDesc: '',
                    propertyKey: ''
                },
                userPropertyList: '',
                userPropertyType: '',
                rules: {propertyName:[{ required: true, message: '请选择用户属性名称', trigger: 'change' }]}
            }
        },
        props: {
            dialogVisible: Boolean,
            mark: String
        },
        mounted() {
            this.getUserPropertyList()
        },
        computed:{
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {}
            }
        },
        methods: {
            getUserPropertyList (val) {
                let params = {
                    propertyName: val?val:this.queryData.propertyName,
                    page: this.queryData.page
                }
                GetUserPropertyList(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.userPropertyList = res.userPropertyList
                    }
                })
            },
            userChange (value) {
                for (const iterator of this.userPropertyList) {
                    if (iterator.propertyName === value) {
                        this.queryData.propertyDesc = iterator.propertyDesc
                        this.queryData.userPropertyType = iterator.propertyType
                        this.queryData.propertyKey = iterator.propertyKey
                    }
                }
            },
            cancel () {
                this.$emit('on-cacel')
            },
            confirm () {
                this.$emit('on-confirm',this.queryData.userPropertyType,this.queryData.propertyName,this.queryData.propertyDesc,this.queryData.propertyKey,this.mark)
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>