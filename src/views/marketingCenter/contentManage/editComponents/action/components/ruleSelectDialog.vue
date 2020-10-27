<template>
    <div class="add-product-dialog">
        <el-dialog
            title="选择角色"
            :visible="showSelectDialog"
            :close-on-click-modal="false"
            @close="handleClose"
        >
            <div class="center mar-b-10">当前已选中：{{ selectData.roleName }}</div>
            <el-table
                :data="ruleData.dataList"
                v-loading="load"
                highlight-current-row
                @current-change="handleSelectionChange"
            >
                <el-table-column type="index" width="55"></el-table-column>
                <el-table-column label="昵称" prop="roleName" align="center" width="170"></el-table-column>
                <el-table-column label="头像" align="center">
                    <template slot-scope="scope">
                        <div class="img-box">
                            <img :src="dealShowFileSrc(scope.row.roleCover)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box">
                <el-pagination @size-change="val => handleSizeChange(val, 'ruleData')"
                               @current-change="getRuleList"
                               :current-page="ruleData.page.pageNum"
                               :page-sizes="[5, 10, 20, 50]"
                               :page-size="ruleData.page.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="ruleData.totals">
                </el-pagination>
            </div>

            <span slot="footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { ShowRole } from '@/request/manage'
    export default {
        props: {
            showSelectDialog: Boolean
        },
        data () {
            return {
                load: false,
                ruleData: {
                    value: '',
                    dataList: [],
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    },
                    totals: 0
                },
                selectData: {
                    roleName: '',
                    roleCover: ''
                }
            }
        },
        computed: {
            countryCode () {
                return this.$route.query.countryCode
            }
        },
        created () {
            this.getRuleList(1)
        },
        methods: {
            reset () {
            },
            handleSizeChange (value, type) {
                Object.assign(this[type].page, {
                    pageSize: value,
                    pageNum: 1
                })
                this.getData(type)
            },
            handleConfirm () {
                if (this.selectData.roleName) {
                    this.$emit('confirm', this.selectData)
                } else {
                    this.$message.error('请先选择对应的项')
                }
            },
            handleSelectionChange (val) {
                this.selectData = val
            },
            getRuleList (page) {
                let temp = { ...this.ruleData }
                this.load = true
                temp.page.pageNum = page || temp.page.pageNum
                ShowRole({
                    pageInfo: temp.page
                }).then((res) => {
                    this.load = false
                    if (res.ret.errcode === 1) {
                        this.ruleData.dataList = res.role
                        this.ruleData.totals = res.total
                    }
                }).catch(() => {
                    this.load = false
                })
            },
            handleClose () {
                this.reset()
                this.$emit('close')
            },
            getData (val) {
                switch (val) {
                    case 'ruleData':
                        this.getRuleList(1)
                        break
                }
            }
        }
    }
</script>

<style lang="scss">
    .add-product-dialog {
        width: 100%;
        .el-dialog{
            width: 80%;
        }
        .activity-input {
            padding: 0 16px 8px;
            margin: 0 auto;
            text-align: center;
        }

        .cr {
            color: #f56c6c;
            margin-top: 8px;
        }
        .center {
            text-align: center;
        }
        .pagination-box {
            padding: 8px 0 16px 0;
        }

        .img-box {
            width: 60px;
            height: 60px;
            display: inline-block;
            img {
                width: 100%;
            }
        }

        .el-table{
            max-height: 100%;
            height: 100%;
            .el-table__header{
                th{
                    background:#F5F7FA;
                    color: #606266;
                }
            }
        }

        .title {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
    }
</style>
