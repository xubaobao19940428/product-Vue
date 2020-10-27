<template>
  <div class="pagination-container">
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="page"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
  </div>
</template>

<script>
// import list from '@/mixins/List'

export default {
    name: 'listPagination',
    props: {
        total: {
            type: Number,
            default: 0
        },
        page: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 5
        },
        handleSizeChange: {
            type: Function,
            default: () => {}
        },
        handleCurrentChange: {
            type: Function,
            default: () => {}
        }
    }
    // mixins: [list]
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
</style>
