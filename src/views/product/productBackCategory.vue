<template>
  <div class="app-container">
    <tree-table
      :categoryType="categoryType">
    </tree-table>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'

export default {
    name: 'productBackCategory',
    components: {
        treeTable
    },
    data () {
        return {
            categoryType: 2
        }
    },
    methods: {}
}
</script>
<style>
</style>
