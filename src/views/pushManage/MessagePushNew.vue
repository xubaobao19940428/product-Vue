<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form ref="messagePushForm" inline label-width="90px" :model="queryData">
                <el-form-item label="标题：" class="filter-item" prop="title">
                    <el-input v-model="queryData.title" placeholder="请输入标题" size="medium" clearable></el-input>
                </el-form-item>
                <el-form-item label="内容：" class="filter-item" prop="content">
                    <el-input v-model="queryData.content" placeholder="请输入内容" size="medium" clearable></el-input>
                </el-form-item>
                <span v-show="drop">
                    <el-form-item label="推送编号：" class="filter-item" prop="pushTaskCode">
                        <el-input v-model="queryData.pushTaskCode" placeholder="请输入推送编号" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="推送渠道：" class="filter-item" prop="pushChannel">
                        <el-select v-model="queryData.pushChannel" size="medium" clearable>
                            <el-option v-for="(item, index) in pushChannelList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="推送类型：" class="filter-item" prop="pushType">
                        <el-select v-model="queryData.pushType" size="medium" clearable>
                            <el-option v-for="(item, index) in pushTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发送状态：" class="filter-item" prop="sendType">
                        <el-select v-model="queryData.sendType" size="medium" clearable>
                            <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间：" class="filter-item" prop="createTimeList">
                        <el-date-picker v-model="queryData.createTimeList"
                            size="medium"
                            type="daterange"
                            value-format="timestamp"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-form-item>
                </span>
                <el-form-item label="发送时间：" class="filter-item" prop="sendTimeList">
                    <el-date-picker v-model="queryData.sendTimeList"
                        size="medium"
                        type="daterange"
                        value-format="timestamp"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium" @keyup.enter.native="search">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </el-link>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <el-tabs v-model="activeCountry" type="card" @tab-click="handleTabClick">
                <el-tab-pane v-for="(item, index) in countryList" :key="index" :label="item.nameLocal" :name="item.shortCode">
                </el-tab-pane>
            </el-tabs>
            <div class="sub-operate">
                <el-radio-group v-model="listType" @change="handleRadioChange" size="medium">
                    <el-radio-button label="task">任务</el-radio-button>
                    <el-radio-button label="record">记录</el-radio-button>
                </el-radio-group>
                <p class="tip">特别提醒：由于推送信息，默认全量用户，所以查询用户信息需要时间比较久，如果需要修改推送人群信息，请间隔20秒</p>
                <el-button type="primary" size="medium" icon="el-icon-plus" @click="addMessagePush">新建推送</el-button>
            </div>
            <span v-show="listType === 'task'" class="main-content-wrapper">
                <el-table height="82%" :data="tableData" border style="width: 100%" v-loading="loading">
                    <el-table-column prop="pushTaskCode" key="1" label="推送编号" fixed align="center" width="180">
                    </el-table-column>
                    <el-table-column prop="title" key="2" label="标题" fixed align="center" min-width="200">
                        <!-- <template slot-scope="scope" >
                            <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top">
                                <span
                                    style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical">
                                    {{scope.row.title}}
                                </span>
                            </el-tooltip>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="content" key="3" label="内容" align="center" min-width="200">
                        <!-- <template slot-scope="scope" >
                            <el-tooltip class="item" effect="dark" :content="scope.row.content" placement="top">
                                <span
                                    style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical">
                                    {{scope.row.content}}
                                </span>
                            </el-tooltip>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="pushChannel" key="4" label="推送渠道" align="center" width="100">
                        <template slot-scope="scope" >
                            <span v-if="scope.row.pushChannel === 1">站外+应用内</span>
                            <span v-if="scope.row.pushChannel === 2">应用内</span>
                            <span v-if="scope.row.pushChannel === 3">站外</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pushType" key="5" label="推送类型" align="center" width="100">
                        <template slot-scope="scope" >
                            <span v-if="scope.row.pushType === 'PROMOTION_CODE_SALE'">促销活动</span>
                            <span v-if="scope.row.pushType === 'PROMOTION_CODE_COUPON'">优惠券</span>
                            <span v-if="scope.row.pushType === 'PROMOTION_CODE_MEMBER_ACTIVITY'">会员活动</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="creator" key="6" label="创建人" align="center" width="100">
                        <template slot-scope="scope" >
                            {{scope.row.creator || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" key="10" label="创建时间(北京)" align="center" width="160">
                        <template slot-scope="scope" >
                            {{scope.row.createTime | secondTimeFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" key="13" align="center" fixed="right" width="200">
                        <template slot-scope="scope">
                            <el-dropdown v-if="listType === 'task' && hasPermission('BTN_MESSAGE_PUSH_SEND')" size="medium" type="text" trigger="click" @command="handleCommand">
                                <span class="el-dropdown-link send-push">
                                    发送<i class="el-icon-arrow-down"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="sendNow" @click.native="sendOption(scope.row)">立即发送</el-dropdown-item>
                                    <el-dropdown-item command="sendTimer" @click.native="sendOption(scope.row)">定时发送</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-dropdown v-if="listType === 'record' && scope.row.sendStatus === 3 && hasPermission('BTN_MESSAGE_PUSH_SEND')" size="medium" type="text" trigger="click" @command="handleRecordCommand">
                                <span class="el-dropdown-link send-push">
                                    定时发送<i class="el-icon-arrow-down"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="cancelTiming" @click.native="sendOption(scope.row)">撤销定时</el-dropdown-item>
                                    <el-dropdown-item command="sendTiming" @click.native="sendOption(scope.row)">立即发送</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-button v-if="listType === 'task' && hasPermission('BTN_MESSAGE_PUSH_EDIT')" type="text" size="mini" @click='editPush(scope.row, "edit")'>编辑</el-button>
                            <el-button v-if="listType === 'record'" type="text" size="mini" @click='editPush(scope.row, "view")'>查看</el-button>
                            <el-button v-if="listType === 'task' && hasPermission('BTN_MESSAGE_PUSH_RECEIVER_SET')" type="text" size="mini" @click='setReceiver(scope.row)'>接收用户</el-button>
                            <el-button v-if="listType === 'task' && hasPermission('BTN_MESSAGE_PUSH_DELETE')" type="text" size="mini" @click='delPushTask(scope.row)'>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </span>
            <span v-show="listType === 'record'">
                <el-table height="84%" :data="tableData" border style="width: 100%" v-loading="loading">
                    <el-table-column prop="pushTaskCode" key="1" label="推送编号" fixed align="center" width="180">
                    </el-table-column>
                    <el-table-column prop="title" key="2" label="标题" fixed align="center" min-width="200">
                        <!-- <template slot-scope="scope" >
                            <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top">
                                <span
                                    style="heightdisplay: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 2;-webkit-box-orient: vertical">
                                    {{scope.row.title}}
                                </span>
                            </el-tooltip>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="content" key="3" label="内容" align="center" min-width="200">
                        <!-- <template slot-scope="scope" >
                            <el-tooltip class="item" effect="dark" :content="scope.row.content" placement="top">
                                <span
                                    style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 2;-webkit-box-orient: vertical">
                                    {{scope.row.content}}
                                </span>
                            </el-tooltip>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="sendStatus" key="12" label="发送状态" align="center" width="100">
                        <template slot-scope="scope" >
                            <el-tag v-if="scope.row.sendStatus === 1" size="mini" type="success">已发送</el-tag>
                            <el-tag v-if="scope.row.sendStatus === 2" size="mini">发送中</el-tag>
                            <el-tag v-if="scope.row.sendStatus === 3" size="mini" type="warning">定时发送</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pushChannel" key="4" label="推送渠道" align="center" width="100">
                        <template slot-scope="scope" >
                            <span v-if="scope.row.pushChannel === 1">站外+应用内</span>
                            <span v-if="scope.row.pushChannel === 2">应用内</span>
                            <span v-if="scope.row.pushChannel === 3">站外</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pushType" key="5" label="推送类型" align="center" width="100">
                        <template slot-scope="scope" >
                            <span v-if="scope.row.pushType === 'PROMOTION_CODE_SALE'">促销活动</span>
                            <span v-if="scope.row.pushType === 'PROMOTION_CODE_COUPON'">优惠券</span>
                            <span v-if="scope.row.pushType === 'PROMOTION_CODE_MEMBER_ACTIVITY'">会员活动</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="creator" key="6" label="创建人" align="center" width="100">
                        <template slot-scope="scope" >
                            {{scope.row.creator || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="sender" key="7" label="发送人" align="center" width="100">
                        <template slot-scope="scope" >
                            {{scope.row.sender || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="successSentNum" key="8" label="成功发送数" align="center" width="110" >
                    </el-table-column>
                    <el-table-column prop="openRate" key="9" label="打开率" align="center" width="100">
                        <template slot="header">
                            打开率
                            <el-tooltip class="item" effect="dark" content="打开率=（阅读推送的用户数/成功发送数）x 100%" placement="top">
                                <i class="el-icon-warning-outline"></i>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope" >
                            {{scope.row.openRate || '-'}}%
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" key="10" label="创建时间(北京)" align="center" width="160">
                        <template slot-scope="scope" >
                            {{scope.row.createTime | secondTimeFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="sentTime" key="11" :label="'发送时间('+activeCountryName+')'" align="center" width="160">
                        <template slot-scope="scope" >
                            {{scope.row.sentTime | secondTimeFormat}}
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" key="13" align="center" fixed="right" width="200">
                        <template slot-scope="scope">
                            <el-dropdown v-if="listType === 'task'" size="medium" type="text" trigger="click" @command="handleCommand">
                                <span class="el-dropdown-link send-push">
                                    发送<i class="el-icon-arrow-down"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="sendNow" @click.native="sendOption(scope.row)">立即发送</el-dropdown-item>
                                    <el-dropdown-item command="sendTimer" @click.native="sendOption(scope.row)">定时发送</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-dropdown v-if="listType === 'record' && scope.row.sendStatus === 3" size="medium" type="text" trigger="click" @command="handleRecordCommand">
                                <span class="el-dropdown-link send-push">
                                    定时发送<i class="el-icon-arrow-down"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="cancelTiming" @click.native="sendOption(scope.row)">撤销定时</el-dropdown-item>
                                    <el-dropdown-item command="sendTiming" @click.native="sendOption(scope.row)">立即发送</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-button v-if="listType === 'task'" type="text" size="mini" @click='editPush(scope.row, "edit")'>编辑</el-button>
                            <el-button v-if="listType === 'record'" type="text" size="mini" @click='editPush(scope.row, "view")'>查看</el-button>
                            <el-button v-if="listType === 'task'" type="text" size="mini" @click='setReceiver(scope.row)'>接收用户</el-button>
                            <el-button v-if="listType === 'task'" type="text" size="mini" @click='delPushTask(scope.row)'>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </span>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                class="pagination">
            </el-pagination>
        </div>
        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText" @on-cancle="handleCancleConfirm" @on-confirm="handleConfirm"></confirm-dialog>
        <push-time-edit-dialog :dialogVisible="pushTimeEditVisible" :countryName="activeCountryName" :pushSettingModel="pushTimeSetting" @on-cancle="handleCancleEditTime" @on-confirm="handleConfirmEditTime"></push-time-edit-dialog>
        <push-receiver-edit-dialog :dialogVisible="pushReceiverEditVisible" :receiverModel="receiverModel" @on-cancle="handleCancleEditReceiver" @on-confirm="handleConfirmEditReceiver"></push-receiver-edit-dialog>
        <message-push-edit-dialog :dialogVisible="editDialogVisible" :editType="messageEditType" :pushSettingModel="pushSetting" @on-cancle="handleCancleEdit" @on-confirm="handleConfrimEdit"></message-push-edit-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import { searchPushTaskOrRecord, createPushTask, editPushTask, sendPush, editUserGroup, deletePushTask, cancelTimingTask, sendTimingTaskNow, GetUserGroupInfo } from '@/request/pushtask'
    import MessagePushEditDialog from './MessagePushEditDialog'
    import ConfirmDialog from '@/components/ConfirmDialog'
    import PushTimeEditDialog from './components/PushTimeEditDialog'
    import PushReceiverEditDialog from './components/PushReceiverEditDialog'
    let moment = require('moment')

    export default {
        // 消息推送
        name: 'MessagePush',
        data() {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                loading: false,
                activeCountry: 'MY',
                activeCountryName: '马来西亚',
                countryList: [],
                languageList: [],
                queryData: {
                    country: 'MY',
                    title: '',
                    content: '',
                    pushTaskCode: '',
                    pushType: '',
                    sendType: null,
                    createTimeList: [],
                    sendTimeList: [],
                    createTimeStart: '',
                    createTimeEnd: '',
                    sendTimeStart: '',
                    sendTimeEnd: '',
                    type: 1, // 1 任务， 2 记录
                    page: {
                        pageNum: 1,
                        pageSize: 20,
                        pagingSwitch: true
                    }
                },
                listType: 'task',
                tableData: [],
                totalCount: 0,
                pushChannelList: [
                    {
                        value: '1',
                        label: '站外+应用内'
                    }, {
                        value: '2',
                        label: '应用内'
                    }, {
                        value: '3',
                        label: '站外'
                    }
                ],
                pushTypeList: [
                    {
                        value: 'PROMOTION_CODE_SALE',
                        label: '促销活动'
                    }, {
                        value: 'PROMOTION_CODE_COUPON',
                        label: '优惠券'
                    }, {
                        value: 'PROMOTION_CODE_MEMBER_ACTIVITY',
                        label: '会员活动'
                    }
                ],
                statusList: [
                    {
                        value: 1,
                        label: '已发送'
                    }, {
                        value: 2,
                        label: '发送中'
                    }, {
                        value: 3,
                        label: '定时发送'
                    }
                ],
                pushSetting: {
                    country: 'MY',
                    countryName: '马来西亚',
                    pushChannel: '',
                    pushType: '',
                    pushPic: '',
                    redirect: '',
                    url: '',
                    sendType: '',
                    pushPlanTime: '',
                    pushLang: [],
                    redirect: 3
                },
                editDialogVisible: false,
                messageEditType: '',
                confirmVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                confirmType: '',
                pushTimeEditVisible: false,
                pushReceiverEditVisible: false,
                sentTime: '',
                currentRow: null,
                receiverModel: {
                    groupType: 1,
                    userLevel: [],
                    userId: '',
                    userGroupId: '',
                    idList: []
                },
                pushTimeSetting: {
                    sendTime: ''
                }
            }
        },
        components: {
            ConfirmDialog,
            MessagePushEditDialog,
            PushTimeEditDialog,
            PushReceiverEditDialog
        },
        created() {
            this.countryList = JSON.parse(this.getStore('countryList'))
            this.languageList = JSON.parse(this.getStore('languageList'))
        },
        mounted() {
            this.getPushTaskOrRecordList()
            this.getUserGroupInfo()
        },
        methods: {
            dropDown () {
                if (this.drop) {
                    this.dropDownContent = '展开'
                    this.dropDownIcon = 'el-icon-arrow-down'
                } else {
                    this.dropDownContent = '收起'
                    this.dropDownIcon = 'el-icon-arrow-up'
                }
                this.drop = !this.drop
            },
            getUserGroupInfo (val,userGroupId) {
                this.receiverModel.idList.splice(0)
                let params = {
                    userGroupName: val ? val : '',
                    userGroupType: '',
                    userGroupId,
                    page: {
                        pageNum: 1,
                        pageSize: 20,
                        pagingSwitch: true
                    }
                }
                GetUserGroupInfo(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        for (const iterator of res.userGroupInfo) {
                            this.receiverModel.idList.push({value: iterator.userGroupId,label:iterator.userGroupName})
                        }
                        console.log(this.receiverModel.idList)
                    }
                })
            },
            handleTabClick(val) {
                this.listType = 'task'
                this.pushSetting.country = val.name
                this.pushSetting.countryName = val.label
                this.queryData.country = val.name
                this.activeCountryName = val.label
                this.queryData.type = '1'
                this.getPushTaskOrRecordList()
            },
            search() {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.getPushTaskOrRecordList()
            },
            resetSearch() {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.queryData.createTimeStart = ''
                this.queryData.createTimeEnd = ''
                this.queryData.sendTimeStart = ''
                this.queryData.sendTimeEnd = ''
                this.$refs.messagePushForm.resetFields()
                this.getPushTaskOrRecordList()
            },
            handleCurrentChange(val) {
                this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum
                this.getPushTaskOrRecordList()
            },
            handleSizeChange(val) {
                this.queryData.page.pageSize = val
                this.getPushTaskOrRecordList()
            },
            handleRadioChange(val) {
                if (val === 'task') {
                    this.queryData.type = '1'
                } else {
                    this.queryData.type = '2'
                }
                this.getPushTaskOrRecordList()
            },
            getPushTaskOrRecordList() {
                this.loading = true
                let params = this.queryData
                if ( params.sendTimeList.length > 0) {
                    params.sendTimeStart = params.sendTimeList ? params.sendTimeList[0] + '' : null
                    params.sendTimeEnd = params.sendTimeList ? params.sendTimeList[1] + '': null
                }
                if ( params.createTimeList.length > 0) {
                    params.createTimeStart = params.createTimeList ? params.createTimeList[0] + '' : null
                    params.createTimeEnd = params.createTimeList ? params.createTimeList[1] + '': null
                }
                searchPushTaskOrRecord(this.filterData(params)).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.tableData = res.item
                        this.totalCount = res.total
                        this.getUserGroupInfo()
                        // _.forEach(this.tableData, row => {
                        //     // row.createTime = Number(row.createTime) + 8 * 60 * 60 * 1000
                        //     row.sentTime = Number(row.sentTime) + 8 * 60 * 60 * 1000
                        // })
                    }
                }).catch(err => {
                    this.loading = false
                    console.log(err)
                })
            },
            addMessagePush() {
                this.editDialogVisible = true
                this.messageEditType = 'add'
                _.forEach(this.languageList, item => {
                    this.$set(this.pushSetting, 'title'+item.code, '')
                    this.$set(this.pushSetting, 'content'+item.code, '')
                })
            },
            handleCancleEdit() {
                this.editDialogVisible = false
            },
            handleConfrimEdit(pushData) {
                this.editDialogVisible = false
                let params = pushData
                if (this.messageEditType === 'add') {
                    createPushTask(this.filterData(params)).then(res => {
                        this.$message.success('消息推送创建成功！')
                        this.getPushTaskOrRecordList()
                    }).catch(err => {
                        console.log(err)
                    })
                } else if (this.messageEditType === 'edit') {
                    let params = pushData
                    params.pushTaskCode = this.currentRow.pushTaskCode
                    editPushTask(this.filterData(params)).then(res => {
                        this.$message.success('消息推送编辑成功！')
                        this.getPushTaskOrRecordList()
                    }).catch(err => {
                        console.log(err)
                    })
                }
            },
            handleCancleConfirm() {
                this.confirmVisible = false
            },
            handleConfirm() {
                this.confirmVisible = false
                let paramsData = {}
                switch (this.confirmType) {
                    case 'sendNow':
                        paramsData = {
                            pushTaskCode: this.currentRow.pushTaskCode,
                            sendType: 1
                        }
                        this.sendPushRequest(paramsData)
                        break
                    case 'delPush':
                        paramsData = {
                            pushTaskCode: this.currentRow.pushTaskCode
                        }
                        this.deletePushTaskRequest(paramsData)
                        break
                    case 'cancelTiming':
                        paramsData = {
                            pushTaskCode: this.currentRow.pushTaskCode
                        }
                        this.cancelTimingTaskRequest(paramsData)
                        break
                    case 'sendTiming':
                        paramsData = {
                            pushTaskCode: this.currentRow.pushTaskCode
                        }
                        this.sendTimingTaskNowRequest(paramsData)
                        break

                }
            },
            handleCommand(command) {
                if (command === 'sendNow') {
                    this.confirmVisible = true
                    this.confirmDialogTitle = '发送后将无法撤回'
                    this.confirmDialogText = '是否确认发送'
                    this.confirmType = 'sendNow'
                } else if (command === 'sendTimer') {
                    this.pushTimeEditVisible = true
                }
            },
            sendOption(row) {
                this.currentRow = row
            },
            handleRecordCommand(command) {
                if (command === 'cancelTiming') {
                    this.confirmVisible = true
                    this.confirmDialogTitle = '撤销定时发送，该条推送将移至记录中'
                    this.confirmDialogText = '是否确认撤销'
                    this.confirmType = 'cancelTiming'
                } else if (command === 'sendTiming') {
                    this.confirmVisible = true
                    this.confirmDialogTitle = '发送后将无法撤回'
                    this.confirmDialogText = '是否确认发送'
                    this.confirmType = 'sendTiming'
                }
            },
            editPush(row, type) {
                this.currentRow = row
                this.messageEditType = type
                this.editDialogVisible = true
                this.pushSetting.pushChannel = row.pushChannel
                this.pushSetting.pushType = row.pushType
                this.pushSetting.pushPic = row.pushPic
                this.pushSetting.redirect = row.redirect
                if (row.redirect === 2) {
                    this.pushSetting.actionType = row.redirectParam
                } else if (row.redirect === 1) {
                    this.pushSetting.url = row.redirectParam
                }
                _.forEach(this.languageList, item => {
                    this.$set(this.pushSetting, 'title'+item.code, '')
                    this.$set(this.pushSetting, 'content'+item.code, '')
                })
                _.forEach(row.itemLang, item => {
                    this.$set(this.pushSetting, 'title'+item.language, item.title)
                    this.$set(this.pushSetting, 'content'+item.language, item.content)
                })
            },
            handleCancleEditTime() {
                this.pushTimeEditVisible = false
            },
            handleConfirmEditTime(data) {
                this.pushTimeEditVisible = false
                let paramsData = {
                    pushTaskCode: this.currentRow.pushTaskCode,
                    sendType: 2,
                    sendTime: data.sendTime + ''
                }
                this.sendPushRequest(paramsData)
            },
            setReceiver(row){
                this.currentRow = row
                this.pushReceiverEditVisible = true
                this.receiverModel.groupType = row.groupType

                if (row.groupType === 2) {
                    this.receiverModel.userLevel = row.userLevel
                } else if (row.groupType === 3) {
                    this.receiverModel.userId = row.userId.toString()
                } else if (row.groupType === 4) {
                    this.receiverModel.userGroupId = row.userGroupId
                    this.getUserGroupInfo('',row.userGroupId)
                }
            },
            handleCancleEditReceiver() {
                Object.assign(this.receiverModel,{
                    groupType: 1,
                    userLevel: [],
                    userId: '',
                    userGroupId: '',
                    idList: []
                })
                this.pushReceiverEditVisible = false
                this.getUserGroupInfo()
            },
            handleConfirmEditReceiver(data) {
                this.pushReceiverEditVisible = false
                let params = {
                    pushTaskCode: this.currentRow.pushTaskCode,
                    groupType: data.groupType
                }
                if (data.groupType === 2) {
                    params.userLevel = data.userLevel
                }
                if (data.groupType === 3) {
                    params.userId = data.userId.split(',')
                }
                if (data.groupType === 4) {
                    params.userGroupId = data.userGroupId
                }
                editUserGroup(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('接收用户设置成功')
                        this.getPushTaskOrRecordList()
                        Object.assign(this.receiverModel,{
                            groupType: 1,
                            userLevel: [],
                            userId: '',
                            userGroupId: '',
                            idList: []
                        })
                        this.getUserGroupInfo()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            sendPushRequest(data) {
                let params = data
                sendPush(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('消息推送发送成功')
                        this.getPushTaskOrRecordList()
                    }
                })
            },
            delPushTask(row) {
                this.currentRow = row
                this.confirmVisible = true
                this.confirmDialogTitle = '删除后将无法恢复'
                this.confirmDialogText = '是否确认删除'
                this.confirmType = 'delPush'
            },
            deletePushTaskRequest(data) {
                let params = data
                deletePushTask(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('消息推送删除成功')
                        this.getPushTaskOrRecordList()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            cancelTimingTaskRequest(data) {
                let params = data
                cancelTimingTask(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('定时消息推送撤销成功')
                        this.getPushTaskOrRecordList()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            sendTimingTaskNowRequest(data) {
                let params = data
                sendTimingTaskNow(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('消息推送发送成功')
                        this.getPushTaskOrRecordList()
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .sub-operate {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        .tip {
            line-height: 36px;
            color: red;
            font-size: 14px;
        }
    }
    .send-push {
        color: #409EFF;
        font-size: 12px;
        font-weight: 500;
        margin-right: 8px;
    }
</style>

