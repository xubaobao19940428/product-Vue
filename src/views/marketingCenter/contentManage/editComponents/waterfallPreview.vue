<!--瀑布流预览-->
<template>
    <div class="preview-content">
        <div v-for="(item, i) in componentsData"
             :key="item.moduleId + '_' + i"
             @click="setCurrentIndex(i)"
             :class="['components-item', i == currentComponentIndex ? 'active': '']">
            <component
                :is="getComponentName(item)"
                :data="item"
                :index="i"
                :class="'floor-point-' + item.moduleId"
                :lang="lang"></component>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import swipe from './preview/swipe'
    import productList from './preview/productList'
    import topic from './preview/topic'

    export default {
        data () {
            return {}
        },
        components: {
            swipe,
            productList,
            topic
        },
        computed: {
            ...mapState({
                countryList: state => state.dict.countryList,
                articleLangInfos: state => state.contentManage.articleLangInfos,
                currentLangIndex: state => state.contentManage.currentLangIndex,
                currentComponentIndex: state => state.contentManage.currentComponentIndex,
                leftNavList: state => state.contentManage.leftNavList
            }),
            componentsData () {
                console.log(this.articleLangInfos)
                if (this.currentLangIndex != -1 && this.articleLangInfos.length > 0) {
                    return this.articleLangInfos[this.currentLangIndex].contentComponents
                }
                return []
            }
        },
        methods: {
            setCurrentIndex (i) {
                this.$store.dispatch('updateArticleComponentsIndex', i)
            },
            getComponentName (item) {
                console.log(item)
                let Obj = JSON.parse(item.componentValue)
                return Obj.componentName
            }
        }
    }
</script>
<style lang="scss" scoped>
    .preview-content{
        z-index: 2;
        flex: 1;
        background-color: #fff;
        position: relative;
        min-height: 100%;
    }
</style>
