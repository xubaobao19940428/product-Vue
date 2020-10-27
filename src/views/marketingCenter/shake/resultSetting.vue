<template>
    <div class="result-setting-shake-wrapper app-container">
        <div class="mar-b-10">用户获奖条件与中奖结果配置</div>
        <div class="operator-container">
            <el-button icon="el-icon-plus" type="primary"
                size="medium"
                @click="handleAdd"
                class="operator-item"
            >
                新增
            </el-button>
        </div>
        <div class="main-content-wrapper">
            <div class="box">
                <div class="l">
                    <el-button @click="handleSave" type="primary" size="medium" class="m-b-10" :loading="saving">保存积分配置</el-button>
                    <div class="tip">*当前新增的数据并未保存下来，需要自行点击“保存积分配置”按钮进行保存</div>
                </div>
                <el-tooltip effect="dark" content="刷新页面" placement="top">
                    <el-button icon="el-icon-refresh-right" @click="getList(1)" size="medium"></el-button>
                </el-tooltip>
            </div>
            <el-table :data="dataList" v-loading="load">
                <el-table-column label="序号" width="120px" align="center" prop="name"></el-table-column>
                <el-table-column label="累计获得积分（左闭右开）" align="center">
                    <template slot-scope="scope">
                        <div class="config-common">
                            <el-input-number 
                                :controls="false" 
                                :min="0" 
                                :precision="0" 
                                disabled
                                v-model="scope.row.start"
                            ></el-input-number> 
                            - 
                            <el-input-number 
                                :controls="false" 
                                :min="0" 
                                v-model="scope.row.end"
                                @change="handleEditChange(scope.row, scope.$index)"
                                :precision="0" 
                            ></el-input-number>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center">
                    <template slot-scope="scope">
                        {{scope.row.operation || '-'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="160px">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.row)"
                            v-if="scope.row.id"
                            type="text"
                        >编辑</el-button>
                        <el-button
                            v-if="scope.$index === dataList.length - 1"
                            type="text"
                            @click="handleDel(scope.row, scope.$index)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="pagination-box">
        </div>

        <point-result-dialog 
            v-if="pointResultDialogShow"
            :pointResultDialog="pointResultDialogShow" 
            :propParam="propParam" 
            :countryCode="countryCode"
            :curId="curId"
            @close="pointResultDialogShow = false"></point-result-dialog>
    </div>
</template>

<script>
import pointResultDialog from './components/pointResultDialog'
import { queryPoint, removePointById, savePoint } from '@/api/shake.js'
export default {
    props: {
        countryCode: String
    },
    data () {
        return {
            dataList: [],
            load: false,
            pointResultDialogShow: false,
            propParam: {},
            curId: '',
            saving: false
        }
    },
    components: {
        pointResultDialog
    },
    created () {
        this.getList()
    },
    methods: {
        getList () {
            this.load = true
            queryPoint({type: 2, countryCode: this.countryCode}).then(res => {
                this.load = false
                if (res.ret.errCode === 0) {
                    this.dataList = res.data
                }
            }).catch(() => {
                this.load = false
            })
        },
        handleEdit (item) {
            // 编辑免费赠送的时候，注意积分的回显
            this.curId = item.id
            this.pointResultDialogShow = true
        },
        handleDel (item, index) {
            this.$confirm('确认删除该条设置吗？', '提示')
                .then(() => {
                    if (item.id) {
                        removePointById({id: item.id}).then(res => {
                            if (res.ret.errCode === 0) {
                                this.$message.success('删除成功')
                                this.getList()
                            }
                        })
                    } else {
                        // 针对是当前新增还没有保存的
                        this.dataList.splice(index, 1)
                    }
                })
                .catch(() => {})
        },
        handleAdd () {
            let temp = [ ...this.dataList ] 
            let len = temp.length
            let param = {
                start: len ? temp[len - 1].end : 0,
                end: 0,
                countryCode: this.countryCode,
                name: `第${len + 1}档`,
                type: 2
            }

            this.dataList.push(param)
        },
        handleEditChange (item, index) {
            let temp = [...this.dataList]
            if (index + 1 >= temp.length) {
                return
            }

            let tempItem = Object.assign(temp[index + 1], { start: item.end })
            this.dataList.splice(index + 1, 1, tempItem)
        },
        handleSave () {
            for (let i = 0; i < this.dataList.length; i++) {
                let item = this.dataList[i]
                if (!item.end) {
                    this.$message.error(`序号${i + 1}的右边界值须大于0`)
                    return
                }
                if (item.start >= item.end) {
                    this.$message.error(`序号${i + 1}的右边界须大于左边界`)
                    return
                }
            }
            this.saving = true
            let dataJson = JSON.stringify(this.dataList)
            savePoint({dataJson}).then(res => {
                this.saving = false
                if (res.ret.errCode === 0) {
                    this.$message.success('保存成功')
                    this.getList()
                }
            }).catch(() => {
                this.saving = false
            })
        }
    }
}
</script>

<style scoped lang="scss">
.result-setting-shake-wrapper {
    .config-common {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 4px;
    }
    .tip {
        color: #e71f19;
        font-size: 14px;
        padding-top: 4px;
    }
    .box {
        display: flex;
        padding-bottom: 8px;
        justify-content: space-between;
    }
    .pagination-box {
        justify-content: space-between;
    }
}
</style>