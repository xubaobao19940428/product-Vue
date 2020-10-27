<template>
    <div class="app-container detail-wrap">
        <div class="title">
            {{!taskId ? "新建" : addType == "copy" ? "新建" : "编辑"}}任务
            <span>{{taskType == "timing" ? "定时型" : "周期型"}}任务</span>
        </div>
        <div class="filter-container">
            <el-form inline :model="baseFormData">
                <el-form-item required label="任务名称：" class="filter-item">
                    <el-input
                        v-model="baseFormData.taskName"
                        placeholder="请输入"
                        size="medium"
                        style="width: 200px"
                    ></el-input>
                </el-form-item>
                <el-form-item required label="任务国家：" class="filter-item">
                    <el-select
                        v-model="baseFormData.taskCountry"
                        placeholder="请选择"
                        size="medium"
                        style="width: 200px"
                        @change="changeExecuteTime"
                    >
                        <el-option label="马来西亚" value="MY"></el-option>
                        <el-option label="泰国" value="TH"></el-option>
                        <el-option label="新加坡" value="SG"></el-option>
                        <el-option label="印度尼西亚" value="ID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item required label="目标用户组：" class="filter-item">
                    <el-select
                        v-model="baseFormData.userGroupId"
                        placeholder="请选择"
                        size="medium"
                        style="width: 200px"
                        filterable
                        remote
                        reserve-keyword
                        :remote-method="getGetUserGroupInfo"
                        @change="changeUserGroup"
                    >
                        <el-option
                            v-for="item in userGroupIdOption"
                            :key="item.userGroupId"
                            :label="item.userGroupName"
                            :value="item.userGroupId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <br />
                <el-form-item
                    required
                    label="任务执行时间："
                    class="filter-item"
                    v-if="taskType == 'timing'"
                >
                    <el-date-picker
                        v-model="baseFormData.executionTime"
                        placeholder="请选择"
                        size="medium"
                        style="width: 200px"
                        type="datetime"
                        value-format="timestamp"
                        @change="changeExecuteTime"
                        :picker-options="pickerOptions"
                    ></el-date-picker>
                    <span class="tip">（ 对应国家执行时间 {{baseFormData.executionTime ? nationTime : ""}} ）</span>
                </el-form-item>
                <el-form-item
                    required
                    label="任务生效周期："
                    class="filter-item"
                    v-if="taskType == 'period'"
                >
                    <el-date-picker
                        v-model="baseFormData.periodExecuteTime"
                        start-placeholder="请选择"
                        end-placeholder="请选择"
                        size="medium"
                        type="datetimerange"
                        value-format="timestamp"
                        @change="changeExecuteTime"
                        :picker-options="pickerOptions"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    required
                    label="生效时间："
                    class="filter-item"
                    v-if="taskType == 'period'"
                    style="display: block;"
                >
                    <el-select
                        v-model="periodUnit"
                        placeholder="请选择"
                        size="medium"
                        style="width: 100px; margin-right: 5px;"
                    >
                        <el-option label="每天" value="day"></el-option>
                        <el-option label="每周" value="week"></el-option>
                        <el-option label="每月" value="month"></el-option>
                    </el-select>
                    <el-select
                        v-model="validCron.week"
                        placeholder="请选择"
                        size="medium"
                        style="width: 100px; margin-right: 5px;"
                        v-if="periodUnit == 'week'"
                    >
                        <el-option label="一" value="2"></el-option>
                        <el-option label="二" value="3"></el-option>
                        <el-option label="三" value="4"></el-option>
                        <el-option label="四" value="5"></el-option>
                        <el-option label="五" value="6"></el-option>
                        <el-option label="六" value="7"></el-option>
                        <el-option label="日" value="1"></el-option>
                    </el-select>
                    <el-select
                        v-model="validCron.month"
                        placeholder="请选择"
                        size="medium"
                        style="width: 100px; margin-right: 5px;"
                        v-if="periodUnit == 'month'"
                    >
                        <el-option v-for="item in days" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                    <span v-if="periodUnit == 'month'">日&nbsp;</span>
                    <el-select
                        v-model="validCron.hour"
                        placeholder="请选择"
                        size="medium"
                        style="width: 100px; margin-right: 5px;"
                    >
                        <el-option v-for="item in hours" :key="item" :label="item" :value="item"></el-option>
                    </el-select>时&nbsp;
                    <el-select
                        v-model="validCron.minute"
                        placeholder="请选择"
                        size="medium"
                        style="width: 100px; margin-right: 5px;"
                    >
                        <el-option v-for="item in minutes" :key="item" :label="item" :value="item"></el-option>
                    </el-select>分
                </el-form-item>
            </el-form>
        </div>
        <channel
            ref="channel"
            :check="checkData"
            :pushData="pushData"
            :messageData="messageData"
            :emailData="emailData"
        />
        <controller
            ref="controller"
            :check="checkData"
            :datas="controllerData"
            :unit="controllerUnit"
            :showUpload="showUpload"
        />
        <div class="action-box">
            <el-button type="primary" @click="submit">保存</el-button>
            <el-button @click="() => { $router.go(-1); }">取消</el-button>
        </div>
    </div>
</template>
<script>
import moment from "moment";
import Channel from "./Channel";
import Controller from "./Controller";
import { addTask, updateTask, queryTaskDetail } from "@/request/strategy";
import { GetUserGroupInfo } from "@/request/pushtask";
export default {
    name: "strategyTaskDetail",
    data() {
        return {
            strategyCode: "",
            taskType: "", //任务类型
            taskCode: "",
            addType: "",
            baseFormData: {
                taskName: "", //任务名称
                taskCountry: "", //任务国家
                userGroupId: "", //用户组
                userGroupName: "", //用户组名称
                executionTime: "", //任务执行时间
                periodExecuteTime: "", //周期生效时间
            }, //任务基本信息
            periodUnit: "", //周期单位
            validCron: {
                week: "一", //周期选择 - 星期x
                month: 1, //周期选择 - 日
                hour: 22, //周期选择 - 时
                minute: "00", //周期选择 - 分
            },
            userGroupIdOption: [], //用户组枚举
            nationTime: "",
            pickerOptions: {
                //任务执行时间控制选项
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            },
            days: Array.from(Array(31), (val, key) => {
                let res = "";
                let h = key + 1;
                res = h < 10 ? "0" + h : h;
                return res;
            }), //天
            hours: Array.from(Array(24), (val, key) => {
                let res = "";
                res = key < 10 ? "0" + key : key;
                return res;
            }), //时
            minutes: Array.from(Array(60), (val, key) => {
                let res = "";
                res = key < 10 ? "0" + key : key;
                return res;
            }), //分
            pushData: null, //推送数据
            messageData: null, //短信数据
            emailData: null, // 邮件数据
            controllerData: null, //发送控制数据
            controllerUnit: null, //发送频次单位
            showUpload: true, //显示upload组件
            taskStatus: 1, //任务状态，默认关闭
        };
    },
    components: {
        Channel,
        Controller,
    },
    mounted() {
        this.strategyCode = this.$route.query.strategyCode;
        this.taskType = this.$route.query.type;
        this.taskCode = this.$route.query.taskCode;
        this.addType = this.$route.query.edit;

        if (this.taskCode) {
            //请求任务详情
            this.showUpload = false;
            this.getDetailData();
        } else {
            this.getGetUserGroupInfo();
        }
    },
    methods: {
        //获得各个模块数据并提交
        submit() {
            const baseData = this.getBaseData(); //校验基本数据
            //不存在则终止
            if (!baseData) {
                return;
            }

            const channelData = this.$refs.channel.getChunkData(); //校验触达渠道数据
            //不存在则终止
            if (!channelData) {
                return;
            }

            const controllerData = this.$refs.controller.getChunkData(); //发送控制数据
            //不存在则终止
            if (!controllerData) {
                return;
            }

            // 删除多余字段
            if (channelData.pushSetting && channelData.pushSetting.appLink) {
                delete channelData.pushSetting.appLink;
            }

            //新增任务方法
            const addTasks = (params) => {
                params.strategyCode = this.strategyCode;
                addTask(params)
                    .then((res) => {
                        this.$message.success("操作成功");
                        this.$router.push({
                            path: "strategyTaskList",
                            query: {
                                strategyCode: this.strategyCode,
                            },
                        });
                    })
                    .catch((err) => {});
            };

            //编辑任务方法
            const edit = (params) => {
                params.strategyCode = this.strategyCode;
                params.taskCode = this.taskCode;
                updateTask(params)
                    .then((res) => {
                        this.$message.success("操作成功");
                        this.$router.push({
                            path: "strategyTaskList",
                            query: {
                                strategyCode: this.strategyCode,
                            },
                        });
                    })
                    .catch((err) => {});
            };

            const fetchData = (submitData) => {
                if (this.taskCode && this.addType != "copy") {
                    edit({ ...submitData, status: this.taskStatus }); //编辑时，增加任务状态
                } else {
                    addTasks(submitData);
                }
            };

            //判断任务类型：定时型任务timing 周期型任务period
            if (this.taskType == "timing") {
                //合并各个模块数据得到最终提交数据
                const submitData = {
                    ...baseData,
                    ...channelData,
                    ...controllerData,
                };

                fetchData(submitData); // 提交
            } else if (this.taskType == "period") {
                const validPeriodStartTime = baseData.periodExecuteTime[0]; //周期任务开始时间
                const validPeriodEndTime = baseData.periodExecuteTime[1]; //周期任务结束时间

                delete baseData.periodExecuteTime; //删除periodExecuteTime属性
                //合并各个模块数据得到最终提交数据
                const submitData = {
                    validPeriodStartTime,
                    validPeriodEndTime,
                    ...baseData,
                    ...channelData,
                    ...controllerData,
                };

                fetchData(submitData); // 提交
            }
        },
        //获取基本数据
        getBaseData() {
            const baseData = this.baseFormData; //基础数据
            const validCron = this.validCron;
            const isEmpty = (value) => !value; //是否为空
            const isLessNow = (value) => value <= Date.now(); //是否大于当前时间 + 10分钟

            //基本数据校验规则，校验字段和参数字段一致则进行校验，不存在则不校验
            const rules = {
                taskName: [
                    {
                        test: isEmpty,
                        errMsg: "请填写任务名称",
                    },
                ],
                taskCountry: [
                    {
                        test: isEmpty,
                        errMsg: "请选择任务国家",
                    },
                ],
                userGroupId: [
                    {
                        test: isEmpty,
                        errMsg: "请选择目标用户组",
                    },
                ],
            };

            //定时任务校验规则
            const timingRules = {
                executionTime: [
                    {
                        test: isEmpty,
                        errMsg: "请选择任务执行时间",
                    },
                    {
                        test: isLessNow,
                        errMsg: "任务执行时间必须大于当前时间",
                    },
                ],
            };

            let pass = true;

            baseData.taskType = this.taskType == "period" ? 2 : 1;
            //基本数据校验
            if (this.taskType == "timing") {
                delete baseData.periodExecuteTime;
                pass = this.checkData(baseData, { ...rules, ...timingRules });
            } else {
                delete baseData.executionTime;
                pass = this.checkData(baseData, {
                    ...rules,
                    periodExecuteTime: [
                        {
                            test: isEmpty,
                            errMsg: "请选择任务生效周期",
                        },
                    ],
                });

                if (!this.periodUnit) {
                    this.$message.error("请选择生效时间单位");
                    return false;
                }
            }

            switch (this.periodUnit) {
                case "day":
                    delete validCron.week;
                    delete validCron.month;
                    break;
                case "week":
                    delete validCron.month;
                    break;
                case "month":
                    delete validCron.week;
                    break;
                default:
                    break;
            }

            if (pass) {
                return this.periodUnit
                    ? { ...baseData, validCron: JSON.stringify(validCron) }
                    : baseData;
            } else {
                return false;
            }
        },
        //获得任务详情
        getDetailData() {
            queryTaskDetail({
                strategyCode: this.taskCode,
            })
                .then((res) => {
                    this.showUpload = true;
                    this.taskStatus = res.data.status;
                    this.setTaskDetail(res.data);
                })
                .catch((err) => {
                    this.showUpload = true; //接口请求失败
                });
        },
        //获得所有用户组信息
        getGetUserGroupInfo(query) {
            // TODO 分页
            GetUserGroupInfo({
                page: {
                    pageNum: 1,
                    pageSize: 500,
                    pagingSwitch: true
                },
                userGroupName: query
            }).then(res => {
                if (res.ret.errcode === 1) {
                    this.userGroupIdOption = res.userGroupInfo;
                    this.searchLoading = false;
                }
            });
        },
        //任务详情内容
        setTaskDetail(data) {
            this.getGetUserGroupInfo(data.userGroupName); //获取用户组
            this.baseFormData.taskName =
                this.addType == "copy" ? "" : data.taskName;
            this.baseFormData.taskCountry = data.taskCountry;
            this.baseFormData.userGroupId = data.userGroupId;
            this.baseFormData.userGroupName = data.userGroupName;

            if (this.taskType == "period" && data.validCron) {
                const validCron = JSON.parse(data.validCron);
                if (validCron.month) {
                    this.periodUnit = "month";
                } else if (validCron.week) {
                    this.periodUnit = "week";
                } else {
                    this.periodUnit = "day";
                }

                this.validCron = validCron;

                this.baseFormData.periodExecuteTime = [
                    data.validPeriodStartTime,
                    data.validPeriodEndTime,
                ];
            } else {
                this.baseFormData.executionTime = data.executionTime;
                this.changeExecuteTime();
            }
            // 渠道数据
            this.pushData = data.pushSetting;
            this.messageData = data.smsSetting;
            this.emailData = data.emailSetting;

            this.controllerData = data.pushFrequency;
            this.controllerUnit = data.frequencyUnit;
        },
        //修改任务执行时间
        changeExecuteTime() {
            const t = this.baseFormData.executionTime - 0;
            //泰国和印尼为东7区
            this.nationTime =
                this.baseFormData.taskCountry == "TH" ||
                this.baseFormData.taskCountry == "ID"
                    ? moment(t)
                          .utcOffset(7)
                          .format("YYYY-MM-DD HH:mm:SS")
                    : moment(t).format(
                          "YYYY-MM-DD HH:mm:SS"
                      );
        },
        //修改用户组
        changeUserGroup(val) {
            for (let i = 0; i < this.userGroupIdOption.length; i++) {
                const item = this.userGroupIdOption[i];
                if (item.userGroupId == val) {
                    this.baseFormData.userGroupName = item.userGroupName;
                    break;
                }
            }
        },
        /**
         * 验证表单填写是否符合规范
         * @param {*} params 检查参数
         * @param {*} rules 检查规则以及提示信息
         * rules: {
         *  key: [{
         *      test: testFn,    //校验函数，返回boolean
         *      errMsg: "校验提示"  //testFn函数结果为ture时提示内容
         *  }]
         * }
         */
        checkData(params, rules) {
            let errMsg = ""; //错误信息

            for (const key in params) {
                let flag = false;
                if (rules.hasOwnProperty(key)) {
                    for (let i = 0; i < rules[key].length; i++) {
                        flag = rules[key][i].test(params[key]);
                        if (flag) {
                            errMsg = rules[key][i].errMsg;
                            break; //结束内层循环
                        }
                    }
                }
                if (flag) {
                    break; //结束所有循环
                }
            }

            //提示错误信息
            if (errMsg) {
                this.$message.error(errMsg);
                return false;
            } else {
                return true;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.detail-wrap {
    margin-left: 20px;
}
.title {
    margin: 10px 0 20px 0;
    font-size: 20px;
    font-weight: 600;
    span {
        font-size: 14px;
        opacity: 0.5;
        margin-left: 10px;
    }
}
.tip {
    font-size: 14px;
    opacity: 0.5;
    margin-left: 10px;
}
.action-box {
    margin-top: 30px;
    padding-right: 80px;
    text-align: right;
}
</style>
