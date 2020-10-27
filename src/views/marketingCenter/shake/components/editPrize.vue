<template>
    <div class="raffle-operator-wrapper app-container">
        <div class="raffle-operator__header">
            <h5>{{ type === 'add' ? '新建抽奖' : '编辑抽奖'}}</h5>
        </div>
        <div class="raffle-operatore__content">
            <el-form>
                <el-card class="card-common">
                    <div class="title" slot="header">奖池设置</div>
                    <el-form-item label="奖池清单：" class="is-required">
                        <div class="tip">请将用户抽奖可能出现的所有结果（含未中奖的反馈）列举在下方；奖品清单允许修改且每次投放时系统将以最新为准</div>
                        <el-table
                            :data="luckPrizeInfo"
                            :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
                            border
                            v-loading="loading"
                            :style="{width: '90%'}"
                            show-summary
                        >
                            <el-table-column label="奖品ID" align="center" prop="id"></el-table-column>
                            <el-table-column label="奖品名称" align="center">
                                <template slot-scope="scope">
                                    {{ formatItem(scope.row.name) }}
                                </template>
                            </el-table-column>
                            <el-table-column label="奖品类型" align="center">
                                <template slot-scope="scope">
                                    {{ luckPrizeTypeMap[scope.row.type] }}
                                </template>
                            </el-table-column>
                            <el-table-column label="奖品值" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.content }}
                                </template>
                            </el-table-column>
                            <el-table-column label="图片" align="center" min-width="100px">
                                <template slot-scope="scope">
                                    <el-popover placement="top-start" trigger="hover">
                                        <img :src="dealShowFileSrc(formatItem(scope.row.icon))" class="previewImage">
                                        <img :src="dealShowFileSrc(formatItem(scope.row.icon))" class="thumbnail" slot="reference">
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="120px">
                                <template slot-scope="scope">
                                    <i class="el-icon-edit icon mr10" @click="handleEdit(scope.row, scope.$index)"></i>
                                    <i class="el-icon-close icon" @click="handleDelete(scope.row, scope.$index)"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button type="text" @click="handleAdd">再加一种奖品</el-button>
                    </el-form-item>
                </el-card>
            </el-form>
        </div>

        <div class="raffle-operator__footer">
            <el-button type="primary" @click="handleCancel" class="foot-btn">返 回</el-button>
        </div>

        <award-dialog
            :luckPrizeTypeMap="luckPrizeTypeMap"
            v-if="awardShow"
            :dialog-visible="awardShow"
            :awardData="awardData"
            :countryCode="countryCode"
            @close="awardShow = false"
            @save="handlePrizeItemSave"
            :boxId="boxId"
            :awardType="awardType"
        ></award-dialog>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import awardDialog from './/awardDialog'
    import { queryPrize, delPrize } from '@/api/shake.js'

    export default {
        data () {
            return {
                type: '',
                luckPrizeTypeMap: {
                    1: '优惠券',
                    2: '积分',
                    3: '商品'
                },
                luckPrizeInfo: [],
                awardShow: false,
                boxId: null,
                awardType: 'add',
                countryCode: 'MY',
                awardData: {},
                loading: false
            }
        },
        components: {
            awardDialog
        },
        created () {
            let query = this.$route.query || {}
            this.type = query.type
            if (query.id) {
                this.boxId = query.id
                this.getDetail()
            }
            this.countryCode = query.countryCode ? query.countryCode : 'MY'
        },
        computed: {
            ...mapState({
                countryList: state => state.dict.countryList,
                languageList: state => state.dict.languageList
            })
        },
        methods: {
            handleCancel () {
                this.$router.push({
                    name: 'shake',
                    query: {
                        curTab: 'prizeProduct'
                    }
                })
            },
            formatItem (item) {
                let data = JSON.parse(item)
                return data['cn'] ? data['cn'] : data['en']
            },
            handleAdd () {
                this.awardData = {}
                this.awardShow = true
                this.awardType = 'add'
            },
            handleEdit (row) {
                this.awardData = row
                this.awardShow = true
                this.awardType = 'edit'
            },
            // 删除
            handleDelete (data, index) {
                this.$confirm('是否删除该奖品', '提示', {
                    type: 'warning'
                }).then(() => {
                    delPrize({
                        id: data.id
                    }).then((res) => {
                        if (res.ret.errCode === 0) {
                            this.luckPrizeInfo.splice(index, 1)
                        }
                    })
                }).catch(() => {
                    this.$message('已取消删除')
                })
            },
            // 获取奖池内容
            getDetail () {
                this.loading = true
                queryPrize({ boxId: this.boxId }).then(res => {
                    this.loading = false
                    if (res.ret.errCode === 0) {
                        this.luckPrizeInfo = res.data
                    }
                }).catch(() => {
                    this.loading = false
                })
            },
            handlePrizeItemSave () {
                this.awardShow = false
                this.getDetail()
            }
        }
    }
</script>

<style scoped lang="scss">
.raffle-operator-wrapper {
    background-color: #F1F2F5;
    .raffle-operator__header {
        background-color: #fff;
        padding: 8px 32px 16px;
        h5 {
            font-size: 20px;
            font-weight: 500;
        }
    }
    .mt20 {
        margin-top: 20px;
    }
    .mrl16 {
        margin: 6px 16px;
    }
    .special-item {
        padding: 12px 0;
    }
    .raffle-operatore__content {
        margin: 20px;
        .card-common {
            background: #fff;
            border-radius: 6px;
            margin-bottom: 16px;
            padding-bottom: 18px;
            .title {
                border-left: 4px solid #409EFF;
                height: 28px;
                line-height: 28px;
                padding-left: 10px;
            }
            .radio-line {
                display: block;
                line-height: 40px;
            }
            .highLH {
                line-height: 50px;
            }
            .sub-title {
                background: #eee;
                padding: 10px 0 10px 12px;
                width: 94%;
                line-height: 1;
            }
            .icon {
                font-size: 22px;
                color: #409eff;
            }
            .mr10 {
                margin-right: 10px;
            }
            .name-input {
                width: 66%;
                display: inline-block;
            }
        }
        .tip {
            color: #999;
        }
    }
    .raffle-operator__footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        padding: 16px 0;
        text-align: center;
        margin-left: -10px;
        background-color: #fff;
        border-top: 1px solid #eee;
        z-index: 1000;
        .foot-btn {
            padding: 12px 24px;
        }
    }
}
</style>
