<template>
    <div class="modify-info-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="inventoryForm" :model="inventoryData" :rules="ruleValidate" label-position="right" label-width="90px" style="margin-left:10px">
                <el-form-item label="仓库名称：" prop="warehouse" v-if="type != '1'">
                    <el-select v-model="inventoryData.warehouse" clearable filterable placeholder="请选择仓库" size="medium">
                        <el-option v-for="(val, key) in warehouseList" :key="key" :label="val.warehouseName" :value="val.warehouseNo"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="skuCode：" prop="skuCode">
                    <el-input v-model="inventoryData.skuCode" @blur="getSkuInfo(inventoryData.skuCode)" clearable placeholder="请输入skuCode" size="medium"  style="width:190px"></el-input>
                </el-form-item>
                <el-form-item label="商品名称：" prop="nameCn">
                    {{inventoryData.nameCn}}
                </el-form-item>
                <el-form-item label="sku属性：" prop="standardAttr">
                    {{inventoryData.standardAttr}}
                </el-form-item>
                <el-form-item label="sku图片：" prop="skuCover">
                    <el-image
                        v-if="inventoryData.skuCover != ''"
                        style="width: 100px; height: 100px"
                        :src="dealShowFileSrc(inventoryData.skuCover)"
                        fit="contain">
                    </el-image>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { warehousePage } from '@/request/warehouse'
    import { getSkuInfo, addInventory } from '@/request/inventory'
    export default {
        // 上传异常信息
        name: 'ModifyLogiNoDialog',
        data () {
            return {
                dialogTitle: '新建sku库存',
                inventoryData: {
                    warehouse: '',
                    skuCode: '',
                    nameCn: '',
                    skuCover: '',
                    standardAttr: ''
                },
                ruleValidate: {
                    warehouse: [{
                        required: true,
                        message: '仓库不能为空',
                        trigger: 'change'
                    }],
                    skuCode: [{
                        required: true,
                        message: 'sku不能为空',
                        trigger: 'blur'
                    }]
                },
                warehouseList: []
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: ''
            }
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible
                },
                set: function () {}
            }
        },
        created () {
            this.getWarehouseList()
        },
        methods: {
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
            getSkuInfo (skuCode) {
                let params = {
                    skuCode: skuCode
                }
                getSkuInfo(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        if (res.sku) {
                            this.inventoryData.nameCn = res.sku.nameCn
                            this.inventoryData.skuCover = res.sku.skuCover
                            this.inventoryData.standardAttr = res.sku.standardAttr
                        } else {
                            this.inventoryData.nameCn = ''
                            this.inventoryData.skuCover = ''
                            this.inventoryData.standardAttr = ''
                            this.$message.warning('无匹配的sku信息')
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            cancle () {
                this.$emit('on-cancle')
                this.$refs.inventoryForm.resetFields()
            },
            confirm () {
                this.$refs['inventoryForm'].validate((valid) => {
                    if (valid) {
                        this.$emit('confirm', JSON.parse(JSON.stringify(this.inventoryData)))
                        this.$refs.inventoryForm.resetFields()
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .modify-info-dialog {
        .el-dialog__header {
            border-bottom: 1px solid #ebeef5;
        }
        .el-dialog__body {
            padding: 50px 40px;
        }
        .el-dialog__footer {
            border-top: 1px solid #ebeef5;
        }
        .el-form--inline .el-form-item {
            margin-right: 0;
        }
    }
</style>
