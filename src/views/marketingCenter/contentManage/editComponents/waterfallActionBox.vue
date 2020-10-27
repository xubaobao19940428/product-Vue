<!--瀑布流操作-->
<template>
    <div>
        <component :is="getComponentName()" :data="componentsData[currentComponentIndex]" :curIndex="currentComponentIndex"></component>
    </div>
</template>
<script>
    import swipe from './action/swipe'
    import productList from './action/productList'
    import topic from './action/topic'
    import role from './action/role'
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
            swipe,
            productList,
            topic,
            role
        },
        methods: {
            getComponentName () {
                let Obj = JSON.parse(this.componentsData[this.currentComponentIndex].componentValue)
                return Obj.componentName
            }
        }
    }
</script>
