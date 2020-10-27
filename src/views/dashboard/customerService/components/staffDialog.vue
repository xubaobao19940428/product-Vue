<template>
    <el-dialog
        :title="title"
        :visible.sync="toggle"
        width="30%"
        :before-close="cancle"
        class="staff-dialog">
        <div class="staff-btn-box" v-if="nameList.length!==0">
            <div v-for="(item,index) in nameList" :key="index" class="staff-btn">
                <el-button type="primary" plain>{{item}}</el-button>
            </div>
        </div>
        <div v-else class="none">暂无</div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="cancle">关 闭</el-button>
        </span>
    </el-dialog>
</template>
<script>
    export default {
        data () {
            return {

            }
        },
        props: {
            title:String,
            nameList: Array,
            dialogVisible:Boolean
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible
                },
                set: function () {}
            }
        },
        methods: {
            cancle () {
                this.$emit('on-cancle')
            },
        },
    }
</script>
<style lang="scss" scoped>
    .staff-dialog{
        .staff-btn-box{
            display: flex;
            flex-wrap: wrap;
            .staff-btn{
                margin-right: 10px;
                margin-top: 5px;
            }
        }
        .none{
            font-size: 20px;
            font-weight: 600;
        }
    }
</style>