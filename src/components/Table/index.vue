<template>
  <div class="list-container">
    <el-table border :data="data" max-height="600" :header-cell-style="{background:'#F5F7FA',color:'#606266'}" >
      <slot name="columns"></slot>
    </el-table>
  </div>
</template>

<script>

export default {
    name: 'list',
    props: {
        data: {
            type: Array,
            default: () => {
                return []
            }
        }
    }
}
</script>

<style scoped>

</style>
