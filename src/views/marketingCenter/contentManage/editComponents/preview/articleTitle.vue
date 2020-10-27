<template>
    <div class="preview-header">
        <div v-if="contentType == 3" class="preview-header-l" @click.stop="setCurrentIndex(-2)">
            <i class="el-icon-arrow-left btn-back"></i>
            <div class="user-cover">
                <img v-if="pageData.roleCover" :src="dealShowFileSrc(pageData.roleCover)">
                <img src="@/assets/img/user-header.png">
            </div>
            <span v-if="pageData.roleName">{{ pageData.roleName }}</span>
            <span v-else>请输入角色昵称</span>
        </div>
        <template v-else>
            <i class="el-icon-arrow-left btn-back"></i>
            <div class="title">{{ getTitle() }}</div>
        </template>
        <div class="preview-img">
            <img src="@/assets/share-black-icon.png"/>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex'

    export default {
        props: {
            contentType: [String, Number]
        },
        data () {
            return {}
        },
        computed: {
            ...mapState({
                pageData: state => state.contentManage.pageData,
                articleLangInfos: state => state.contentManage.articleLangInfos,
                currentLangIndex: state => state.contentManage.currentLangIndex
            })
        },
        methods: {
            getTitle () {
                return this.currentLangIndex != -1 ? this.articleLangInfos[this.currentLangIndex].articleTitle : ''
            },
            setCurrentIndex (i) {
                this.$store.dispatch('updateArticleComponentsIndex', i)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .preview-header{
        width: 100%;
        height: 46px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        margin-top: 16px;
        box-sizing: border-box;
        padding: 0 16px;
        .title {
            font-size: 20px;
            color: #000;
            font-weight: 500;
        }
        .btn-back{
            font-weight: 600;
            font-size: 16px;
        }
        .preview-img {
            width: 18px;
            height: 18px;
            img {
                width: 100%;
                vertical-align: middle;
            }
        }
        .preview-header-l{
            display: flex;
            align-items: center;
            flex: 1;
            .user-cover{
                width: 25px;
                height: 25px;
                border-radius: 100%;
                overflow: hidden;
                margin-left: 3px;
                font-size: 10px;
                img{
                    width: 100%;
                    display: flex;
                }
            }
            span{
                flex: 1;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                color: #333;
                font-size: 16px;
                margin-left: 5px;
            }
        }
    }
</style>
