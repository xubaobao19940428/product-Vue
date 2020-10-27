<template>
    <el-table :header-cell-style="{background:'#f2f2f2',color:'#606266'}"
              border
              :summary-method="getSummaries"
              show-summary
              :data="pointsInfo.skuPointsInfo">
        <el-table-column label="商品信息" header-align="center">
            <template slot-scope="scope">
                <div class="flex">
                    <el-popover placement="top-start" trigger="hover">
                        <img :src="dealShowFileSrc(scope.row.skuCover)" class="previewImage">
                        <img :src="dealShowFileSrc(scope.row.skuCover)" class="thumbnail" slot="reference">
                    </el-popover>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="规格ID" prop="skuId" align="center"></el-table-column>
        <el-table-column v-for="(item, i) in pointsInfo.title" :key="i">
            <template slot="header">
                <div>{{ item.nickname }}({{ item.userId }})({{ item.currency || '-' }})</div>
                <div>{{ userLevel[item.userLevel] }}{{ item.pointType }}</div>
            </template>
            <template slot-scope="scope">
                {{ scope.row.points[i] }}
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
    export default {
        props: {
            pointsInfo: Object,
            userLevel: Object
        },
        methods: {
            getSummaries (param) {
                const { columns } = param
                const sums = []
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = ''
                    } else if (index === 1) {
                        sums[index] = '小计：'
                    } else {
                        sums[index] = this.pointsInfo.pointsVerticalSum[index - 2] ? this.pointsInfo.pointsVerticalSum[index - 2] : 0
                    }
                })
                return sums
            }
        }
    }
</script>
