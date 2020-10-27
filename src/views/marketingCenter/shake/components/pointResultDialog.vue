<template>
    <el-dialog class="point-result-dialog"
        :visible="pointResultDialog"
        @close="handleClose"
        :close-on-click-modal="false"
        width="740px"
    >
        <el-form :model="param">
            <el-tabs v-model="newUser" type="card">
                <el-tab-pane label="老用户" :name="2">
                    <el-button @click="handleAdd(param.oldDataList)" type="primary" size="medium">新增</el-button>
                    <el-table :data="param.oldDataList">
                        <el-table-column label="邀请人数" fixed="left" width="190px" align="center">
                            <template slot-scope="scope">
                                <div class="config-common">
                                    <el-form-item>
                                        <el-input-number
                                            :controls="false"
                                            :min="0"
                                            :precision="0"
                                            disabled
                                            v-model="scope.row.start"
                                            class="config-common-input"
                                        ></el-input-number>
                                    </el-form-item>
                                    -
                                    <el-form-item>
                                        <el-input-number
                                            :controls="false"
                                            :min="0"
                                            v-model="scope.row.end"
                                            class="config-common-input"
                                            @change="handleEditChange(param.oldDataList, scope.row, scope.$index)"
                                            :precision="0"
                                        ></el-input-number>
                                    </el-form-item>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(item, index) in allBoxList" :key="index" :label="item.name" width="120px" align="center">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <el-input-number
                                        :min="0"
                                        class="config-common-input"
                                        :precision="0" v-model="scope.row.boxJson[item.id]" :controls="false"></el-input-number>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="90px" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    v-if="scope.$index === param.oldDataList.length - 1"
                                    type="text"
                                    @click="handleDel(param.oldDataList, scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button size="medium" type="primary" @click="handleConfirm" :loading="saving">保存老用户配置</el-button>

                </el-tab-pane>
                <el-tab-pane label="新用户" :name="1">
                    <el-button @click="handleAdd(param.newDataList)" type="primary" size="medium">新增</el-button>
                    <el-table :data="param.newDataList">
                        <el-table-column label="邀请人数" width="190px" align="center" fixed="left">
                            <template slot-scope="scope">
                                <div class="config-common">
                                    <el-form-item>
                                        <el-input-number
                                            :controls="false"
                                            :min="0"
                                            :precision="0"
                                            disabled
                                            class="config-common-input"
                                            v-model="scope.row.start"
                                        ></el-input-number>
                                    </el-form-item>
                                    -
                                    <el-form-item>
                                        <el-input-number
                                            :controls="false"
                                            :min="0"
                                            v-model="scope.row.end"
                                            :precision="0"
                                            @change="handleEditChange(param.newDataList, scope.row, scope.$index)"
                                            class="config-common-input"
                                        ></el-input-number>
                                    </el-form-item>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(item, index) in allBoxList" :key="index" :label="item.name" width="120px" align="center">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <el-input-number
                                        class="config-common-input"
                                        :min="0" :precision="0" v-model="scope.row.boxJson[item.id]"
                                        :controls="false"></el-input-number>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" align="center" width="90px">
                            <template slot-scope="scope">
                                <el-button
                                    v-if="scope.$index === param.newDataList.length - 1"
                                    type="text"
                                    @click="handleDel(param.newDataList, scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button size="medium" type="primary" @click="handleConfirm" :loading="saving">保存新用户配置</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-form>

        <div class="footer" slot="footer">
            <el-button size="medium" @click="handleClose">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { queryAllBoxList, queryPointDetail, savePointDetail } from '@/api/shake.js'
export default {
    props: {
        pointResultDialog: Boolean,
        countryCode: String,
        curId: String
    },
    data () {
        return {
            allBoxList: [],
            newUser: 2,
            param: {
                newDataList: [],
                oldDataList: []
            },
            tempBoxJson: 0,
            saving: false
        }
    },
    created () {
        this.getAllBox()
        this.getNewData()
        this.getOldData()
    },
    methods: {
        handleClose () {
            this.$emit('close')
        },
        handleConfirm () {
            let param = {
                newUser: this.newUser,
                integralRuleId: this.curId
            }
            if (this.newUser == 2) {
                let list = JSON.parse(JSON.stringify(this.param.oldDataList))
                for (let i = 0; i < list.length; i++) {
                    let item = list[i]
                    if (!item.end) {
                        this.$message.warning(`第${i + 1}档的邀请人数右边界须大于0`)
                        return
                    }

                    if (item.start >= item.end) {
                        this.$message.warning(`第${i + 1}档的邀请人数右边界须大于左边界`)
                        return
                    }

                    let tempRes = { ...item.boxJson }
                    let keys = Object.keys(tempRes)
                    let curAllKeys = Object.keys(this.tempBoxJson)

                    keys.forEach(boxId => {
                        // 过滤掉当前数组里面没有的
                        if (!tempRes[boxId] && tempRes[boxId] !== 0) {
                            delete tempRes[boxId]
                        } else if (!curAllKeys.includes(boxId)) {
                            delete tempRes[boxId]
                        }
                    })

                    if (curAllKeys.length !== Object.keys(tempRes).length) {
                        this.$message.warning(`第${i + 1}档的箱子数存在为空的情况`)
                        return
                    }

                    item.boxJson = JSON.stringify(tempRes)
                }
                param.dataJson = list
                this.confirmSave(param)
            } else {
                let list = JSON.parse(JSON.stringify(this.param.newDataList))
                for (let i = 0; i < list.length; i++) {
                    let item = list[i]
                    if (!item.end) {
                        this.$message.warning(`第${i + 1}档的邀请人数右边界须大于0`)
                        return
                    }

                    if (item.start >= item.end) {
                        this.$message.warning(`第${i + 1}档的邀请人数右边界须大于左边界`)
                        return
                    }

                    let tempRes = { ...item.boxJson }
                    let keys = Object.keys(tempRes)
                    let curAllKeys = Object.keys(this.tempBoxJson)

                    keys.forEach(boxId => {
                        if (!tempRes[boxId] && tempRes[boxId] !== 0) {
                            delete tempRes[boxId]
                        } else if (!curAllKeys.includes(boxId)) {
                            delete tempRes[boxId]
                        }
                    })

                    if (curAllKeys.length !== Object.keys(tempRes).length) {
                        this.$message.warning(`第${i + 1}档的箱子数存在为空的情况`)
                        return
                    }

                    item.boxJson = JSON.stringify(tempRes)
                }
                param.dataJson = list
                this.confirmSave(param)
            }
        },
        confirmSave (data) {
            this.saving = true
            savePointDetail(data).then(res => {
                if (res.ret.errCode === 0) {
                    this.$message.success('保存成功')
                    if (this.newUser == 2) {
                        this.getOldData()
                    } else {
                        this.getNewData()
                    }
                } else {
                    this.saving = false
                }
            }).catch(() => {
                this.saving = false
            })
        },
        getAllBox () {
            queryAllBoxList({countryCode: this.countryCode}).then(res => {
                if (res.ret.errCode === 0) {
                    this.allBoxList = res.data
                    let tempBoxJson = {}
                    res.data.forEach(item => {
                        tempBoxJson[item.id] = 0
                    })

                    this.tempBoxJson = tempBoxJson
                }
            })
        },
        handleDel (list, index) {
            this.$confirm('确认删除该条设置吗？', '提示')
                .then(() => {
                    list.splice(index, 1)
                })
                .catch(() => {})
        },
        handleAdd (list) {
            let len = list.length
            let param = {
                start: len ? list[len - 1].end : 0,
                end: 0,
                boxJson: JSON.parse(JSON.stringify(this.tempBoxJson))
            }

            list.push(param)
        },
        handleEditChange (list, item, index) {
            if (index + 1 >= list.length) return

            let tempItem = Object.assign(list[index + 1], { start: item.end })
            list.splice(index + 1, 1, tempItem)
        },
        getNewData () {
            queryPointDetail({integralRuleId: this.curId, newUser: 1}).then(res => {
                this.saving = false
                if (res.ret.errCode === 0) {
                    let list = []
                    if (res.data && res.data.length) {
                        list = res.data.map(item => {
                            item.boxJson = JSON.parse(item.boxJson)
                            return item
                        })
                    }

                    Object.assign(this.param, {newDataList: list})
                }
            }).catch(() => {
                this.saving = false
            })
        },
        getOldData () {
            queryPointDetail({integralRuleId: this.curId, newUser: 2}).then(res => {
                this.saving = false
                if (res.ret.errCode === 0) {
                    let list = []
                    if (res.data && res.data.length) {
                        list = res.data.map(item => {
                            item.boxJson = JSON.parse(item.boxJson)
                            return item
                        })
                    }

                    Object.assign(this.param, {oldDataList: list})
                }
            }).catch(() => {
                this.saving = false
            })
        }
    }
}
</script>

<style scoped lang="scss">
.point-result-dialog {
    .config-common {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 4px;
    }
    .tip {
        color: #e71f19;
        font-size: 14px;
        padding: 4px 0 8px 0;
    }
    .config-common-input {
        width: 100%;
    }
}
</style>
