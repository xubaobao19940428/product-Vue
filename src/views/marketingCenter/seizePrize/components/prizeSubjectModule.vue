<template>
    <div class="prize-subject-module-wrapper">
        <!-- <div class="prize-subject-module">
            <div class="left">所属专题：</div>
            <div class="center">
                <span v-for="(item, index) in subjectList" :key="index" class="subject-item" :class="{active : active === item.serialId}" @click="selectItem(item)">
                    {{item.cnName}}
                    <i class="el-icon-close" v-if="active === item.serialId" @click="removeSubject(item)"></i>
                </span>
            </div>
            <div class="right">
                <el-button icon="el-icon-plus" type="primary" size="medium" @click="addSubject">添加专题</el-button>
            </div>
        </div> -->
        <div style="height: 36px;">
            <el-button icon="el-icon-plus" type="primary" size="medium" @click="addPruduct" v-if="hasPermission('BTN_SEIZE_PRIZE_PRODUCT_ADD')">添加大奖商品</el-button>
            <el-button icon="el-icon-edit" type="primary" size="medium" @click="handlePrizeBasic" v-if="hasPermission('BTN_SEIZE_PRIZE_EDIT')">大奖设置</el-button>
            <el-button icon="el-icon-setting" type="primary" size="medium" @click="handleProductSet" v-if="hasPermission('BTN_SEIZE_PRIZE_PRODUCT_SET')">商品设置</el-button>
        </div>
        <!-- 商品选择，添加  -->
        <product-select v-if="productSelectVisible" ref="productSelect" :dialogVisible="productSelectVisible" :countryCode="countryCode" @confirm="confirmAddProduct" @close="handleClose"></product-select>
        <!-- 专题设置 -->
        <!-- <change-subject-dialog 
            :subjectDialogShow="subjectDialogShow"
            :isEdit="isEdit"
            @confirm="subjectConfirm"
            @cancle="subjectCancle"
        ></change-subject-dialog> -->

        <!-- 大奖基本设置 -->
        <prize-basic-dialog v-if="prizeBasicShow" :prizeBasicShow="prizeBasicShow" :countryCode="countryCode" @close="prizeBasicShow = false" @confirm="handleBasicConfirm" :currencyUnit="currencyUnit"></prize-basic-dialog>

        <!-- 商品设置 -->
        <product-set-dialog
            v-if="productSetShow"
            :productSetShow="productSetShow"
            :countryCode="countryCode"
            :currencyUnit="currencyUnit"
            :propParam="propParam"
            @close="productSetShow = false"
            @confirm="handleProductSetConfirm"
        ></product-set-dialog>
    </div>
</template>

<script>
import ProductSelect from '../../productSelect/index'
import prizeBasicDialog from './prizeBasicDialog'
import { saveBigPrizeSetting, batchAddSuperLuckProduct, queryProductCommonSet, addProductCommonSet } from '@/request/prize'
import productSetDialog from './productSetDialog'

// import changeSubjectDialog from './changeSubjectDialog'

export default {
    name: 'PrizeSubjectModule',
    props: {
        countryCode: {
            type: String,
            default: ''
        },
        currencyUnit: String
    },
    components: {
        ProductSelect,
        prizeBasicDialog,
        productSetDialog
        // changeSubjectDialog
    },
    data () {
        return {
            productSelectVisible: false,
            isEdit: false,
            subjectDialogShow: false,
            prizeBasicShow: false,
            active: '',
            productSetShow: false,
            propParam: {}
        }
    },
    methods: {
        handleProductSetConfirm (data) {
            addProductCommonSet(data).then(res => {
                if (res.ret.errcode === 1) {
                    this.productSetShow = false
                    this.$message.success('保存商品通用设置成功')
                }
            })
        },
        getAllSubjects () {
            // 获取所有的专题列表
        },
        confirmAddProduct(products) {
            console.log(products)
            this.productSelectVisible = false
            let params = {
                countryCode: this.countryCode,
                productId: products
            }
            batchAddSuperLuckProduct(this.filterData(params)).then(res => {
                if (res.ret.errcode === 1) {
                    this.$message.success('大奖商品添加成功')
                    this.$emit('refresh')
                    this.prizeBasicShow = false
                }
            })
        },
        handleClose () {
            this.productSelectVisible = false
        },
        handleBasicConfirm (data) {
            saveBigPrizeSetting(this.filterData(data)).then(res => {
                if (res.ret.errcode === 1) {
                    this.$message.success('保存成功')
                    this.prizeBasicShow = false
                }
            })
        },
        addPruduct() {
            this.productSelectVisible = true
            // this.$refs['productSelect'].getList()
        },
        // 编辑专题
        handleEdit () {
            this.isEdit = true
            this.editDialogVisible = true
        },
        // 新增专题
        handleAdd () {
            this.isEdit = false
            this.editDialogVisible = true
        },
        // 取消保存专题
        subjectCancle () {
            this.subjectDialogShow = false
        },
        // 保存专题
        subjectConfirm () {

        },
        selectItem (item) {
            this.active = item.serialId
            this.$emit('select', item)
        },
        handlePrizeBasic () {
            this.prizeBasicShow = true
        },
        handleProductSet () {
            queryProductCommonSet({
                countryCode: this.countryCode
            }).then(res => {
                if (res.ret.errcode === 1) {
                    Object.assign(this.propParam, {
                        endTime: res.endTime,
                        activePrice: res.activePrice || 0,
                        startTime: res.startTime,
                        invitationOld: res.invitationOld,
                        invitationNew: res.invitationNew
                    })
                    console.log(this.propParam)
                    this.productSetShow = true
                }
            })
        },
        removeSubject (item) {
            this.$confirm('删除后将无法恢复，是否继续？', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 删除接口
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        }
    }
}
</script>

<style scoped lang="scss">
.prize-subject-module-wrapper {
    margin-bottom: 10px;
}
</style>