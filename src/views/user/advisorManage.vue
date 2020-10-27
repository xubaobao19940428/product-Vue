<template>
    <div class="advisor-manage-container app-container">
        <el-form inline label-width="80px" :model="searchParam">
            <el-form-item label="导师昵称：">
                <el-input v-model="searchParam.nickName" clearable></el-input>
            </el-form-item>
            <el-form-item label="等级阶梯：">
                <el-select v-model="searchParam.code" clearable>
                    <el-option v-for="item in fingoMasterList" :key="item.key" :value="item.key" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="medium"
                    @click="getList(1)"
                    type="primary"
                    icon="el-icon-search"
                >搜索</el-button>
                <el-button
                    @click="resetSearch"
                    icon="el-icon-refresh-left"
                    size="medium"
                >重置</el-button>
            </el-form-item>
        </el-form>
        <div class="app-container">
            <el-tabs v-model="currentCountry" type="card" @tab-click="handleCountryChange">
                <el-tab-pane v-for="item in countryList" 
                    :key="item.shortCode"
                    :label="item.nameCn"
                    :name="item.shortCode"
                >
                    <div class="operator-box">
                        <el-button icon="el-icon-plus" @click="handleAdd" type="primary" size="medium"
                            v-if="hasPermission('BTN_ADVISOR_MANAGE_ADD')"
                        >添加导师</el-button>
                    </div>
                    <el-table :data="dataList" border 
                        v-loading="load"
                        height="100%"
                        style="width: 100%"
                    >
                        <el-table-column label="导师昵称" align="center" prop="nickName" fixed="left" min-width="100px"></el-table-column>
                        <el-table-column label="头像" align="center" fixed="left" width="120px">
                            <template slot-scope="scope">
                                <div class="img-box">
                                    <img :Src="dealShowFileSrc(scope.row.headImg)"/>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="等级阶梯" prop="codeDesc" align="center" width="130px"></el-table-column>
                        <el-table-column label="微信号" prop="wechatId" align="center" min-width="100px"></el-table-column>
                        <el-table-column label="WhatsApp" prop="whatsApp" align="center" min-width="200px"></el-table-column>
                        <el-table-column label="WhatsApp链接" prop="whatsAppLink" align="center" width="240px"></el-table-column>
                        <el-table-column label="Line" prop="lineId" align="center" min-width="200px"></el-table-column>
                        <el-table-column label="Line链接" prop="lineLink" align="center" width="240px"></el-table-column>
                        <!-- <el-table-column label="创建时间（北京）" align="center" width="160px">
                            <template slot-scope="scope"></template>
                        </el-table-column> -->
                        <el-table-column label="操作" align="center" fixed="right" width="120px">
                            <template slot-scope="scope">
                                <el-button type="text" @click="handleEdit(scope.row, 'edit')" v-if="hasPermission('BTN_ADVISOR_MANAGE_EDIT')">编辑</el-button>
                                <el-button type="text" @click="handleEdit(scope.row, 'copy')" v-if="hasPermission('BTN_ADVISOR_MANAGE_COPY')">复制</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>

        <edit-advisor-dialog v-if="advisorShow" 
            :countryCode="currentCountry"
            :countryList="countryList"
            :fingoMasterList="fingoMasterList"
            :type="curType" :propParam="propParam" :advisorShow="advisorShow" @close="advisorShow = false" @confirm="handelConfirm"></edit-advisor-dialog>
    </div>
</template>

<script>
import { listFingoMasterInfo, updateFingoMasterInfo } from '@/request/user'
import editAdvisorDialog from './components/editAdvisorDialog'
export default {
    data () {
        return {
            load: false,
            dataList: [],
            currentCountry: 'MY',
            propParam: {},
            advisorShow: false,
            curType: 'add',
            fingoMasterList: [{
                key: 'V3_FINGO_MASTER',
                name: 'PS导师（直推5，团队15）'
            }, {
                key: 'V4_FINGO_MASTER',
                name: 'AM导师300以下'
            }, {
                key: 'V4_FINGO_MASTER2',
                name: 'AM导师300以上'
            }, {
                key: 'V5_FINGO_MASTER',
                name: 'AT导师'
            }],
            searchParam: {
                nickName: '',
                code: ''
                // page: {
                //     pageNum: 1,
                //     pageSize: 10,
                //     pagingSwitch: true
                // }
            }
        }
    },
    components: {
        editAdvisorDialog
    },
    computed: {
        countryList () {
            let tempList = JSON.parse(JSON.stringify(this.$store.state.dict.countryList))
            let idIndex = tempList.findIndex(a => a.shortCode == 'ID')
            if (idIndex == -1) {
                tempList.push({
                    nameCn: '印度尼西亚',
                    shortCode: 'ID'
                })
            }

            return tempList
        }
    },
    created () {
        this.getList()
    },
    methods: {
        handleCountryChange () {
            this.dataList = []
            this.getList()
        },
        getList () {
            this.load = true
            listFingoMasterInfo({
                countryCode: this.currentCountry,
                ...this.searchParam
            }).then(res => {
                if (res.ret.errcode === 1) {
                    this.dataList = res.fingoMasterInfo
                }
                this.load = false
            }).catch(() => {
                this.load = false
            })
        },
        handleAdd () {
            this.curType = 'add'
            this.advisorShow = true
        },
        handleEdit (item, type) {
            this.curType = type
            Object.assign(this.propParam, {
                code: item.code,
                countryCode: item.countryCode,
                headImg: item.headImg,
                nickName: item.nickName,
                whatsApp: item.whatsApp,
                whatsAppLink: item.whatsAppLink,
                lineId: item.lineId,
                lineLink: item.lineLink,
                wechatId: item.wechatId
            })
            if (type == 'edit') {
                this.propParam.id = item.id
            } else {
                this.propParam.id = ''
            }
            this.advisorShow = true
        },
        handelConfirm (param) {
            updateFingoMasterInfo({fingoMasterInfo: param}).then(res => {
                if (res.ret.errcode === 1) {
                    this.$message.success(this.curType === 'edit' ? '编辑成功' : '新增成功')
                    this.advisorShow = false
                    this.getList()
                }
            })
        }
    }
}
</script>

<style lang="scss">
.advisor-manage-container {
    .el-tabs, .el-tabs__content, .el-tab-pane {
        height: 100%;
    }
    .el-tab-pane {
        overflow: auto;
    }
}
</style>
<style lang="scss" scoped>
.advisor-manage-container {
    .operator-box {
        text-align: right;
        padding-bottom: 8px;
    }
    .img-box {
        width: 100px;
        margin: 6px 0;
        border-radius: 2px;
        img {
            width: 100%;
        }
    }
}
</style>