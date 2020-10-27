<template>
    <div class="customer-manage">
        <el-form ref="customerManageFilter" inline :model="queryData" label-position="left">
            <el-form-item class="filter-item" label="客服名称：">
                <el-select v-model="queryData.csName" filterable clearable remote reserve-keyword :remote-method="getlistSysUserByPage" size="medium" placeholder="按名称模糊匹配">
                    <el-option v-for="(item, index) in customerList"
                        :key="index"
                        :label="item.nickName"
                        :value="item.nickName"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="importType" label="客服国家：" class="filter-item">
                <el-select v-model="queryData.csCountryCode" clearable placeholder="请选择" size="medium">
                    <el-option v-for="(item, index) in countryList"
                                :key="index"
                                :label="item.nameCn "
                                :value="item.shortCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="filter-item" label="服务语言技能：">
                <el-select v-model="queryData.csLanguage" multiple size="medium">
                    <el-option v-for="(item, index) in languageList"
                        :key="index"
                        :label="item.desc"
                        :value="item.code"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                <el-button icon="el-icon-plus" type="primary" @click="addClick" size="medium">新增客服</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border style="width: 100%" >
            <el-table-column label="排序" width="100" align="center" type="index" :index="indexMethod" fixed="left"></el-table-column>
            <el-table-column label="客服昵称" width="200" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.csName }}</div>
                </template>
            </el-table-column>
            <el-table-column label="客服国家" width="200" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.csCountryCode }}</div>
                </template>
            </el-table-column>
            <el-table-column label="服务语言技能" width="200" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.csLanguage }}</div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="200" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.createTime | formatTime}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作人" width="130" align="center">
                <template slot-scope="scope">
                    {{ scope.row.operationName }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="editClick(scope.row)">编辑</el-button>
                    <el-button type="text" class="delete-btn" @click="deleteClick(scope.row.csId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-wrapper">
            <el-pagination
                @size-change="handleSizeChanges"
                @current-change="handleCurrentChanges"
                :current-page="queryData.page.pageNum"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <cusromer-dialog v-if="dialogVisible" :dialogVisible="dialogVisible" :editType="editType" :countryList="countryList" :languageList="languageList" :editModule="editModule" @on-cancel="cancelDialog" @on-confirm="confirmDialog"></cusromer-dialog>
    </div>
</template>
<script>
    import { ListCsStaffByPage, DeleteCsStaff } from '@/request/customerManage'
    import { listSysUserByPage } from '@/request/staff'
    import cusromerDialog from './components/cusromerDialog'

    export default {
        data () {
            return {
                queryData: {
                    csName: '',
                    csCountryCode: '',
                    csLanguage: [],
                    page:{
                        pageNum: 1,
                        pageSize: 10
                    }
                },
                total: 0,
                tableData: [],
                editType: 'add',
                dialogVisible: false,
                customerList: [],
                editModule: {
                    csId: null,
                    csLanguage: '',
                    csName: '',
                    csCountryCode: ''
                }
            }
        },
        components: {
            cusromerDialog
        },
        mounted () {
            this.getListCsStaffByPage()
            this.getlistSysUserByPage()
        },
        computed: {
            countryList () {
                let list = [].concat(this.$store.state.dict.countryList)
                let item = list.find((val) => {
                    return val.shortCode == 'ID'
                })
                if (!item) {
                    list.push({
                        nameCn: '印度尼西亚',
                        nameLocal: '印度尼西亚',
                        shortCode: 'ID'
                    })
                }   
                return list
            },
            languageList () {
                return this.$store.state.dict.languageList
            }
        },
        methods: {
            indexMethod(index) {
                return index + 1
            },
            getlistSysUserByPage (val) {
                let params = {
                    nickName: val?val:this.queryData.csName,
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                }
                listSysUserByPage(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.customerList = res.sysUserPb
                    }
                })
            },
            getListCsStaffByPage () {
                let params = {
                    csName: this.queryData.csName,
                    csCountryCode: this.queryData.csCountryCode,
                    csLanguage: this.queryData.csLanguage.length===0?'':this.queryData.csLanguage.join('|'),
                    page: this.queryData.page
                }
                ListCsStaffByPage(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.tableData = res.csStaffPb
                        this.total = res.total
                    }
                })
            },
            handleSizeChanges (val) {
                this.queryData.page.pageSize = val
                this.getListCsStaffByPage()
            },
            handleCurrentChanges (val) {
                this.queryData.page.pageNum = val
                this.getListCsStaffByPage()
            },
            search () {
                this.getListCsStaffByPage()
            },
            resetSearch () {
                Object.assign(this.queryData, {
                    csName: '',
                    csCountryCode: '',
                    csLanguage: '',
                    page:{
                        pageNum: 1,
                        pageSize: 10
                    }
                }),
                this.getListCsStaffByPage()
            },
            addClick () {
                this.editType = 'add'
                this.dialogVisible = true
            },
            editClick (val) {
                console.log(val)
                Object.assign(this.editModule,{
                    csId: val.csId,
                    csLanguage: val.csLanguageCode,
                    csName: val.csName,
                    csCountryCode: val.csCountryCode
                })
                console.log(this.editModule)
                this.editType = 'edit'
                this.dialogVisible = true
            },
            deleteClick (csId) {
                this.$confirm('删除后不可恢复，需要重新添加', '确认删除此客服', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let params = {
                        csId
                    }
                    DeleteCsStaff(params).then(res => {
                        if (res.ret.errcode === 1) {
                            console.log(res)
                            this.$message.success('删除成功！')
                            this.getListCsStaffByPage()
                        }
                    }) 
                })
            },
            cancelDialog () {
                this.dialogVisible = false
            },
            confirmDialog () {
                this.dialogVisible = false
                if (this.editType === 'add'){
                    this.$message.success('添加成功！')
                    this.getListCsStaffByPage()
                } else {
                    this.$message.success('修改成功！')
                    this.getListCsStaffByPage()
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .customer-manage{
        overflow: scroll;
        .delete-btn{
            color: red;
        }
    }
</style>