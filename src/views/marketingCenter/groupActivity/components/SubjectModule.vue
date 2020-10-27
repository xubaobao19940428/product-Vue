<template>
    <div class="subject-module-wrapper">
        <div class="subject-module">
            <div class="left">所属专题：</div>
            <div class="center">
                <span v-for="(item, index) in subjectList" :key="index" class="subject-item" :class="{active : active === item.serialId}" @click="selectItem(item)">
                    {{item.cnName}}
                    <i class="el-icon-edit-outline" v-if="item.serialId != 1 && active === item.serialId" @click="editSubject(item)"></i>
                    <i class="el-icon-close" v-if="item.serialId != 1 && active === item.serialId" @click="removeSubject(item)"></i>
                </span>
            </div>
            <div class="right">
                <el-button icon="el-icon-plus" type="primary" size="medium" @click="addSubject">添加专题</el-button>
            </div>
        </div>
        <div style="height: 36px;" v-show="active !== '1'">
            <el-button icon="el-icon-plus" type="primary" size="medium" @click="addPruduct">添加商品</el-button>
            <el-button style="marginLeft: 8px;" icon="el-icon-delete" type="danger" size="medium" @click="delProduct">批量删除</el-button>
        </div>

        <subject-edit-dialog 
            :dialogVisible="editDialogVisible" 
            :editType="editType"
            :groupActivityType="groupActivityType" 
            :subjectObject="subjectObject" 
            @on-cancle="cancleEdit" 
            @on-confirm="confirmEdit"></subject-edit-dialog>
        <product-select ref="productSelect" :dialogVisible='productSelectVisible' :countryCode="countryCode" @confirm="confirmAddProduct" @close="handleClose"></product-select>
        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText"
            @on-cancle="cancleConfirm" @on-confirm="submitRemove">
        </confirm-dialog>
    </div>

</template>

<script>
    import _ from 'lodash'
    import SubjectEditDialog from './SubjectEditDialog'
    import ProductSelect from '../../productSelect/index'
    import { findAllSubjects, batchSave, insertSubject, updateSubject, deleteSubject } from '@/request/marketing'
    import ConfirmDialog from '@/components/ConfirmDialog'
    export default {
        // 专题模块
        name: 'SubjectModule',
        props: {
            countryCode: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                active: '1',
                subjectList: [
                    {
                        cnName: '今日必推',
                        serialId: '1',
                        allowDel: false
                    }
                ],
                groupActivityTypeArray: {
                    0: '普通拼团',
                    1: '一元购',
                    2: '半价购'
                },
                editDialogVisible: false,
                productSelectVisible: false,
                confirmVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                editType: 'add',
                subjectTemp: {},
                languageList: [],
                subjectObject: {},
                groupActivityType: 0
            }
        },
        components: {
            SubjectEditDialog,
            ProductSelect,
            ConfirmDialog
        },
        created() {
            this.languageList = JSON.parse(this.getStore('languageList'))
        },
        mounted() {
        },
        methods: {
            getAllSubjects() {
                let params = {
                    countryCode: this.countryCode
                }
                this.subjectList = [
                    {
                        cnName: '今日必推',
                        serialId: '1',
                        allowDel: false
                    }
                ],
                findAllSubjects(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        let groupActivitySubject = res.groupActivitySubjectResp
                        _.forEach(groupActivitySubject, (item) => {
                            let subjectItem = {
                                cnName: item.cnName,
                                serialId: item.serialId,
                                allowDel: true,
                                groupActivityType: item.groupActivityType,
                                name: item.name
                            }
                            this.subjectList.push(subjectItem)
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            delProduct () {
                this.$emit('del-select')
            },
            addSubject() {
                this.editType = 'add'
                this.editDialogVisible = true
            },
            cancleEdit() {
                this.editDialogVisible = false
            },
            confirmEdit(obj) {
                let subjectObj = {
                    languages: obj.subjectInfo
                }
                this.editDialogVisible = false
                let params = {
                    name: JSON.stringify(subjectObj),
                    groupActivityType: obj.groupActivityType,
                    countryCode: this.countryCode
                }
                console.log(subjectObj)
                if (this.editType === 'add') {
                    this.insertSubjectRequset(params)
                } else  {
                    params.serialId = this.subjectTemp.serialId
                    this.updateSubjectRequset(params)
                }
            },
            insertSubjectRequset(params) {
                insertSubject(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('专题更新成功')
                        this.getAllSubjects()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            updateSubjectRequset(params) {
                updateSubject(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('专题更新成功')
                        this.getAllSubjects()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            selectItem(item) {
                this.active = item.serialId
                this.$emit('on-select', item)
            },
            addPruduct() {
                this.productSelectVisible = true
                this.$refs['productSelect'].getList()
            },
            confirmAddProduct(products) {
                let params = {
                    subjectSerialId: this.active,
                    productId: products
                }
                batchSave(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.productSelectVisible = false // 失败的时候，弹窗不关闭
                        this.$emit('on-refresh')
                        this.$message.success('拼团商品添加成功！')
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            handleClose() {
                this.productSelectVisible = false
            },
            editSubject(item) {
                this.editType = 'edit'
                this.subjectTemp = item
                let subjectName = JSON.parse(item.name)

                _.forEach(this.languageList, item => {
                    if (!_.has(subjectName.languages, item.code )) {
                        subjectName.languages[item.code] = ''
                    }
                })
                this.subjectObject = subjectName.languages
                this.groupActivityType = item.groupActivityType
                this.editDialogVisible = true
            },
            removeSubject(item) {
                this.subjectTemp = item
                this.confirmDialogTitle = '确定删除该专题?'
                this.confirmDialogText = '删除后将无法恢复?'
                this.confirmVisible = true
            },
            cancleConfirm() {
                this.confirmVisible = false
            },
            submitRemove() {
                let params = {
                    serialId: this.subjectTemp.serialId
                }
                deleteSubject(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('专题删除成功！')
                        this.getAllSubjects()
                    }
                }).catch(err => {
                    console.log(err)
                })
                this.confirmVisible = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .subject-module-wrapper {
        padding-bottom: 10px;
        .subject-module {
            display: flex;
            height: 80px;
            align-items: center;
            border-bottom: 1px dashed #ccc;
            margin-bottom: 10px;
            .left {
                width: 100px;
            }
            .right {
                width: 150px;
                text-align: center
            }
            .center {
                flex: 1;
                white-space: nowrap;
                overflow-x: auto;
                span {
                    margin: 6px 8px;
                    padding: 6px 14px;
                    text-align: center;
                    line-height: initial;
                    cursor: pointer;
                    border-radius: 4px;
                }
                .subject-item {
                    display: inline-block;
                }
                .active {
                    background-color: #3a97ff;
                    color: #fff;
                }
            }
        }
    }
</style>

