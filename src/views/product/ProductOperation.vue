<template>
    <div class="app-container">
        <div class="operation-card-list">
            <el-row :gutter="20" class="card-row">
                <el-col :span="8">
                    <div class="card-wrapper" @click="jumpTo('salesManage')">
                        <el-card class="box-card">
                            <h2><img src="./img/sale.png">销量管理</h2>
                            <p>查看、控制商品在APP端呈现的销量数据</p>
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="card-wrapper" @click="jumpTo('frontCategory')">
                        <el-card class="box-card">
                            <h2><img src="./img/category.png">前台类目</h2>
                            <p>管理APP前台类目</p>
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="card-wrapper" @click="jumpTo('productCategorySort')">
                        <el-card class="box-card">
                            <h2><img src="./img/sort.png">分类排序</h2>
                            <p>查看、控制APP类目列表中，各个商品的展示顺序</p>
                        </el-card>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <!-- <el-col :span="8">
                    <div class="card-wrapper">
                        <el-card class="box-card">
                            <h2><img src="./img/weight.png">权重控制</h2>
                            <p>控制商品搜索、商品推荐业务中的相关权重</p>
                        </el-card>
                    </div>
                </el-col> -->
                <el-col :span="8">
                    <div  class="card-wrapper" @click="jumpTo('wordsManage')">
                        <el-card class="box-card">
                            <h2><img src="./img/dict.png">词库管理</h2>
                            <p>管理商品标题/属性中的敏感词；维护能够提升商品搜索丰富度的的同义词</p>
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="card-wrapper"  @click="jumpTo('sameProduct')">
                        <el-card class="box-card">
                            <h2><img src="./img/same.png">同款商品</h2>
                            <p>输入1688商品链接，系统自动为你寻找同款价更优的商品</p>
                        </el-card>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        // 商品运营
        name: 'productOperation',
        data() {
            return {

            }
        },
        components: {
        },
        computed: {

        },
        methods: {
            jumpTo(val) {
                console.log(val)
                this.$router.push({
                    path: '/product/' + val
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .operation-card-list {
        padding: 50px;
        min-width: 1100px;
        .card-row {
            margin-bottom: 20px;
        }
        .card-wrapper {
            cursor: pointer;
        }
        .box-card {
            height: 180px;
            h2 {
                font-size: 20px;
                font-weight: 600;
                img {
                    display: inline-block;
                    vertical-align: middle;
                    width: 28px;
                    margin-right: 6px;
                }
            }
            p {
                color: #333;
                margin-top: 10px;
                padding-left: 36px;
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
            }
        }
    }

</style>

