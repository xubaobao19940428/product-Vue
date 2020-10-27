<!--图文预览-->
<template>
    <div>
        <component :is="componentsData[currentComponentIndex].componentName" :data="componentsData[currentComponentIndex]" :curIndex="currentComponentIndex"></component>
    </div>
</template>
<script>
    import textBox from './action/textBox'
    import videoBox from './action/videoBox'
    import urlBox from './action/urlBox'
    import imgBox from './action/imgBox'
    import articleBasic from './action/articleBasic'
    import { mapState } from 'vuex'
    export default {
        data () {
            return {
            }
        },
        computed: {
            ...mapState({
                countryList: state => state.dict.countryList,
                articleLangInfos: state => state.contentManage.articleLangInfos,
                currentLangIndex: state => state.contentManage.currentLangIndex,
                currentComponentIndex: state => state.contentManage.currentComponentIndex
            }),
            componentsData () {
                if (this.currentLangIndex != -1 && this.articleLangInfos.length > 0) {
                    return this.articleLangInfos[this.currentLangIndex].contentComponents
                }
                return []
            }
        },
        components: {
            textBox,
            videoBox,
            urlBox,
            imgBox,
            articleBasic
        }
    }
</script>
