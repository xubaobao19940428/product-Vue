<template>
    <div class="by-group">
        <div class="title">{{ editType === 'add' ? '创建' : '编辑' }}用户分群</div>
        <div class="name">
            <div class="operate-title">用户组名称：</div>
            <el-input v-model="queryData.userGroupName" placeholder="输入名称"></el-input>
        </div>
        <!-- <div class="base-attribute">基本属性</div> -->
        <!-- <el-form inline :model="queryData">
            <el-form-item prop="countryCode" label="注册国家：" class="filter-item">
                <el-select v-model="queryData.countryCode" placeholder="请选择" filterable clearable multiple>
                    <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameCn" :value="item.shortCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="level" label="会员等级：" class="filter-item">
                <el-select v-model="queryData.level" placeholder="请选择" filterable clearable multiple>
                    <el-option v-for="item in levelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form> -->
        <!-- {{userGroup}} -->
        <div class="custom-filter">
            <div class="filter">自定义筛选<i class="iconfont" @click="customerClick">&#xe60e;</i><span class="prompt">点击按钮添加用户属性组合</span></div>
            <div v-for="(val,index) in userGroup" :key="index" class="group-top">
                <div v-if="index !== 0" class="and">和</div>
                <div v-for="(item,i) in val" :key="i" class="group-box">
                    <div v-if="i !== 0" class="or">或</div>
                    <div class="group-content">
                        <el-tooltip effect="dark" :content="item.desc" placement="top">
                            <div class="user-attribute">{{ '{' + item.name + '}' }}</div>
                        </el-tooltip>
                        <el-select v-if="item.type === 'INT' || item.type === 'FLOAT'" v-model="item.operationSign" placeholder="请选择" size="small" filterable clearable class="chose">
                            <el-option v-for="item in sortList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-select v-if="item.type === 'VARCHAR'" v-model="item.operationSign" placeholder="请选择" size="small" filterable clearable class="chose">
                            <el-option v-for="item in varCharList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-select v-if="item.type === 'DATETIME'" v-model="item.operationSign" placeholder="请选择" size="small" filterable clearable class="chose">
                            <el-option v-for="item in dataTimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-input v-if="item.type === 'INT' || item.type === 'FLOAT' || (item.type === 'DATETIME' && (item.operationSign === 'WITHIN_X_DAYS' || item.operationSign === 'X_DAYS_OR_BEFORE'))" v-model="item.value" placeholder="请输入内容" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" class="chose" size="small"></el-input>
                        <el-date-picker v-if="item.type === 'DATETIME' && (item.operationSign === '>' || item.operationSign === '<')" v-model="item.value" type="datetime" placeholder="选择日期" class="chose" size="small" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        <el-select v-if="item.type === 'VARCHAR' && (item.operationSign === '=' || item.operationSign === '!=')" v-model="item.value" placeholder="请选择" size="small" filterable clearable class="chose">
                            <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameCn" :value="item.shortCode"></el-option>
                        </el-select>
                    </div>
                    <div class="opertae-icon">
                        <!-- <i class="iconfont" @click="deleteClick(index,i)">&#xe60b;</i>
                        <i class="iconfont" @click="addClick(index,i)">&#xe721;</i>
                        <i class="iconfont" @click="customerClick">&#xe60e;</i> -->
                        <img src="../../../../assets/img/deleted.png" @click="deleteClick(index,i)"/>
                        <img src="../../../../assets/img/or.png" @click="addClick(index,i)"/>
                        <img src="../../../../assets/img/and.png" @click="customerClick"/>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="userGroup.length !== 0" class="footer">
            <div>
                <el-button type="primary" :loading="outLoading" @click="groupIdToExcel">导出</el-button> 
                <el-button class="cancel-btn" :loading="loading" @click="groupIdTotal">统计</el-button>
                <span v-if="count !== ''">共 {{ count }} 人</span>
            </div>
            <div>
                <el-button type="primary" plain :loading="addLoading" @click="saveGroup">保存</el-button> 
                <el-button class="cancel-btn" @click="cancel">取消</el-button>
            </div>
        </div>
        <user-attribute-filter v-if="dialogVisible" :dialogVisible="dialogVisible" :mark="mark" @on-cacel="cancelDialog" @on-confirm="confirmDialog"></user-attribute-filter>
    </div>
</template>
<script>
    import { AddUserGroupByGroup, EditUserGroupInfo, GetUserIdsCountOnEditPage, GetUserIdsExcelOnEditPage } from '@/request/pushtask'
    import userAttributeFilter from './userAttributeFilter'

    export default {
        data () {
            return {
                editType: '',
                queryData: {
                    userGroupName: '',
                    userGroupType: '',
                    countryCode: [],
                    level: []
                },
                levelList: [{
                    value: 2,
                    label: 'SH'
                },
                {
                    value: 3,
                    label: 'PS'
                },
                {
                    value: 4,
                    label: 'AM'
                },
                {
                    value: 5,
                    label: 'AT'
                }],
                sortList: [{
                    value: '=',
                    label: '等于'
                },{
                    value: '>',
                    label: '大于'
                },{
                    value: '>=',
                    label: '大于等于'
                },{
                    value: '<',
                    label: '小于'
                },{
                    value: '<=',
                    label: '小于等于'
                },{
                    value: 'IS NOT NULL',
                    label: '存在'
                },{
                    value: 'IS NULL',
                    label: '不存在'
                }],
                varCharList:[{
                    value: '=',
                    label: '等于'
                },{
                    value: '!=',
                    label: '不等于'
                },{
                    value: 'IS NOT NULL',
                    label: '存在'
                },{
                    value: 'IS NULL',
                    label: '不存在'
                }],
                dataTimeList:[{
                    value: '>',
                    label: '大于'
                },{
                    value: '<',
                    label: '小于'
                },{
                    value: 'IS NOT NULL',
                    label: '存在'
                },{
                    value: 'IS NULL',
                    label: '不存在'
                },{
                    value: 'WITHIN_X_DAYS',
                    label: '在...天内'
                },{
                    value: 'X_DAYS_OR_BEFORE',
                    label: '在...天前'
                }],
                dialogVisible: false,
                userGroup: [],
                mark:'father',
                index:-1,
                count: '',
                loading: false,
                outLoading: false,
                addLoading: false
            }
        },
        components: {
            userAttributeFilter
        },
        mounted() {
            console.log(this.$route.query)
            this.editType = this.$route.query.editType
            if (this.$route.query.data) {
                this.queryData.userGroupType = this.$route.query.data.userGroupType
                this.queryData.userGroupName = this.$route.query.data.userGroupName
                let data = this.$route.query.data.userGroupAnd.userGroupOr
                for (const iterator of data) {
                    this.userGroup.push(iterator.condition)
                }
            }
        },
        computed:{
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
            }
        },
        methods: {
            customerClick () {
                this.mark = 'father'
                this.dialogVisible = true
            },
            deleteClick (index,i) {
                this.userGroup[index].splice(i,1)
                for (let j = 0; j < this.userGroup.length; j++) {
                    if (this.userGroup[j].length === 0) {
                        this.userGroup.splice(j,1)
                    }
                }
            },
            addClick (index,i) {
                this.index = index
                this.mark = 'son'
                this.dialogVisible = true
            },
            cancelDialog () {
                this.dialogVisible = false
            },
            confirmDialog (type,name,desc,key,mark) {
                console.log(type,mark)
                this.dialogVisible = false
                if (this.mark === 'father') {
                    if (type === 'INT' || type === "FLOAT") {
                        this.userGroup.push([{
                            name:name,
                            type:type,
                            desc:desc,
                            operationSign:'',
                            value: '',
                            key: key
                        }])
                    } else if (type === 'VARCHAR') {
                        this.userGroup.push([{
                            name:name,
                            type:type,
                            desc:desc,
                            operationSign:'',
                            value: '',
                            key: key
                        }])
                    } else if (type === 'DATETIME') {
                        this.userGroup.push([{
                            name:name,
                            type:type,
                            desc:desc,
                            operationSign:'',
                            value: '',
                            key: key
                        }])
                    }
                } else if (this.mark === 'son') {
                    if (type === 'INT' || type === "FLOAT") {
                        this.userGroup[this.index].push({
                            name:name,
                            type:type,
                            desc:desc,
                            operationSign:'',
                            value: '',
                            key: key
                        })
                    } else if (type === 'VARCHAR') {
                        this.userGroup[this.index].push({
                            name:name,
                            type:type,
                            desc:desc,
                            operationSign:'',
                            value: '',
                            key: key
                        })
                    } else if (type === 'DATETIME') {
                        this.userGroup[this.index].push({
                            name:name,
                            type:type,
                            desc:desc,
                            operationSign:'',
                            value: '',
                            key: key
                        })
                    }
                }
                console.log(this.userGroup)
            },
            cancel () {
                this.$router.push({
                    name: 'userGrouping'
                })
            },
            saveGroup () {
                this.addLoading = true
                console.log('saveGroup')
                if (this.editType === 'add') {
                    let user = []
                    for (const iterator of this.userGroup) {
                        user.push({
                            condition:iterator
                        })
                    }
                    let params = {
                        userGroupName: this.queryData.userGroupName,
                        userGroupAnd:{
                            userGroupOr:user
                        }
                    }
                    AddUserGroupByGroup(params).then(res => {
                        if (res.ret.errcode === 1) {
                            console.log(res)
                            this.$router.push({
                                name: 'userGrouping'
                            })
                        }else {
                            this.addLoading = true
                            let time = setTimeout(() => {
                                this.addLoading = false   
                            }, 1500);
                        }
                    }) 
                } else {
                    let user = []
                    for (const iterator of this.userGroup) {
                        user.push({
                            condition:iterator
                        })
                    }
                    let params = {
                        userGroupId: this.$route.query.data.userGroupId,
                        userGroupName: this.queryData.userGroupName,
                        userGroupType: this.queryData.userGroupType,
                        userGroupAnd:{
                            userGroupOr:user
                        }
                    }
                    EditUserGroupInfo(params).then(res => {
                        if (res.ret.errcode === 1) {
                            this.addLoading = false
                            this.$router.push({
                                name: 'userGrouping'
                            })
                        }
                    })
                }
            },
            groupIdToExcel () {
                this.outLoading = true
                let user = []
                for (const iterator of this.userGroup) {
                    user.push({
                        condition:iterator
                    })
                }
                GetUserIdsExcelOnEditPage({userGroupAnd:{userGroupOr:user}}).then(res=>{
                    this.outLoading = false
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        window.open(this.dealShowFileSrc(res.url))
                    }
                })
            },
            groupIdTotal () {
                this.loading = true
                let user = []
                for (const iterator of this.userGroup) {
                    user.push({
                        condition:iterator
                    })
                }
                GetUserIdsCountOnEditPage({userGroupAnd:{userGroupOr:user}}).then(res=>{
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.loading = false
                        this.count = res.count
                    }
                })
            }
        }
    }
</script>
<style lang="scss">
    .by-group{
        .el-input{
            width: 200px;
        }
    }
</style>
<style lang="scss" scoped>
    .by-group{
        height: 100%;
        position: relative;
        overflow: scroll;
        .title{
            margin: 10px 0 20px 0;
            font-size: 20px;
            font-weight: 600;
        }
        .name{
            display: flex;
            .operate-title{
                height: 40px;
                line-height: 40px;
                text-align: center;
            }
        }
        .base-attribute{
            margin: 10px 0 20px 0;
            font-size: 18px;
            font-weight: 600;
        }
        .custom-filter{
            .filter{
                margin: 10px 0 20px 0;
                font-size: 18px;
                font-weight: 600; 
            }
            .iconfont{
                font-size: 24px;
                font-weight: 300;
                margin-left: 10px;
                margin-right: 20px;
                cursor: pointer;
            }
            .prompt{
                font-size: 14px;
                color: rgb(161,161,161)
            }
        }
        .and{
            position: absolute;
            top: -32px;
            width: 100%;
            text-align: center;
            font-weight: 500;
        }
        .or{
            position: absolute;
            top: -9px;
            left: 49.5%;
        }
        .group-top{
            position: relative;
            width: 80%;
            margin: 55px 0px;
            border: 0.5px solid rgb(193,193,193);
            border-radius: 5px;
        }
        .group-box{
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border-bottom: 0.5px solid rgb(212,215,224);

        }
        .group-content{
            display: flex;
            align-items: center;
            .user-attribute{
                width: 250px;
                height: 40px;
                line-height: 40px;
                margin-right: 10px;
                text-align: center;
            }
            
            .chose{
                margin: 0px 10px;
            }
        }
        .opertae-icon{
            display: flex;
            align-items: center;
            img{
                width: 24px;
                margin-right: 5px;
                cursor: pointer;
            }
        }
        .footer{
            position: absolute;
            width: 100%;
            display: flex;
            justify-content: space-between;
            .cancel-btn{
                margin-right: 70px;
            }
        }
    }
</style>