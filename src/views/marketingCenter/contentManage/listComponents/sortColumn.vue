<template>
    <el-dialog 
        class="sort-column-dialog" 
        :visible.sync="toggle" 
        :close-on-click-modal="false"
        @close="handleClose" width="600px">
        <div class="content-wrapper">
            <ul class="app-home-list-wrapper">
                <li v-for="item in columnTabs" :key="item.specialColumnId">
                    <div class="left">
                        <!-- {{item.orderIndex}} ==>  -->
                        {{ item.specialColumnName }}
                    </div>
                    <i class="iconfont">&#xe6b3;</i>
                </li>
            </ul>
        </div>
        <span class="footer" slot="footer">
            <el-button @click="handleClose">关闭</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { SortSpecialColumn } from '@/request/manage'
    import Sortable from 'sortablejs'

    export default {
        data () {
            return {

            }
        },
        props: {
            columnTabs: Array,
            dialogVisible: Boolean
        },
        mounted () {
            this.setSort()
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {}
            }
        },
        methods: {
            handleClose () {
                this.$emit('on-cancel')
            },
            setSort () {
                this.$nextTick(() => {
                    let $el = this.$el.querySelector('.app-home-list-wrapper')
                    this.sortable = Sortable.create($el, {
                        group: {
                            name: 'app-set-manage',
                            pull: false,
                            put: true
                        },
                        sort: true,
                        ghostClass: 'components-class',
                        onUpdate: (e) => {
                            console.log(e)
                            console.log(this.columnTabs[e.oldIndex].orderIndex,this.columnTabs[e.oldIndex].specialColumnId,e.oldIndex,this.columnTabs[e.oldIndex].specialColumnName)
                            console.log(this.columnTabs[e.newIndex].orderIndex,this.columnTabs[e.newIndex].specialColumnId,e.newIndex,this.columnTabs[e.newIndex].specialColumnName)
                            this.sortColumn(this.columnTabs[e.oldIndex].specialColumnId,this.columnTabs[e.newIndex].orderIndex)
                            const tempIndex = this.columnTabs.splice(e.oldIndex, 1)
                            this.columnTabs.splice(e.newIndex, 0, ...tempIndex)
                        }
                    })
                })
            },
            sortColumn (id, index) {
                let params = {
                    specialColumnId: id,
                    orderIndex: index
                }
                SortSpecialColumn(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('排序保存成功')
                        this.$parent.getAllSubjects()
                        this.$emit('close')
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.sort-column-dialog {
    ul {
        padding: 0 32px;
        li {
            cursor: move;
            margin: 12px 0 0 0;
            border-radius: 2px;
            background-color: #fff;
            line-height: 40px;
            padding: 0 10px;
            user-select: none;
            font-size: 14px;
            box-shadow: 0 0 4px 0 rgba(10,42,97,.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 400;
            color: #606266;
            .iconfont {
                font-size: 18px;
                cursor: pointer;
            }
        }
    }
}
</style>