<template>
    <div class="right-action-box">
        <template v-if="currentComponentIndex == -1 && !componentsData[currentComponentIndex]">
            <page-title></page-title>
        </template>
        <template v-else-if="isComponentManage">
            <components-manage></components-manage>
        </template>
        <template v-else-if="currentComponentIndex != -1 && componentsData[currentComponentIndex]">
            <component :is="componentsData[currentComponentIndex].basicName"
                :data="componentsData[currentComponentIndex]"
                :currentComponentIndex="currentComponentIndex"
                :handleNameChange="handleNameChange"
            ></component>
        </template>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import floorAnchor from './rightAction/floorAnchor'
    import graphicNavigation from './rightAction/graphicNavigation'
    import imageAd from './rightAction/imageAd'
    import productList from './rightAction/productList'
    import pageTitle from './rightAction/pageTitle'
    import componentsManage from './rightAction/componentsManage'
    import fingoCoupon from './rightAction/fingoCoupon'
    import fingoGroup from './rightAction/fingoGroup'
    import pageCountDown from './rightAction/pageCountDown'
    import lottery from './rightAction/lottery'
    import hoverBtn from './rightAction/HoverBtn'
    import potentialFans from './rightAction/potentialFans'
    export default {
        data () {
            return {}
        },
        components: {
            floorAnchor,
            graphicNavigation,
            imageAd,
            productList,
            componentsManage,
            pageTitle,
            fingoCoupon,
            fingoGroup,
            pageCountDown,
            lottery,
            hoverBtn,
            potentialFans
        },
        computed: {
            ...mapState({
                componentsData: state => state.pageEdit.componentsData,
                currentComponentIndex: state => state.pageEdit.currentComponentIndex,
                isComponentManage: state => state.pageEdit.isComponentManage
            })
        },
        methods: {
            handleNameChange ({currentComponentIndex, name}) {
                this.$store.dispatch('updateComponentNameData', {
                    index: currentComponentIndex,
                    name: name
                })
            }
        }
    }
</script>

<style lang="scss">
.right-action-box {
    .head {
        margin-bottom: 16px;
        h5 {
            font-size: 20px;
            margin-bottom: 8px;
            font-weight: 500;
        }
    }
    .common-box {
        background-color: #f1f2f3;
        padding: 12px;
        color: #606266;
        display: flex;
        flex-direction: column;
        .df {
            display: flex;
        }
        .multi-upload-box {
            .multi-upload-show {
                width: 100%;
            }
        }
        li {
            background-color: #fff;
            padding: 16px 24px;
            margin-bottom: 12px;
            border-radius: 4px;
            line-height: 1;
        }
        .item {
            padding: 12px 12px 12px 8px;
        }

        .hover-del {
            position: relative;
            .hover {
                cursor: pointer;
                position: absolute;
                display: none;
                font-size: 18px;
                right: 0;
            }

            &:hover {
                .hover {
                    display: inline-block;
                    &:hover {
                        color: #409eff;
                    }
                }
            }
        }
    }

    .content {
        .common-text {
            font-weight: 500;
            font-size: 16px;
            color: #000;
        }
    }

    .label-line {
        .el-form-item__label {
            width: 100%;
            text-align: left;
        }
    }

    .border-line {
        border-top: 1px solid #f1f2f3;
    }

    .el-checkbox__inner {
        width: 20px;
        height: 20px;
        &::after {
            height: 10px;
            width: 6px;
            left: 5px;
        }
    }

    .margin-left {
        margin-left: 86px;
    }

    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
        color: #409eff;
        background-color: #ecf5ff;
    }
    .name-input {
        width: 66%;
        display: inline-block;
    }
}
</style>
