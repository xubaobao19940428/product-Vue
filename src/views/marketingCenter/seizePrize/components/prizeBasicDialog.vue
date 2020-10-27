<template>
    <el-dialog
        :visible="prizeBasicShow"
        @close="handleClose"
        class="prize-basic-dialog"
        title="大奖设置"
        width="800px"
    >
        <el-form :model="prizeSetting" ref="prizeBasicForm"
            label-position="right"
            label-width="140px"
            size="mini"
        >
            <el-row :gutter="8">
                <el-col :span="9">
                    <el-form-item label="每期每人可邀老人数：">
                        <el-input-number v-model="prizeSetting.perInviteOldUserNum" :controls="false" :precision="0"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="每期每人可邀新人数：">
                        <el-input-number v-model="prizeSetting.perInviteNewUserNum" :controls="false" :precision="0"></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="8">
                <el-col :span="9">
                    <el-form-item label="邀新用户可获码数：">
                        <el-input-number v-model="prizeSetting.inviteNewUserGetCodeNum" :min="0" controls-position="right" :precision="0"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="邀老用户可获码数：">
                        <el-input-number v-model="prizeSetting.inviteOldUserGetCodeNum" :min="0" controls-position="right" :precision="0"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="未中奖退款：">
                        {{ noGotRefundObj[prizeSetting.superLuckRefundType] }}
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="add-user-box">
            <el-form :model="addUserForm"
                label-position="right"
                :rules="rules"
                label-width="120px"
                size="mini"
                ref="addPrizeUserForm"
            >
                <el-row :gutter="8">
                    <el-col :span="9">
                        <el-form-item label="指定用户中奖：" prop="userId">
                            <el-input v-model="addUserForm.userId" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="可获奖最高值：" prop="maxAmount">
                            {{ currencyUnit }} <el-input-number v-model="addUserForm.maxAmount" :min="1" :precision="0"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" @click="handleAdd" size="mini">添加</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table-title">添加历史</div>
        <el-table border :data="dataList">
            <el-table-column label="用户ID" align="center" prop="userId"></el-table-column>
            <el-table-column label="手机号" align="center" prop="phoneNum"></el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    {{ statusObj[scope.row.status] }}
                </template>
            </el-table-column>
            <el-table-column label="奖品" align="center" prop="productName"></el-table-column>
            <el-table-column label="添加人" align="center" prop="operatorId">
                <template slot-scope="scope">
                    {{ `${scope.row.operatorName}(${scope.row.operatorId})`}}
                </template>
            </el-table-column>
            <el-table-column label="" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleDel(scope.row)" type="primary" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            @current-change="getList"
            @size-change="handleSizeChange"
            :current-page="searchParam.page.pageNum"
            :page-size="searchParam.page.pageSize"
            layout="sizes, total, prev, pager, next, jumper"
            :page-sizes="[5, 10, 15, 20]"
            :total="totals">
        </el-pagination>

        <div class="foot-box" slot="footer">
            <el-button @click="handleClose" size="mini">取消</el-button>
            <el-button @click="handleConfirm" type="primary" size="mini">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { findBigPrizeSetting, findBigPrizeUser, addBigPrizeUser, disableBigPrizeUser } from '@/request/prize'
export default {
    props: {
        prizeBasicShow: Boolean,
        countryCode: String,
        currencyUnit: String
    },
    data () {
        return {
            dataList: [],
            searchParam: {
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                }
            },
            addUserForm: {
                userId: '',
                maxAmount: 1
            },
            rules: {
                userId: [{required: true, message: '必填', trigger: 'change'}]
            },
            prizeSetting: {
                countryCode: this.countryCode,
                perInviteNewUserNum: 3, // 每期可邀新人数
                perInviteOldUserNum: 1, // 每期可邀老人数
                inviteNewUserGetCodeNum: 2, // 邀新可获码数
                inviteOldUserGetCodeNum: 1, // 邀老用户可获得码数
                superLuckRefundType: 1 // 未中奖退款方式 
            },
            totals: 0,
            noGotRefundObj: {
                0: '不使用',
                1: '退积分'
            },
            load: false,
            statusObj: {
                0: '不使用',
                1: '未参与',
                2: '未中奖',
                3: '已中奖'
            }
        }
    },
    created () {
        this.getPrizeDetail()
        this.getList(1)
        Object.assign(this.addUserForm, {
            userId: '',
            maxAmount: 1
        })
    },
    methods: {
        handleClose () {
            this.$emit('close')
            this.$refs['addPrizeUserForm'].clearValidate()
        },
        handleSizeChange (value) {
            this.searchParam.page.pageSize = value
            this.getList(1)
        },
        getPrizeDetail () {
            findBigPrizeSetting({countryCode: this.countryCode}).then(res => {
                if (res.ret.errcode === 1) {
                    if (res.bigPrizeSetting) {
                        Object.assign(this.prizeSetting, res.bigPrizeSetting)
                    }
                }
            })
        },
        getList (pageNum) {
            this.load = true
            this.searchParam.page.pageNum = pageNum || this.searchParam.page.pageNum
            let resParam = {
                countryCode: this.countryCode,
                page: this.searchParam.page
            }

            findBigPrizeUser(resParam).then(res => {
                if (res.ret.errcode === 1) {
                    this.dataList = res.bigPrizeUser
                    this.totals = res.total
                }
                this.load = false
            }).catch(err => {
                this.load = false
            })
        },
        handleConfirm () {
            this.$emit('confirm', { bigPrizeSetting: this.prizeSetting })
        },
        handleDel (item) {
            this.$confirm('此操作会将该用户从中奖用户池中删除, 是否继续？', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                disableBigPrizeUser({
                    countryCode: this.countryCode,
                    userId: item.userId
                }).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('删除用户成功')
                        this.getList()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        handleAdd () {
            this.$refs['addPrizeUserForm'].validate((valid) => {
                if (valid) {
                    let param = JSON.parse(JSON.stringify(this.addUserForm))
                    param.maxAmount += ''
                    addBigPrizeUser({countryCode: this.countryCode, ...param}).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('添加指定用户成功')
                            this.getList(1)
                        }
                    })
                }
            })
        }
    }
}
</script>