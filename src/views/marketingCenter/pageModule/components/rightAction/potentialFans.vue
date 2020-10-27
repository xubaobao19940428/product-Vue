<template>
    <div class="potential-fans">
        <div class="head">
            <h5>潜力粉丝</h5>
            <div class="tips">展示会员的直邀粉丝及他们的订单数，支持直接联系粉丝</div>
        </div>
        <el-form :model="info">
            <el-form-item label="组件名称" class="label-line border-line">
                <el-select v-model="nameLang" style="width: 31%">
                    <el-option v-for="(item, index) in languageList"
                               :key="index"
                               :label="item.desc"
                               :value="item.code"
                    ></el-option>
                </el-select>
                <div v-for="(item, index) in name" v-show="nameLang === item.languageCode" :key="index" class="name-input mar-l-10">
                    <el-input v-model="item.name" type="text" placeholder="请输入" @change="handleNameChange({ currentComponentIndex, name })"/>
                </div>
            </el-form-item>
            <el-form-item label="示例">
                <img class="demo-img" src="@/assets/fans-demo.png">
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { mapState } from 'vuex'

    export default {
        props: {
            data: [Object, Array],
            handleNameChange: Function,
            currentComponentIndex: [String, Number]
        },
        data () {
            return {
                nameLang: 'cn',
                name: []
            }
        },
        watch: {
            data: {
                handler (val) {
                    let { info, name } = val
                    this.init(info, name)
                },
                deep: true
            }
        },
        created () {
            let { info, name } = this.data
            this.init(info, name)
        },
        computed: {
            ...mapState({
                languageList: state => state.dict.languageList
            })
        },
        methods: {
            init (info, name) {
                this.name = name
            }
        }
    }
</script>
<style lang="scss" scoped>
    .potential-fans{
        .demo-img{
            width: 100%;
            display: flex;
        }
        .tips{
            color: #999;
            font-size: 12px;
        }
    }
</style>
