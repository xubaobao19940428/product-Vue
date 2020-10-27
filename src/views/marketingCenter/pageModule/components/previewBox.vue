<template>
    <div class="preview-wrapper">
        <div class="preview-mobile-wrapper">
            <page-title :data="pageData" @click.native="setCurrentIndex(-1)" :lang="lang"></page-title>
            <div class="preview-content-activity" :style="{background: pageData.background}">
                <div v-for="(item, i) in componentsData"
                    :key="item.moduleId + '_' + i"
                    @click="setCurrentIndex(i)"
                    :class="['components-item', i == currentComponentIndex ? 'active': '', item.basicName === 'graphicNavigation' ? (item.info.position || 'gn-sticky') : '']">
                    <component
                        :is="item.basicName"
                        :data="item"
                        :info="item.info"
                        :index="i"
                        :moduleId="item.moduleId"
                        :class="'floor-point-' + item.moduleId"
                        :activityCountryCode="pageData.countryCode"
                        :isTest="true"
                        :imgHeadUrl="imgHeadUrl"
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
        </div>
    </div>
</template>
<script>
    import Sortable from 'sortablejs'
    import { createRandomId } from '@/utils/index.js'
    import { mapState } from 'vuex'
    import floorAnchor from './preview/floorAnchor'
    import graphicNavigation from './preview/graphicNavigation'
    import imageAd from './preview/imageAd'
    import productList from './preview/productList'
    import pageTitle from './preview/pageTitle'
    import fingoCoupon from './preview/fingoCoupon'
    import fingoGroup from './preview/fingoGroup'
    import lottery from './preview/lottery'
    import potentialFans from './preview/potentialFans'
    // import hoverBtn from './preview/hoverBtn'
    export default {
        data () {
            return {
                sortable: null,
                dataList: [],
                lang: 'cn',
                contentBoxEl: null,
                imgHeadUrl: process.env.VUE_APP_FILE_URL
            }
        },
        components: {
            pageTitle,
            floorAnchor,
            graphicNavigation,
            imageAd,
            productList,
            fingoCoupon,
            fingoGroup,
            lottery,
            potentialFans
            // hoverBtn
        },
        computed: {
            ...mapState({
                componentsData: state => state.pageEdit.componentsData,
                currentComponentIndex: state => state.pageEdit.currentComponentIndex,
                leftNavList: state => state.pageEdit.leftNavList,
                pageData: state => state.pageEdit.pageData,
                languageList: state => state.dict.languageList,
                basicDetail: state => state.pageEdit.basicDetail
            })
        },
        mounted () {
            let $el = this.$el.querySelector('.preview-content-activity')
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
                    this.$store.dispatch('updatePageData', {
                        type: 'sort',
                        newIndex: e.newIndex,
                        oldIndex: e.oldIndex
                    })
                    if (e.oldIndex === this.currentComponentIndex) {
                        this.$store.dispatch('setCurrentComponentIndex', e.newIndex)
                    }
                },
                onAdd: (e) => {
                    // 新增组件
                    let basicName = e.clone.getAttribute('data-name')
                    let dataList = e.clone.getAttribute('data-list')
                    dataList = dataList ? JSON.parse(dataList) : []
                    let name = this.initCompoentName() // 输入的组件名称
                    let item = dataList.find((val) => {
                        return val.basicName == basicName
                    })
                    this.$store.dispatch('updatePageData', {
                        type: 'add',
                        index: e.newIndex,
                        data: {
                            basicName,
                            info: item ? JSON.parse(JSON.stringify(item.info)) : {},
                            name,
                            moduleId: createRandomId()
                        }
                    })
                    e.to.removeChild(e.item)
                }
            })

        },
        methods: {
            setCurrentIndex (i) {
                this.$store.dispatch('setCurrentComponentIndex', i)
            },
            deleteComponent (i) {
                // 删除组件
                this.$confirm('确定删除组件？', '提示')
                    .then(() => {
                        this.$store.dispatch('updatePageData', {
                            type: 'del',
                            index: i
                        })
                    })
                    .catch(() => {})
            },
            initCompoentName () {
                let res = []
                for (let i = 0; i < this.languageList.length; i++) {
                    let item = this.languageList[i]
                    res.push({
                        languageCode: item.code,
                        name: ''
                    })
                }

                return res
            },
            getComponentName (item) {
                let { name } = item
                let res = name.find(item => item.languageCode === 'cn')
                return res.name || this.basicDetail[item.basicName].title
            },
            scrollTo (pos) {
                let eleList = this.$el.querySelectorAll('.components-item')

                eleList[pos].scrollIntoView({
                    behavior: 'auto',
                    block: 'center'
                })
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
       margin: 24px auto 0;
       height: 94%;
       user-select: none;
       display: flex;
       flex-direction: column;
        overflow: scroll;
        .preview-mobile-wrapper {
            width: 375px;
            height: 100%;
            background: url('../../../../assets/images/mobile-module.png');
            background-repeat: no-repeat;
            background-size: 100% auto;
        }
       .preview-content-activity{
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
   }
</style>
