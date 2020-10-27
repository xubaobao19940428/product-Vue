<template>
    <el-dialog
        title="上新"
        :visible.sync="toggle"
        width="50%"
        :before-close="handleClose"
        class="outbound-details">
        <el-table :data="tableData" border class="sku-table">
            <el-table-column label="供应商名称" min-width="120px" align="center">
                <template slot-scope="scope">
                    <div>
                        <div>{{ scope.row.supplierName }}</div>
                        {{scope.row.alibabaId}}
                        <div v-if="scope.row.alibabaId !== ''" class="open-url" @click="urlClick(scope.row.offerId)">{{ `https://detail.1688.com/offer/${scope.row.offerId}.html` }}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="图片" align="center" min-width="100px">
                <template slot-scope="scope">
                    <div class="img-box">
                        <img :src="dealShowFileSrc(scope.row.imageUrl)" class="img"/>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="采购价" align="center" min-width="80px">
                <template slot-scope="scope">
                    <div>{{scope.row.price}}¥</div>
                </template>
            </el-table-column>
            <el-table-column label="供应商信息" align="center" min-width="130px">
                <template slot-scope="scope">
                    <div class="message">
                        <div>货描：{{ (scope.row.goodsDescription * 100).toFixed(2) + '%' || '-' }}</div>
                        <div>响应：{{ (scope.row.response * 100).toFixed(2) + '%' || '-' }}</div>
                        <div>发货：{{ (scope.row.deliverGoods * 100).toFixed(2) + '%' || '-' }}</div>
                        <div>回头率：{{ ((scope.row.rePurchaseRate)*100).toFixed(2) + '%' || '-' }}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" align="center" width="150px">
                <template slot-scope="scope">
                    <el-button type="primary" size="medium" @click="confirm(scope.row)">确认</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-wrapper">
            <el-button v-if="showBtn" type="primary" size="medium" @click="moreSupplier">更多供应商</el-button>
        </div>
        <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
</template>
<script>
    import { ConfirmProduct } from '@/request/product'

    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            list: Array,
            id: Number,
            cateId3: Number
        },
        data () {
            return{
                tableData: [],
                showBtn: false
            }
        },
        created () {
            if (this.list.length > 10) {
                this.showBtn = true
                let arr = this.list.concat([])
                this.tableData = arr.splice(0, 10)
            } else {
                this.showBtn = false
                this.tableData = this.list
            }
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            }
        }, 
        methods: {
            urlClick (id) {
                window.open(`https://detail.1688.com/offer/${id}.html`)
            },
            handleClose () {
                this.$emit('on-cancel')
            },
            confirm (val) {
                let params = {
                    id: this.id,
                    offerId: val.offerId,
                    supplierName: val.supplierName,
                    supplierCreditUrl: val.supplierCreditUrl,
                    cateId: this.cateId3 ? this.cateId3.toString() : ''
                }
                ConfirmProduct(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success("匹配供应商成功！")
                        this.$emit('on-cancel')
                    }
                })
            },
            moreSupplier () {
                this.tableData = this.list
                this.showBtn = false
            }
        }
    }
</script>
<style lang="scss" scoped>
    .img-box{
        display: flex;
        justify-content: center;
    }
    .img{
        width: 80px;
        height: 80px;
    }
    .message{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .page-wrapper{
        display: flex;
        justify-content: center;
    }
    .open-url{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        color: #409EFF;
        text-decoration: underline;
        cursor: pointer;
    }
</style>