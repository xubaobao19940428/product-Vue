<template>
    <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
            <el-tab-pane v-for="(item, index) in countryList" :key="index" :label="item.nameLocal" :name="item.shortCode">
                
            </el-tab-pane>
            <category-tree  :ref="'categoryTree'" :countryCode="activeName"></category-tree>
        </el-tabs>
    </div>
</template>

<script>
    import CategoryTree from './components/CategoryTree'
    export default {
        // 前台类目
        name: 'FrontCategory',
        data() {
            return {
                countryList: [],
                activeName: 'MY',
                countryCode: 'MY',
                activeCountry: '马来西亚',
            }
        },
        components: {
            CategoryTree
        },
        created() {
            this.countryList = JSON.parse(this.getStore('countryList'))
        },
        methods: {
            handleTabClick(data) {
                this.activeName = data.name
            }
        }
    }
</script>
