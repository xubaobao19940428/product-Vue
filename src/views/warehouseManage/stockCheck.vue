<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form ref="stockCheckFilterForm" inline label-width="100px" :model="queryData">
                <el-form-item prop="warehouseNo" label="仓库：" class="filter-item">
                    <el-select v-model="queryData.warehouseNo" clearable size="medium" placeholder="请选择仓库">
                        <el-option v-for="(val, key) in warehouseList" :key="key" :label="val.warehouseName" :value="val.warehouseNo"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="skuCode" label="skuCode：" class="filter-item">
                    <el-input v-model="queryData.skuCode" placeholder="请输入skuCode" size="medium" @keyup.enter.native="search()"></el-input>
                </el-form-item>
                <span v-show="drop">
                    <el-form-item label="在库库存：" class="filter-item">
                        <div>
                            <el-input v-model="queryData.startInstockQty" type="number" style="width: 100px" size="medium" min=0 ></el-input>
                            -
                            <el-input v-model="queryData.endInstockQty" type="number" style="width: 100px" size="medium" @blur="checkNum(queryData.endInstockQty)" ></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="备货库存：" class="filter-item">
                        <div>
                            <el-input v-model="queryData.startReserveQty" type="number" style="width: 100px" size="medium" min=0 @blur="checkNum(queryData.startReserveQty)"></el-input>
                            -
                            <el-input v-model="queryData.endReserveQty" type="number" style="width: 100px" size="medium" @blur="checkNum(queryData.endReserveQty)"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="待出库库存：" class="filter-item">
                        <div>
                            <el-input v-model="queryData.startBookedQty" type="number" style="width: 100px" size="medium" min=0 @blur="checkNum(queryData.startBookedQty)"></el-input>
                            -
                            <el-input v-model="queryData.endBookedQty" type="number" style="width: 100px" size="medium" @blur="checkNum(queryData.endBookedQty)"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="可售库存：" class="filter-item">
                        <div>
                            <el-input v-model="queryData.startAvailableQty" type="number" style="width: 100px" size="medium" min=0 ></el-input>
                            -
                            <el-input v-model="queryData.endAvailableQty" type="number" style="width: 100px" size="medium" ></el-input>
                        </div>
                    </el-form-item>
                </span>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <el-button v-if="hasPermission('BTN_NEW_SKU_INVENTORY')" type="primary" plain size="medium" icon="el-icon-plus" @click="addSkuInventory">新建sku库存</el-button>
                    <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </el-link>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="dataList" border v-loading="loading" height="100%" style="width: 100%">
                <el-table-column label="skuCode" fixed="left" align="center" min-width="130px" prop="skuCode">
                </el-table-column>
                <el-table-column label="商品名称" prop="nameCn" align="center" min-width="180px">
                </el-table-column>
                <el-table-column label="商品图片" min-width="120px">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" trigger="hover">
                            <img :src="dealShowFileSrc(scope.row.skuCover)" class="previewImage">
                            <img :src="dealShowFileSrc(scope.row.skuCover)" class="thumbnail" slot="reference">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="SKU信息" prop="standardAttr" align="center" min-width="100px">
                </el-table-column>
                <el-table-column label="仓库名称" prop="warehouseName" align="center" min-width="100px"> </el-table-column>
                <el-table-column label="可售库存" prop="availableQty" align="center" width="80px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.availableQty || '0'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="在库库存" prop="inStockQty" align="center" width="80px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.inStockQty || '0'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="备货库存" prop="reserveQty" align="center" width="80px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.reserveQty || '0'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="待出库库存" prop="bookedQty" align="center" width="100px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.bookedQty || '0'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="商家库存" prop="qtyType" align="center" width="80px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.supplierQty}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="可分配库存" prop="qtyType" align="center" width="100px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.canMatchQty}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="已占用库存" prop="qtyType" align="center" width="100px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.occuptQty}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="销售方式" prop="saleWay" align="center" width="80px">
                    <template slot-scope="scope">
                        <span v-if=" scope.row.saleWay === 1">售完即止</span>
                        <span v-if=" scope.row.saleWay === 2">边售边采</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center"  min-width="100px">
                    <template slot-scope="scope">
                        <div class="order-btn-box">
                            <el-button plain type="primary" size="mini" v-preventReClick="500" v-if="hasPermission('BTN_INVENTORY_MODIFICATION')" @click="showChangeStock(scope.row)">
                                库存修改
                            </el-button>
                            <el-button plain type="primary" size="mini" v-preventReClick="500" v-if="hasPermission('BTN_INVENTORY_MANAGEMENT')" @click="clickToFlowJump(scope.row)">
                                流水记录
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="queryData.page.pageNum"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog title="库存修改" width="700px" :visible.sync="stock.show" @close="clickToCancelStock" ref="stock" :close-on-click-modal="false">
            <el-form label-width="100px" :model="stock.param" :rules="stock.rules">
                <el-form-item >
                    <div class="logistics-info-wrapper">
                        <el-form-item label="商品编码：" class="filter-item">
                           <span>{{stock.param.skuCode}}</span>
                        </el-form-item>
                        <el-form-item label="仓库名称：" class="filter-item">
                           <span>{{stock.param.warehouseName}}</span>
                        </el-form-item>
                        <el-form-item label="库存类型：" class="filter-item">
                            <el-select v-model="stock.param.qtyType" disabled filterable clearable
                                       style="width: 228px"
                                       size="medium">
                                  <el-option v-for="(val, key) in inventoryTypeList" :key="key" :label="val" :value="key">
                                  </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="修改前库存：">
                            <el-input v-if="stock.param.qtyType==''" type="number" :disabled="true" style="width: 40%;" size="medium"></el-input>
                            <el-input v-model="stock.param.inStockQty" v-else-if="stock.param.qtyType=='1'" type="number" :disabled="true" style="width: 40%;" size="medium"></el-input>
                            <el-input v-else v-model="stock.param.reserveQty" type="number" :disabled="true" style="width: 40%;" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="调整库存：">
                            <el-select v-model="stock.param.dataType" filterable clearable style="width: 110px" size="medium" placeholder="增减选择">
                                <el-option v-for="(val, key) in incDecList" :key="key" :label="val" :value="key"></el-option>
                            </el-select>
                            <el-input v-model="stock.param.stock" style="width: 118px" size="medium" type="number" @blur="stockCheckNum(stock.param.stock)"></el-input>
                        </el-form-item>
                        <el-form-item label="备注：">
                            <el-input v-model="stock.param.remark" @change="stockCheckremark(stock.param.remark)"
                                      placeholder="请输入备注" type="textarea" :rows="3" style="width: 300px" :maxlength="300" size="medium">
                            </el-input>
                        </el-form-item>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clickToCancelStock()" size="small">取 消</el-button>
                <el-button type="primary" @click="clickToChangestock()" size="small" :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新建sku库存 -->
        <add-sku-inventory-dialog :dialogVisible="addInventoryDialogVisible" @on-cancle="handleOnCancle" @confirm="handleOnConfirm"></add-sku-inventory-dialog>
    </div>
</template>

<script>
    import { warehousePage } from '@/request/warehouse'
    import { inventoryPage, AdminUpdateInventory, addInventory } from '@/request/inventory'
    import AddSkuInventoryDialog from './components/AddSkuInventoryDialog'
    export default {
        components: {
            AddSkuInventoryDialog
        },
        data () {
            return {
                btnLoading:false,
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                queryData: {
                    warehouseNo: '',
                    skuCode: '',
                    startInstockQty: null,
                    endInstockQty: null,
                    startReserveQty: null,
                    endReserveQty: null,
                    startBookedQty: null,
                    endBookedQty: null,
                    startAvailableQty: null,
                    endAvailableQty: null,
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }
                },
                addInventoryDialogVisible: false,
                loading: false,
                total: 0,
                inventoryTypeList: {
                    '1': '在库库存'
                    // '2': '在途库存'
                },
                incDecList: {
                    1: '增加',
                    2: '减少'
                },
                load: false,
                productNatureList: {
                    '1': '普货',
                    '2': '敏感货'
                },
                searchStatus: {
                    '0': '全部',
                    '1': '入库',
                    '2': '出库'
                },
                incomeStatus: {
                    '1': '全部',
                    '2': '采购入库',
                    '3': '手工入库',
                    '4': '盘盈',
                    '5': '发货出库',
                    '6': '手工出库',
                    '7': '盘亏'
                },
                signStatus: {
                    '0': '未签收',
                    '1': '补充单',
                    '-1': '补充单'
                },

                timeList: [],
                dataList: [],
                tranlist: [],
                warehouseList: [],
                stock: {
                    show: false,
                    param: {
                        remark: '',
                        dataType: '',
                        stock: '',
                        warehouseName: '',
                        skuCode: '',
                        qtyType: '',
                        endBookedQty: '',
                        endInstockQty: '',
                        endReserveQty: '',
                        pageNum: '',
                        reserveQty: '',
                        inStockQty: '',
                        bookedQty: '',
                        availableQty: '',
                        pageSize: '',
                        pagingSwitch: false,
                        productNature: '',
                        startBookedQty: '',
                        startInstockQty: '',
                        startReserveQty: '',
                        startAvailableQty: '',
                        endAvailableQty: '',
                        warehouseNo: ''
                    },
                    rules: {
                        reserveQty: [{
                            required: true,
                            message: '请输入修改后的备货库存',
                            trigger: 'change'
                        }],
                        inStockQty: [{
                            required: true,
                            message: '请输入修改后的在库库存',
                            trigger: 'change'
                        }]
                    }
                }
            }
        },
        created () {
            this.getWarehouseList()
        },
        mounted () {
            this.getInventoryPageList()
        },
        methods: {
            // 流水跳转
            clickToFlowJump (value) {
                this.$router.push({
                    name: 'inventoryFlow',
                    params: {
                        skuCode: value.skuCode,
                        warehouseNo: value.warehouseNo,
                        activeName: 'platform'
                    }
                })
            },
            dropDown () {
                if (this.drop) {
                    this.dropDownContent = '展开'
                    this.dropDownIcon = 'el-icon-arrow-down'
                } else {
                    this.dropDownContent = '收起'
                    this.dropDownIcon = 'el-icon-arrow-up'
                }
                this.drop = !this.drop
            },
            /**
             * 获取仓库列表
            */
            getWarehouseList () {
                let params = {
                    page: {
                        pageSize: 100,
                        pageNum: 1
                    }
                }
                warehousePage(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.warehouseList = res.list
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            getInventoryPageList () {
                this.loading = true
                let params = this.queryData
                params.startInstockQty = parseInt(params.startInstockQty)
                params.endInstockQty = parseInt(params.endInstockQty)
                params.startReserveQty = parseInt(params.startReserveQty)
                params.endReserveQty = parseInt(params.endReserveQty)
                params.startBookedQty = parseInt(params.startBookedQty)
                params.endBookedQty = parseInt(params.endBookedQty)
                params.startAvailableQty = parseInt(params.startAvailableQty)
                params.endAvailableQty = parseInt(params.endAvailableQty)
                inventoryPage(this.filterData(params)).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.dataList = res.list
                        this.total = res.total
                    }
                }).catch(err => {
                    this.loading = false
                    console.log(err)
                })
            },
            // 分页
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getInventoryPageList()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val
                this.getInventoryPageList()
            },
            search () {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.getInventoryPageList()
            },
            resetSearch () {
                this.$refs.stockCheckFilterForm.resetFields()
                this.queryData.startInstockQty = null
                this.queryData.endInstockQty = null
                this.queryData.startReserveQty = null
                this.queryData.endReserveQty = null
                this.queryData.startBookedQty = null
                this.queryData.endBookedQty = null
                this.queryData.startAvailableQty = null
                this.queryData.endAvailableQty = null
                this.getInventoryPageList()
            },
            // 限制输入格式
            stockCheckNum (data) {
                if (data < 0 || data == '') {
                    this.$alert('调整库存不能为小于零或为空')
                    this.stock.param.stock = ''
                }
            },
            // 输入备注不能为空
            stockCheckremark (data) {
                if (data == '') {
                    this.$alert('输入备注不能为空')
                }
            },
            clickToCancelStock () {
                this.btnLoading = false
                this.stock.show = false,
                this.stock.param.qtyType = '',
                this.stock.param.remark = '',
                this.stock.param.stock = '',
                this.stock.param.dataType = ''
            },
            // 限制输入格式
            checkNum (data) {
                if (data < 0) {
                    this.$alert('输入格式错误不可输入负数')
                    this.stock.param.endBookedQty = '',
                    this.stock.param.endInstockQty = '',
                    this.stock.param.endReserveQty = '',
                    this.stock.param.startBookedQty = '',
                    this.stock.param.startInstockQty = '',
                    this.stock.param.startReserveQty = '',
                    this.stock.param.startAvailableQty = '',
                    this.stock.param.endAvailableQty = ''
                }
            },
            showChangeStock (data) {
                this.stock.param.qtyType = '1',
                this.stock.param.skuCode = data.skuCode
                this.stock.param.warehouseName = data.warehouseName
                this.stock.param.warehouseNo = data.warehouseNo
                this.stock.param.reserveQty = parseInt(data.reserveQty)
                this.stock.param.inStockQty = parseInt(data.inStockQty)
                this.stock.param.bookedQty = parseInt(data.bookedQty)
                this.stock.param.availableQty = parseInt(data.availableQty)
                this.stock.show = true
            },
            async clickToChangestock () {
                if(this.stock.param.remark == ''){
                    this.$alert('输入备注不能为空')
                }else if (this.stock.param.dataType == '' || this.stock.param.qtyType == '' || this.stock.param.remark == '' || this.stock.param.stock == '') {
                    this.$alert('输入不可为空')
                } else if (this.stock.param.dataType < 1) {
                    this.$alert('输入不可为负数')
                    this.stock.param.stock = ''
                }else {
                    this.btnLoading = true
                    await this.modifyInventory({
                        operType: parseInt(this.stock.param.dataType),
                        remark: this.stock.param.remark,
                        warehouseNo: this.stock.param.warehouseNo,
                        skuCode: this.stock.param.skuCode,
                        qty: parseInt(this.stock.param.stock)
                    })
                }
            },
            modifyInventory (params) {
                this.loading = true
                console.log(this.stock.param.dataType)

                AdminUpdateInventory(this.filterData(params)).then(res => {
                    console.log(res)
                    this.loading = false
                    this.btnLoading = false
                    if (res.ret.errcode === 1) {
                        if (this.stock.param.dataType == 2) {
                            this.$message.success(`修改成功数量：${res.qty}!`)
                        }
                        this.$message.success('库存修改成功！')
                        this.getInventoryPageList()
                        this.stock.show = false
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch(err => {
                    this.loading = false
                    this.btnLoading = false
                    console.log(err)
                })
            },
            addSkuInventory () {
                this.addInventoryDialogVisible = true
            },
            handleOnCancle () {
                this.addInventoryDialogVisible = false
            },
            handleOnConfirm (data) {
                console.log(111)
                console.log(data)
                this.loading = true
                this.addInventoryDialogVisible = false
                let params = {
                    warehouseNo: data.warehouse,
                    skuCode: data.skuCode
                }
                addInventory(params).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.$message.success('sku库存新建成功！')
                        this.getInventoryPageList()
                    }
                }).catch(err => {
                    this.loading = false
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss">
    .el-tooltip__popper {
        max-width: 200px;
    }
</style>

<style lang="scss" scoped>
    .el-icon-circle-close {
        margin: 13px;
    }

    .order-btn-box {
        display: flex;
        flex-direction: column;
        .el-button+.el-button {
            margin-left: 0;
        }
        .el-button {
            margin-bottom: 10px;
        }
    }

    .product-info-wrapper {
        .product-info-item {
            align-items: center;
            position: relative;
            .delete-box {
                width: 100px;
                i {
                    margin-left: 10px;
                    cursor: pointer;
                }
            }
        }
        .el-input {
            flex: 1;
        }
    }

</style>
