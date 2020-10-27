<template>
    <div class="role-action-box">
        <div class="action-title">角色</div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>已选角色</span>
            </div>
            <div class="item-list">
                <b>头像：</b>
                <img :src="dealShowFileSrc(pageData.roleCover)">
            </div>
            <div class="item-list">
                <b>昵称：</b>
                <span>{{ pageData.roleName }}</span>
            </div>
        </el-card>
        <el-button class="add-box" @click="showAddDialog = true">
            <span>新 建</span>
        </el-button>
        <el-button class="add-box" @click="showSelectDialog = true">
            <span>选 择</span>
        </el-button>
        <rule-add v-if="showAddDialog" :showDialog="showAddDialog" @confirm="confirmAdd" @close="showAddDialog = false"></rule-add>
        <rule-select v-if="showSelectDialog" :showSelectDialog="showSelectDialog" @confirm="confirmAdd" @close="showSelectDialog = false"></rule-select>
    </div>
</template>
<script>
    import ruleAdd from './components/ruleAddDialog'
    import ruleSelect from './components/ruleSelectDialog'
    import { mapState } from 'vuex'
    export default {
        data () {
            return {
                showAddDialog: false,
                showSelectDialog: false
            }
        },
        computed: {
            ...mapState({
                pageData: state => state.contentManage.pageData
            })
        },
        components: {
            ruleAdd,
            ruleSelect
        },
        methods: {
            confirmAdd (data) {
                this.$store.dispatch('updateArticlePageData', {
                    roleName: data.roleName,
                    roleCover: data.roleCover
                })
                this.showAddDialog = false
                this.showSelectDialog = false
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "./common";
    .role-action-box{
        .item-list{
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            img{
                width: 100px;
                display: flex;
            }
        }
    }
</style>
