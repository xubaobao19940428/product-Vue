<template>
    <div class="product-list-setting-dialog">
        <el-dialog :title="title" :visible.sync="toggle" width="750px" top="10vh" :close-on-click-modal="false" @close="cancle">
            <el-form ref="listSettingForm"  :model="settingModel"  :rules="ruleValidate" label-width="100px">
                <el-form-item label="选择国家：" prop="checkedCountry">
                    <el-checkbox-group v-model="settingModel.checkedCountry" :min="1">
                        <el-checkbox v-for="country in countryList" :label="country.shortCode" :key="country.shortCode">{{country.nameLocal}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="选择字段：" prop="checkedItem">
                    <el-checkbox-group v-model="settingModel.checkedItem">
                        <el-checkbox v-for="item in itemList" :label="item.lable" :key="item.value" :disabled="item.disabled">{{item.lable}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="comfirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        // 商品列表设置
        name: 'ProductListSetting',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            setting: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                title: '列表设置',
                itemList: [
                    {
                        lable: '商品ID',
                        value: 'productId',
                        minWidth: 180,
                        disabled: true
                    },
                    {
                        lable: '商品信息',
                        value: 'title',
                        minWidth: 250,
                        disabled: true

                    }, {
                        lable: '原始链接',
                        value: 'orgUrl',
                        minWidth: 180,
                        disabled: false
                    }, {
                        lable: '后台类目',
                        value: 'backCategory',
                        minWidth: 180,
                        disabled: false
                    }, {
                        lable: '前台类目',
                        value: 'frontCategory',
                        minWidth: 180,
                        disabled: false
                    }, {
                        lable: '销售国家',
                        value: 'saleCountry',
                        minWidth: 80,
                        disabled: false
                    }, {
                        lable: '上架状态',
                        value: 'shelveStatus',
                        minWidth: 80,
                        disabled: false
                    }, {
                        lable: '划线价',
                        value: 'price',
                        minWidth: 80,
                        disabled: false
                    }, {
                        lable: 'VIP价',
                        value: 'priceVip',
                        minWidth: 80,
                        disabled: false
                    }, {
                        lable: '佣金率',
                        value: 'commission',
                        minWidth: 80,
                        disabled: false
                    }, {
                        lable: '累计销量',
                        value: 'sales',
                        minWidth: 80,
                        disabled: false
                    }, {
                        lable: '品牌',
                        value: 'brand',
                        minWidth: 150,
                        disabled: false
                    }, {
                        lable: '供应商',
                        value: 'supplier',
                        minWidth: 150,
                        disabled: false
                    }, {
                        lable: '创建时间',
                        value: 'createTime',
                        minWidth: 130,
                        disabled: false
                    }, {
                        lable: '更新时间',
                        value: 'updateTime',
                        minWidth: 130,
                        disabled: false
                    }
                ],
                settingModel: this.setting,

                ruleValidate: {
                    checkedCountry: [{
                        required: true,
                        message: '请选择国家',
                        trigger: 'change'
                    }],
                    checkedItem: [{
                        required: true,
                        message: '请选择字段',
                        trigger: 'change'
                    }]
                }

            }
        },
        components: {
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {
                }
            },
            countryList() {
                return this.$store.state.dict.countryList
            }
        },
        mounted() {
        },
        methods: {
            cancle() {
                console.log('cancle')
                this.$emit('on-cancle')
            },
            comfirm() {
                console.log(this.settingModel)
                this.$emit('on-confirm', this.settingModel)
            }
        }
    }
</script>

<style lang="scss">
.product-list-setting-dialog {
    .el-select .el-input {
        width: 400px;
    }
    .el-input ,.el-textarea{
        width: 400px;
    }
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
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #409EFF!important;
}
</style>
