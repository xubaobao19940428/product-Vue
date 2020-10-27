<template>
    <div class="hot-sale-product">
       <table border="1" class="product-table">
            <tr class="table-header">
                <th class="name">
                    <span>商品名称</span>
                </th>
                <th class="cate">一级类目</th>
                <th class="num">售出件数</th>
                <th class="gmv">GMV($)</th>
            </tr>
            <tr v-for="(item, index) in tableData" :key="index" class="product-item">
                <td class="name">
                    <span>{{item.productName}}</span>
                </td>
                <td class="cate">{{item.cateOneName}}</td>
                <td class="num">{{item.salesNum}}</td>
                <td class="gmv">{{item.gmv}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        props: {
            tableData: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data () {
            return {
                // tableData: [],
            }
        },
        methods: {

        },
        mounted: function () {

        }
    }
</script>

<style lang="scss" scoped>

    .hot-sale-product {
        font-size: .15rem;
        box-sizing: border-box;
        text-align: center;
        padding:0.125rem 0 .145rem;
        flex: 1;
        .product-table {
            border: 1px solid #0b2a50;
            width:100%;
            tr {
                border:1px solid #0b2a50;
                width: 100%;
                height: 0.40rem;
                line-height: 0.40rem;
            }
            th{
                height: 0.6rem;
                line-height: 0.6rem;
            }
            .product-item {
                height: .24rem;
            }
            .name {
                flex: 1;
                box-sizing: border-box;
                padding: 0.1rem;
                overflow: hidden;
                height: 100%;
                span{
                    width: 100%;
                    font-size: 0.14rem;
                    line-height: 0.20rem;
                    box-sizing: border-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    overflow:hidden;
                    /*! autoprefixer: off */
                    -webkit-box-orient: vertical;
                }

            }
            .table-header{
                .name{
                    padding: 0;
                    height: 100%;
                    span{
                        line-height: 0.6rem;
                        text-align: center;
                    }
                }
            }
            .cate {
                width: 20%;
                border-left: 1px;
                border-right: 1px;
                height:0.6rem;
                border-color: #0e386c;
                border-style: solid;
                vertical-align: middle;
                white-space: nowrap;
            }
            .num {
                width: 20%;
                height:0.6rem;
                border-right: 1px;
                border-color: #0e386c;
                border-style: solid;
                vertical-align: middle;
                white-space: nowrap;
            }
            .gmv {
                height:0.6rem;
                width: 20%;
                border-left: 1px;
                border-color: #0e386c;
                border-style: solid;
                vertical-align: middle;
                white-space: nowrap;
            }
        }
    }
</style>
