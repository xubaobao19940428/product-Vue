<template>
    <el-dialog 
        class="sort-column-dialog" 
        :visible.sync="toggle" 
        :close-on-click-modal="false"
        @close="handleClose" width="600px">
        <div class="content-wrapper">
            <ul class="app-home-list-wrapper">
                <li v-for="item in subjectList" :key="item.specialSubjectId">
                    <div class="left">
                        <!-- {{item.orderIndex}} ==>  -->
                        {{ item.specialSubjectName }}
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
    import { SortSpecialSubject } from '@/request/manage'
    import Sortable from 'sortablejs'

    export default {
        data () {
            return {

            }
        },
        props: {
            subjectList: Array,
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
                            console.log(this.subjectList[e.oldIndex].orderIndex,this.subjectList[e.oldIndex].specialSubjectId,e.oldIndex,e.newIndex,this.subjectList[e.oldIndex].specialSubjectName)
                            console.log(this.subjectList[e.newIndex].orderIndex,this.subjectList[e.newIndex].specialSubjectId,e.newIndex,e.newIndex,this.subjectList[e.newIndex].specialSubjectName)
                            this.sortSubject(this.subjectList[e.oldIndex].specialSubjectId,this.subjectList[e.newIndex].orderIndex)
                            const tempIndex = this.subjectList.splice(e.oldIndex, 1)
                            this.subjectList.splice(e.newIndex, 0, ...tempIndex)
                        }
                    })
                })
            },
            // 专题排序
            sortSubject (id, index) {
                console.log(id, index)
                let params = {
                    specialSubjectId: id,
                    orderIndex: index
                }
                SortSpecialSubject(params).then(res => {
                    this.$message.success('专题位置更新成功')
                    this.$parent.getAllSubjects()
                })
            },
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