<template>
    <div class="preview-wrapper">
        <div class="preview-mobile-wrapper">
            <!--  标题-->
            <page-title @click.native="setCurrentIndex(-1)" :contentType="pageData.contentType"></page-title>
            <!--  瀑布流-->
            <waterfall-preview v-if="pageData.contentType == 3"></waterfall-preview>
            <!--  图文-->
            <graphic-preview-box v-else></graphic-preview-box>
        </div>
    </div>
</template>
<script>
    import pageTitle from './preview/articleTitle'
    import graphicPreviewBox from './graphicPreviewBox'
    import waterfallPreview from './waterfallPreview'
    import { mapState } from 'vuex'
    export default {
        data () {
            return {}
        },
        components: {
            pageTitle,
            graphicPreviewBox,
            waterfallPreview
        },
        computed: {
            ...mapState({
                pageData: state => state.contentManage.pageData
            })
        },
        methods: {
            setCurrentIndex (i) {
                this.$store.dispatch('updateArticleComponentsIndex', i)
            }
        }
    }
</script>
<style lang="scss">
    .preview-wrapper{
        .highlight-class{
            border: 1px solid #155bd4;
            height: 40px;
            position: relative;
        }
        .highlight-class::before{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #444;
            background-color: #e0edff;
            position: absolute;
            left: 0;
            top: 0;
            content: '组件放置区域';
        }
    }
</style>
<style lang="scss" scoped>
    .preview-wrapper{
        width: 475px;
        margin: 30px auto 0;
        height: 90%;
        user-select: none;
        display: flex;
        flex-direction: column;
        // overflow: scroll;
        .preview-mobile-wrapper {
            width: 375px;
            height: 100%;
            background-image: url('../../../../assets/images/mobile-module.png');
            background-repeat: no-repeat;
            background-size: 100% auto;
        }
    }
</style>
