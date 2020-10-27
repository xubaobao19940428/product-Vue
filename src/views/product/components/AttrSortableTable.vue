<template>
    <div>
       <el-table ref="dragTable" :data="listData" row-key="attrId" fit highlight-current-row style="width: 100%; margin-top:16px;" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
            <el-table-column label="属性ID" align="center"  width="70">
                <template slot-scope="scope">
                    <span>{{ scope.row.attrId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="中文cn" width="110px" align="center" >
               <template slot-scope="scope">
                    <span>{{ scope.row.cn }}</span>
               </template>
            </el-table-column>
            <el-table-column label="英文en" width="110px" align="center" >
               <template slot-scope="scope">
                    <span>{{ scope.row.en }}</span>
               </template>
            </el-table-column>
            <el-table-column label="马来语ms" width="110px" align="center" >
               <template slot-scope="scope">
                    <span>{{ scope.row.ms }}</span>
               </template>
            </el-table-column>
            <el-table-column label="泰语th" width="110px" align="center" >
               <template slot-scope="scope">
                    <span>{{ scope.row.th }}</span>
               </template>
            </el-table-column>
            <el-table-column label="自定义" width="100px" align="center" >
               <template slot-scope="scope">
                    <span>{{ scope.row.customize }}</span>
               </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="90">
                <template slot-scope="scope">
                    <el-button type="text"><i class="el-icon-s-operation"></i></el-button>
                    <el-button type="text" @click="removeAttr(scope.row.attrId)"><i class="el-icon-close"></i></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import Sortable from 'sortablejs'

    export default {
        // 类目属性排序table
        name: 'AttrSortableTable',
        props: {
            listData: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                list: [
                    {
                        id: 1,
                        cn: '颜色',
                        en: 'color',
                        ms: 'warna',
                        th: 'สี',
                        custom: '允许'
                    },
                    {
                        id: 2,
                        cn: '材质',
                        en: 'color',
                        ms: 'warna',
                        th: 'สี',
                        custom: '禁止'
                    },
                    {
                        id: 3,
                        cn: '大小',
                        en: 'size',
                        ms: 'warna',
                        th: 'สี',
                        custom: '允许'
                    },
                    {
                        id: 5,
                        cn: '材质',
                        en: 'color',
                        ms: 'warna',
                        th: 'สี',
                        custom: '禁止'
                    },
                    {
                        id: 4,
                        cn: '大小',
                        en: 'size',
                        ms: 'warna',
                        th: 'สี',
                        custom: '允许'
                    }
                ],
                sortable: null,
                oldList: [],
                newList: []
            }
        },
        components: {
        },
        mounted() {
            this.setSort()
        },
        methods: {
            setSort() {
                const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
                this.sortable = Sortable.create(el, {
                    ghostClass: 'sortable-ghost',
                    setData: function(dataTransfer) {
                        dataTransfer.setData('Text', '')
                    },
                    onEnd: evt => {
                        const targetRow = this.listData.splice(evt.oldIndex, 1)[0]
                        this.listData.splice(evt.newIndex, 0, targetRow)
                        const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
                        this.newList.splice(evt.newIndex, 0, tempIndex)
                        console.log(this.newList)
                    }
                })
            },
            removeAttr(attrId) {
                this.$emit('on-remove', attrId)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
