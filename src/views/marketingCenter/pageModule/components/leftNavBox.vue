<template>
    <div class="base-components-wrapper">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="基础组件" name="1">
                <ul class="base-components-box"
                    draggable=".base-component-item"
                    :list="leftNavList"
                    :group="{ name: 'shared', pull: 'clone', put: false }"
                    :sort="false">
                    <li class="base-component-item" v-for="item in leftNavList" v-if="!item.hidden" :key="item.basicName" :data-name="item.basicName" :data-list="JSON.stringify(leftNavList)">
                        <i class="iconfont" v-html="item.icon"></i>
                        <span>{{ item.title }}</span>
                    </li>
                </ul>
            </el-collapse-item>
            <el-collapse-item title="定制套件" name="2">
                <ul class="base-components-box"
                    draggable=".base-component-item"
                    :list="leftPrivateList"
                    :group="{ name: 'shared', pull: 'clone', put: false }"
                    :sort="false">
                    <li class="base-component-item" v-for="item in leftPrivateList" v-if="!item.hidden" :key="item.basicName" :data-name="item.basicName" :data-list="JSON.stringify(leftPrivateList)">
                        <i class="iconfont" v-html="item.icon"></i>
                        <span>{{ item.title }}</span>
                    </li>
                </ul>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
    import Sortable from 'sortablejs'
    export default {
        data () {
            return {
                activeNames: '1'
            }
        },
        computed: {
            leftNavList () {
                return this.$store.state.pageEdit.leftNavList
            },
            leftPrivateList () {
                return this.$store.state.pageEdit.leftPrivateList
            }
        },
        mounted () {
            let $elList = this.$el.querySelectorAll('.base-components-box')
            $elList.forEach(($el) => {
                Sortable.create($el, {
                    group: {
                        name: 'shared',
                        pull: 'clone',
                        put: false
                    },
                    sort: false
                })
            })
        }
    }
</script>
<style lang="scss">
.base-components-wrapper{
    width: 100%;
    .el-collapse{
        border: 0;
    }
    .el-collapse-item__wrap{
        border: 0;
    }
    .base-components-box{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .base-component-item{
            width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #666;
            box-sizing: border-box;
            padding: 10px;
            margin-bottom: 10px;
            cursor: move;
            position: relative;
            i{
                font-size: 30px;
            }
            &:hover{
                background: #155bd4;
                color: #fff;
            }
        }
    }
}
</style>
