<template>
    <div class="preview-content">
        <div v-for="(item, i) in componentsData"
             :key="item.moduleId + '_' + i"
             @click="setCurrentIndex(i)"
             :class="['components-item', i == currentComponentIndex ? 'active': '']">
            <component
                :is="item.componentName"
                :data="item"
                :index="i"
                :class="'floor-point-' + item.moduleId"
                :lang="lang"></component>
            <div class="delete-box">
                <i @click.stop="deleteComponent(i)" class="el-icon-delete"></i>
                <div class="widget-name">
                    <span class="widget-name__arrow-out"></span>
                    {{ getComponentName(item) }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Sortable from 'sortablejs'
    import { createRandomId } from '@/utils/index.js'
    import textBox from './preview/textBox'
    import videoBox from './preview/videoBox'
    import urlBox from './preview/urlBox'
    import imgBox from './preview/imgBox'
    import pageTitle from './preview/articleTitle'
    import { mapState } from 'vuex'
    export default {
        data () {
            return {
                sortable: null,
                dataList: [],
                lang: 'cn'
            }
        },
        components: {
            textBox,
            videoBox,
            urlBox,
            imgBox,
            pageTitle
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
                if (this.currentLangIndex != -1 && this.articleLangInfos.length > 0) {
                    return this.articleLangInfos[this.currentLangIndex].contentComponents
                }
                return []
            }
        },
        mounted () {
            let $el = this.$el
            this.sortable = Sortable.create($el, {
                group: {
                    name: 'shared',
                    pull: false,
                    put: true
                },
                sort: true,
                animation: 100,
                ghostClass: 'highlight-class',
                onUpdate: (e) => {
                    console.log('onUpdate')
                    // 组件排序
                    this.$store.dispatch('updateArticleComponents', {
                        type: 'sort',
                        newIndex: e.newIndex,
                        oldIndex: e.oldIndex
                    })
                    if (e.oldIndex === this.currentComponentIndex) {
                        this.$store.dispatch('updateArticleComponentsIndex', e.newIndex)
                    }
                },
                onAdd: (e) => {
                    // 新增组件
                    let componentName = e.clone.getAttribute('data-name')
                    let data = this.leftNavList.find((val) => {
                        return val.basicName == componentName
                    })
                    this.$store.dispatch('updateArticleComponents', {
                        type: 'add',
                        index: e.newIndex,
                        data: {
                            componentName,
                            componentType: data.componentType,
                            componentLocation: e.newIndex + '',
                            componentValue: data && data.info ? JSON.stringify(data.info) : '',
                            moduleId: createRandomId()
                        }
                    })
                    e.to.removeChild(e.item)
                }
            })
        },
        methods: {
            setCurrentIndex (i) {
                this.$store.dispatch('updateArticleComponentsIndex', i)
            },
            deleteComponent (i) {
                // 删除组件
                this.$confirm('确定删除组件？', '提示')
                    .then(() => {
                        this.$store.dispatch('updateArticleComponents', {
                            type: 'del',
                            index: i
                        })
                    })
                    .catch(() => {})
            },
            getComponentName (item) {
                let data = this.leftNavList.find((val) => {
                    return val.basicName == item.componentName
                })
                return data ? data.title : item.componentName
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
        .components-item{
            cursor: move;
            position: relative;
        }
        .components-item::before{
            content: none;
            background: 0;
        }
        .gn-sed {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1001;
        }
        .gn-sticky {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            z-index: 1001;
        }
        .delete-box{
            position: absolute;
            top: 0;
            right: -40px;
            width: 34px;
            i{
                background-color: #fff;
                box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
                cursor: pointer;
                position: absolute;
                left: -6px;
                width: 40px;
                height: 28px;
                text-align: center;
                line-height: 28px;
                display: none;
            }
            .widget-name{
                display: inline-block;
                background-color: #fff;
                width: 80px;
                height: 24px;
                text-align: center;
                line-height: 24px;
                font-size: 12px;
                pointer-events: none;
                box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
            }
            .widget-name__arrow-out{
                width: 0;
                height: 0;
                border-width: 5px;
                border-style: solid;
                border-color: transparent #fff transparent transparent;
                position: absolute;
                bottom: 7px;
                left: -10px;
            }
        }
        .components-item:hover{
            &::before{
                border: 1px dashed #155bd4;
                position: absolute;
                content: '';
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
            .delete-box{
                .widget-name{
                    display: none;
                }
                i{
                    display: inline-block;
                }
            }
        }
        .active{
            &::before{
                border: 2px solid #155bd4 !important;
                position: absolute;
                content: '';
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: 4;
            }
            .delete-box{
                .widget-name{
                    display: none;
                }
                i{
                    display: inline-block;
                }
            }
        }
    }
</style>
