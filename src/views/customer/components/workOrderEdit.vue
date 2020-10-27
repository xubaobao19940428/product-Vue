<template>
    <!--新建工单-->
    <el-dialog title="新建工单" width="700px"
               :append-to-body="true"
               :visible="showDialog"
               @close="closeDialog">
        <div>
            <el-form ref="addDialog" label-position="right" label-width="110px" label-suffix="："
                     :rules="addDialog.rules"
                     :model="addDialog.param">
                <el-form-item label="标签：" prop="tagId">
                    <el-cascader v-model="addDialog.tagIdList"
                                 @change="setTagId"
                                 :props="{ value: 'id', label: 'tagName', children: 'subTags'}"
                                 :options="addDialog.labelList"></el-cascader>
                </el-form-item>
                <el-form-item label="工单来源：" prop="workOrderSource">
                    <el-select v-model="addDialog.param.workOrderSource" placeholder="请选择" size="medium">
                        <el-option v-for="(val, key) in sourceList"
                                   :key="key"
                                   :label="val"
                                   :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户信息：" prop="userNickName">
                    <el-radio-group v-model="addDialog.param.userType" @change="clearValidate">
                        <el-radio label="0">
                            <span >注册用户</span>
                            <el-select v-if="addDialog.param.userType == 0" v-model="addDialog.param.userId" class="mar-l-10" placeholder="请选择用户" size="medium" filterable remote
                                       @change="setAppUserInfo"
                                       :remote-method="getAppUserList">
                                <el-option v-for="(val, key) in addDialog.appUserList"
                                           :key="key"
                                           :label="val.nickName + '/' + val.userId + '/' + val.mobile"
                                           :value="val.userId"></el-option>
                            </el-select>
                        </el-radio>
                        <el-radio label="1">
                            <span>未注册用户</span>
                            <el-input class="mar-l-10" v-if="addDialog.param.userType == 1" v-model="addDialog.param.userNickName" size="medium" placeholder="请输入用户昵称"></el-input>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="工单描述：" prop="workOrderDescribe">
                    <el-input v-model="addDialog.param.workOrderDescribe" type="textarea" maxlength="2000" placeholder="请输入2000字符以内"
                              :rows="2"></el-input>
                </el-form-item>
                <el-form-item label="子订单ID：" prop="">
                    <el-input v-model="addDialog.param.subOrderNo" @blur="getOrderInfo()" size="medium" placeholder="请输入子订单ID"></el-input>
                </el-form-item>
                <el-form-item label="订单ID：" prop="">
                    <el-input v-model="addDialog.param.orderNo" size="medium" placeholder="请输入订单ID"></el-input>
                </el-form-item>
                <el-form-item label="上传附件">
                    <c-upload v-if="showDialog"
                        :fileList="addDialog.param.workOrderPic"
                        @setData="setCoverImg"
                        :limit="30"
                        listType="text"
                    ></c-upload>
                </el-form-item>
                <el-form-item label="紧急程度">
                    <el-radio-group v-model="addDialog.param.emergencyLevel">
                        <el-radio v-for="(item, key) in emergencyLevel"
                                  :key="key"
                                  :label="item.key">{{ item.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否分派处理">
                    <el-radio-group v-model="addDialog.param.doDispatch">
                        <el-radio v-for="(item, key) in dispatchMap"
                                  :key="key"
                                  :label="item.key">{{ item.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="addDialog.param.doDispatch == 1">
                    <el-form-item label="指定分派">
                        <el-select v-model="addDialog.param.dispatchDealManagerId"
                                   :remote-method="getDispatchUserList"
                                   placeholder="未填时按标签随机" size="medium" filterable remote>
                            <el-option v-for="(item, index) in dispatchUserList"
                                       :key="index"
                                       :label="item.realName"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="抄送">
                        <el-select v-model="addDialog.param.ccManagerId"
                                   :remote-method="getCcUserList"
                                   placeholder="请选择" size="medium" filterable remote>
                            <el-option v-for="(item, index) in ccUserList"
                                       :key="index"
                                       :label="item.realName"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <el-form-item label="备注事项">
                    <el-input v-model="addDialog.param.workOrderContent" type="textarea" maxlength="200" placeholder="请输入200字符以内"
                              :rows="2"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeDialog">取 消</el-button>
                <el-button size="small" type="primary" @click="confirmAddItem">确 定</el-button>
            </span>
    </el-dialog>
</template>
<script>
    import { AddWorkOrder, ValidTagList } from '@/request/workOrder.js'
    import { listUserByPage } from '@/request/user'
    import { queryOrderInfoBySub } from '@/request/order'
    import cUpload from '@/components/fileUpload/'
    import common from './common'

    export default {
        props: {
            showDialog: {
                type: Boolean,
                default: false
            },
            propParam: {
                type: Object,
                default: () => { return {} }
            }
        },
        components: {
            cUpload
        },
        mixins: [common],
        data () {
            return {
                addDialog: {
                    show: false,
                    imgList: [],
                    labelList: [],
                    appUserList: [],
                    tagIdList: [],
                    param: {
                        workOrderPic: '',
                        tagId: '',
                        workOrderSource: '',
                        workOrderDescribe: '',
                        emergencyLevel: 10,
                        doDispatch: 2,
                        userId: '',
                        userNickName: '',
                        userMobile: '',
                        subOrderNo: '',
                        orderNo: '',
                        userType: '0'
                    },
                    rules: {
                        workOrderSource: [{ required: true, message: '不能为空', trigger: 'change' }],
                        workOrderDescribe: [{ required: true, message: '不能为空', trigger: 'change' }],
                        tagId: [{ required: true, message: '不能为空', trigger: 'change' }],
                        userNickName: [{ required: true, message: '不能为空', trigger: 'change' }]
                    }
                },
                userType: {
                    0: '注册用户',
                    1: '未注册用户'
                },
                dispatchUserList: [],
                ccUserList: []
            }
        },
        watch: {
            propParam: {
                handler (data) {
                    if (data) {
                        Object.assign(this.addDialog.param, JSON.parse(JSON.stringify(data)))
                        this.setAppUserInfo()
                    }
                },
                deep: true
            },
            showDialog (val) {
                if (val) {
                    Object.assign(this.addDialog.param, JSON.parse(JSON.stringify(this.propParam)))
                    this.setAppUserInfo()
                }
            }
        },
        created () {
            this.getTagList()
        },
        methods: {
            closeDialog () {
                this.addDialog.param = {
                    workOrderPic: '',
                    tagId: '',
                    workOrderSource: '',
                    workOrderDescribe: '',
                    emergencyLevel: 10,
                    doDispatch: 2,
                    userId: '',
                    userNickName: '',
                    userMobile: '',
                    subOrderNo: '',
                    orderNo: '',
                    userType: '0'
                }
                this.addDialog.tagIdList = []
                this.addDialog.imgList = []
                this.$refs['addDialog'] && this.$refs['addDialog'].clearValidate()
                this.$emit('close')
            },
            getDispatchUserList (query) {
                this.getAdminUserList(query, (data) => {
                    this.dispatchUserList = data
                })
            },
            getCcUserList (query) {
                this.getAdminUserList(query, (data) => {
                    this.ccUserList = data
                })
            },
            getTagList () {
                ValidTagList({}).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        this.addDialog.labelList = []
                        for (let i = 0; i < res.data.length; i++) {
                            let item = {
                                groupId: res.data[i].groupId,
                                id: res.data[i].id,
                                tagName: res.data[i].tagName,
                                subTags: []
                            }
                            for (let j = 0; j < res.data[i].subTags.length; j++) {
                                item.subTags.push({
                                    groupId: res.data[i].subTags[j].groupId,
                                    id: res.data[i].subTags[j].id,
                                    tagName: res.data[i].subTags[j].tagName
                                })
                            }
                            this.addDialog.labelList.push(item)
                        }
                    }
                })
            },
            setAppUserInfo () {
                if (this.addDialog.param.userId) {
                    this.getAppUserList(this.addDialog.param.userId, () => {
                        let user = this.addDialog.appUserList.find((val) => {
                            return val.userId == this.addDialog.param.userId
                        })
                        if (user) {
                            this.addDialog.param.userId = user.userId
                            this.addDialog.param.userNickName = user.nickName
                            this.addDialog.param.userMobile = user.mobile
                            this.addDialog.param.userType = '0'
                            this.$refs['addDialog'] && this.$refs['addDialog'].clearValidate()
                            console.log(this.addDialog.param)
                        }
                    })
                }
            },
            clearValidate () {
                this.addDialog.param.userId = ''
                this.addDialog.param.userNickName = ''
                this.addDialog.param.userMobile = ''
                this.$refs['addDialog'] && this.$refs['addDialog'].clearValidate()
            },
            setTagId (idList) {
                if (idList.length > 0) {
                    this.addDialog.param.tagId = parseInt(idList[1])
                }
            },
            getAppUserList (query, callback) {
                if (query != '') {
                    listUserByPage({
                        userId: query,
                        page: {
                            pageNum: 1,
                            pageSize: 1000
                        }
                    }).then((res) => {
                        if (res.ret.errcode === 1) {
                            this.addDialog.appUserList = res.userManagePb
                            callback && callback()
                        }
                    })
                }
            },
            setCoverImg (res) {
                this.addDialog.param.workOrderPic = res.data
            },
            getOrderInfo () {
                if (!this.addDialog.param.subOrderNo) {
                    return
                }
                queryOrderInfoBySub({
                    suborderId: this.addDialog.param.subOrderNo
                }).then((res) => {
                    if (res.ret.errcode == 1) {
                        this.addDialog.param.orderNo = res.orderId
                        this.addDialog.param.userId = res.userId
                        this.addDialog.param.userNickName = res.username
                        this.addDialog.param.userMobile = res.phone
                        this.addDialog.param.userType = '0'
                    }
                })
            },
            // 新建工单
            confirmAddItem () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        console.log(this.addDialog.param)
                        AddWorkOrder(this.filterData(this.addDialog.param)).then((res) => {
                            console.log(res)
                            if (res.ret.errcode === 1) {
                                this.$message.success('工单创建成功')
                                this.addDialog.param = {
                                    workOrderPic: '',
                                    tagId: '',
                                    workOrderSource: '',
                                    workOrderDescribe: '',
                                    emergencyLevel: 10,
                                    doDispatch: 2,
                                    userId: '',
                                    userNickName: '',
                                    userMobile: ''
                                }
                                this.addDialog.tagIdList = []
                                this.addDialog.imgList = []
                                this.$emit('confirm')
                            }
                        })
                    }
                })
            }
        }
    }
</script>
