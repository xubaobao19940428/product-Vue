<template>
    <div class="raffle-operator-wrapper app-container">
        <div class="raffle-operator__header">
            <h5>{{ type === 'add' ? '新建抽奖' : '编辑抽奖'}}</h5>
        </div>

        <div class="raffle-operatore__content">
            <el-form :model="param" label-width="160px"
                label-position="right"
                ref="raffleForm"
                :rules="rules"
            >
                <el-card class="card-common">
                    <div class="title" slot="header">基本信息</div>
                    <el-form-item label="抽奖名称：" prop="luckDrawName">
                        <el-input placeholder="请输入抽奖名称" v-model="param.luckDrawName" style="width: 60%"></el-input>
                    </el-form-item>
                    <el-form-item label="活动国家：" class="is-required">
                        <el-select v-model="param.countryCode"
                                :disabled="type === 'edit'"
                                @change="handleCountryChange"
                                filterable>
                            <el-option v-for="item in countryList"
                                        :key="item.shortCode"
                                        :label="item.nameLocal"
                                        :value="item.shortCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动时间：" prop="startTime">
                        <el-date-picker type="datetimerange" value-format="timestamp"
                            style="width: 60%"
                            @change="setActivityTime"
                            start-placeholder="开始时间" end-placeholder="结束时间"
                            v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-form-item>
                </el-card>

                <el-card class="card-common">
                    <div class="title" slot="header">奖池设置</div>
                    <el-form-item label="奖池清单：" class="is-required">
                        <div class="tip">请将用户抽奖可能出现的所有结果（含未中奖的反馈）列举在下方；奖品清单允许修改且每次投放时系统将以最新为准</div>
                        <el-table
                            :data="param.luckPrizeInfo"
                            :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
                            border
                            :style="{width: '90%'}"
                            show-summary
                        >
                            <el-table-column key="1" label="奖品ID" align="center" prop="luckPrizeId"></el-table-column>
                            <el-table-column key="2" label="奖品名称" align="center">
                                <template slot-scope="scope">
                                    {{ getName(scope.row.luckPrizeName, 'cn') }}
                                </template>
                            </el-table-column>
                            <el-table-column key="3" label="奖品类型" align="center">
                                <template slot-scope="scope">
                                    {{ luckPrizeTypeMap[scope.row.luckPrizeType] }}
                                </template>
                            </el-table-column>
                            <el-table-column key="4" label="奖品数量" align="center">
                                <template slot-scope="scope">{{ scope.row.onceNumber }}</template>
                            </el-table-column>
                            <el-table-column key="5" label="抽中概率" align="center" prop="winningProbability">
                                <template slot-scope="scope">{{ scope.row.winningProbability + '%'}}</template>
                            </el-table-column>
                            <el-table-column key="6" label="操作" align="center" width="120px">
                                <template slot-scope="scope">
                                    <i class="el-icon-edit icon mr10" @click="handleEdit(scope.row, scope.$index)"></i>
                                    <i class="el-icon-close icon" @click="handleDelete(scope.$index)"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button type="text" @click="handleAdd">再加一种奖品</el-button>
                    </el-form-item>
                    <el-form-item label="投放频率：" class="is-required" prop="increaseValue">
                        <el-radio-group v-model="param.increaseFrequency">
                            <el-radio class="radio-line" :label="2">循环投放：指定时分，并按活动期内的自然天数循环投放</el-radio>
                            <el-radio class="radio-line" :label="1">定时投放：指定年月日及时分秒单次投放</el-radio>
                        </el-radio-group>

                        <div class="tip mt20">最多可设置5个阶梯，且优惠不叠加</div>
                        <!-- 定时投放的时间 -->
                        <ul v-show="param.increaseFrequency === 1">
                            <!-- 需要在活动时间内，没有选择活动时间的时候，这里的时间则不能勾选 -->
                            <li v-for="(item, index) in increaseList1" :key="index">
                                时刻{{ index+1 }} <el-date-picker
                                    v-model="item.time"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    size="medium"
                                    class="mrl16"
                                    :clearable="false"
                                    @change="(item, index) => handleIncreaseTimeChange(item, index)"
                                    :disabled="!(param.startTime && param.endTime)"
                                ></el-date-picker>
                                <el-button
                                    type="text"
                                    v-show="index === increaseList1.length - 1 && increaseList1.length < 5"
                                    @click="handleTimeAdd(1)">增加</el-button>
                                <el-button
                                    type="text"
                                    v-if="increaseList1.length > 1"
                                    @click="handleDelTime(1, index)">删除</el-button>
                            </li>
                        </ul>
                        <!-- 循环投放的时间 时分秒-->
                        <ul v-show="param.increaseFrequency === 2">
                            <li v-for="(item, index) in increaseList2" :key="index">
                                时刻{{ index + 1 }} <el-time-picker
                                    v-model="item.time"
                                    size="medium"
                                    class="mrl16"
                                    value-format="HH:mm:ss"
                                    :clearable="false"
                                ></el-time-picker>
                                <el-button
                                    v-show="index === increaseList2.length - 1 && increaseList2.length < 5"
                                    type="text"
                                    @click="handleTimeAdd(2)">增加</el-button>
                                <el-button
                                    type="text"
                                    v-if="increaseList2.length > 1"
                                    @click="handleDelTime(2, index)">删除</el-button>
                            </li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="投放方式：" class="is-required">
                        <el-radio-group v-model="param.increaseType">
                            <el-radio class="radio-line" :label="1">增量投放：每次投放新的奖品时不清空现有奖池</el-radio>
                            <el-radio class="radio-line" :label="2">清空投放：每次投放新的奖品时清空现有奖池</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-card>

                <el-card class="card-common">
                    <div class="title" slot="header">抽奖机会</div>
                    <el-form-item label="无条件机会：" class="is-required">
                        <el-radio-group v-model="param.freeType">
                            <el-radio class="radio-line highLH" :label="1">
                                每个用户ID <el-input-number :controls="false" :min="0" :max="1000" :precision="0" placeholder="抽奖机会" v-model="freeNumber1"></el-input-number> 次/每自然天
                            </el-radio>
                            <el-radio class="radio-line highLH" :label="2">
                                每个用户ID <el-input-number :controls="false" :min="0" :max="1000" :precision="0" placeholder="抽奖机会" v-model="freeNumber2"></el-input-number> 次（活动全程）
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="机会用光反馈：" class="is-required">
                        <div class="tip">指抽奖活动期间，无抽奖机会的用户尝试抽奖时，反馈给用户提醒文案；</div>
                        <el-radio-group v-model="param.zeroNumTipsType">
                            <el-radio class="radio-line" :label="1">弹窗</el-radio>
                            <el-form-item label="图片：" class="special-item" label-width="80px" prop="zeroList1">
                                <multi-lang-file-upload
                                    @setData="setImg"
                                    :propFileList="param.zeroList1"
                                    accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                            </el-form-item>
                            <el-form-item label="链接：" class="special-item" label-width="80px" prop="tipsUrl">
                                <el-input v-model="param.tipsUrl"></el-input>
                            </el-form-item>

                            <el-radio class="radio-line" :label="2">文案：
                                <el-select v-model="nameLang" style="width: 27%">
                                    <el-option v-for="(item) in languageList"
                                        :key="item.code"
                                        :label="item.desc"
                                        :value="item.code"
                                    ></el-option>
                                </el-select>
                                <div v-for="(item, index) in param.zeroList2" v-show="nameLang === item.languageCode" :key="item.languageCode" class="name-input">
                                    <el-form-item
                                        :prop="`zeroList2[${index}].name`"
                                        :rules="{ required: (item.languageCode == 'cn' || item.languageCode == 'en') && param.zeroNumTipsType == 2 ? true : false, message: '中英文必填', trigger: 'blur' }"
                                    >
                                        <el-input v-model="item.name" type="text" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </div>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- <el-form-item label="有条件机会：">
                        <el-checkbox-group v-model="param">
                            <el-checkbox label="">分享赠送</el-checkbox>
                        </el-checkbox-group>
                        <div class="sub-title">分享赠送</div>
                        <el-form-item label="机会上限：" class="special-item" label-width="100px">
                            每分享一次指定链接奖励1次，最多奖励每个用户ID <el-input-number :controls="false" :min="0" :max="1000" placeholder="抽奖机会"></el-input-number> 次/每自然天
                        </el-form-item>
                        <el-form-item label="分享链接：" class="special-item" label-width="100px">
                            <el-input type="textarea" placeholder="多个链接请用英文逗号,隔开" style="width: 60%"></el-input>
                        </el-form-item>
                        <el-form-item label="反馈弹框：" class="special-item" label-width="100px">
                            <multi-lang-file-upload
                                @setData="setImg"
                                accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                        </el-form-item>
                    </el-form-item> -->
                </el-card>
            </el-form>
        </div>

        <div class="raffle-operator__footer">
            <el-button @click="handleCancel" class="foot-btn">取消</el-button>
            <el-button type="primary" @click="handleSave" class="foot-btn" v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
        </div>

        <award-dialog
            :dialog-visible="awardShow"
            :awardData="awardData"
            :countryCode="param.countryCode"
            @close="awardShow = false"
            @save="handlePrizeItemSave"
            :awardType="awardType"
            :langTemplateList="langTemplateList"
        ></award-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import multiLangFileUpload from '@/components/multiLangFileUpload/'
import awardDialog from './components/awardDialog'
import { insertLuckDrawTemplate, updateLuckDrawTemplate, getLuckDrawTemplate } from '@/request/luckdraw'
import moment from 'moment'
import Sortable from 'sortablejs'
import _ from 'lodash'

export default {
    data () {
        return {
            type: '',
            param: {
                luckDrawName: '', // 抽奖名称
                countryCode: 'MY', // 活动国家
                luckPrizeInfo: [], // 奖池列表
                increaseFrequency: 1, // 投放频率
                increaseType: 1, // 投放类型
                freeType: 1, // 无条件抽奖类型 1 - N次/自然日 2 - N次/活动全程
                zeroNumTipsType: 2, // 机会用光提示类型 1 - 弹窗 2 - 文案
                tipsUrl: '', // 弹窗链接
                startTime: null,
                endTime: null,
                increaseValue: 'test', // 填充文案，避免一开始就提示报错
                zeroList2: [], // 机会用光 - 文案
                zeroList1: [], // 机会用光 - 图片链接
            },
            timeList: [],
            sortable: null,
            rules: {
                startTime: [{ required: true, message: '不能为空', trigger: 'change'} ],
                luckDrawName: [{ required: true, message: '不能为空', trigger: 'change' }],
                tipsUrl: [{
                    validator: (rule, value, callback) => {
                        if (this.param.zeroNumTipsType == 1) {
                            if (!value || !value.trim()) {
                                return callback(new Error('必填'))
                            } else {
                                return callback()
                            }
                        } else {
                           return callback()
                        }
                    }
                }],
                increaseValue: [{ required: true, message: '不能为空', trigger: 'change' }],
                zeroList1: [{
                    validator: (rule, value, callback) => {
                        if (this.param.zeroNumTipsType === 1) {
                            let exist = value.find(item => {
                                if (item.languageCode === 'cn' || item.languageCode === 'en') {
                                    return item.name
                                }
                            })
                            if (!exist) {
                                return callback(new Error('不能为空'))
                            } else {
                                return callback()
                            }
                        } else {
                            return callback()
                        }
                    },
                    trigger: 'blur'
                }]
            },
            luckPrizeTypeMap: {
                1: '优惠券',
                2: '奖品',
                3: '非奖品',
                4: '保险栓',
                5: '积分',
                6: '金币'
            },
            awardShow: false,
            awardType: 'add',
            awardData: {
                id: '',
                luckDrawId: '', //抽奖活动ID
                luckPrizeId: '', //奖品ID
                luckPrizeType: 1,
                luckPrizeName: [],
                image: '',
                dataList: [],
                onceNumber: 0, // 单次投放量
                pointsMax: '',
                pointsMin: '',
                winningProbability: 0, // 抽中概率
                winningTipsType: 1, // 1 - 弹窗 2 - 文案
                winningTipsUrl: '', // 弹窗链接
            },
            freeNumber1: 0,// 无条件抽奖次数 1 - N次/自然日
            freeNumber2: 0, // 无条件抽奖次数 2 - N次/活动全程
            increaseList1: [], // 定时投放的时间列表
            increaseList2: [], // 循环投放的时间列表
            nameLang: 'cn', // 机会用光 - 文案当前选中的语言
            fullscreenLoading: false,
            luckDrawId: '', // 抽奖活动id
            curEditPrizeIndex: -1,
        }
    },
    components: {
        multiLangFileUpload,
        awardDialog
    },
    created () {
        let query = this.$route.query || {}
        this.type = query.type
        if (query.id) {
            this.luckDrawId = query.id
            this.getDetail(query.id)
        } else {
            this.setAddData()
        }
    },
    mounted () {
        this.$nextTick(() => {
            let ele = this.$el.querySelector('.el-table__body-wrapper tbody')
            let self = this
            this.sortable = Sortable.create(ele, {
                ghostClass: 'sortable-raffle-ghost',
                onUpdate: ({ newIndex, oldIndex }) => {
                    let $li = ele.children[newIndex]
                    let $oldLi = ele.children[oldIndex]
                    // 先删除移动的节点
                    ele.removeChild($li)
                    // 再插入移动的节点到原有节点，还原了移动的操作
                    if (newIndex > oldIndex) {
                        ele.insertBefore($li, $oldLi)
                    } else {
                        ele.insertBefore($li, $oldLi.nextSibling)
                    }
                    let curRow = self.param.luckPrizeInfo.splice(oldIndex, 1)[0]
                    self.param.luckPrizeInfo.splice(newIndex, 0, curRow)
                }
            })
        })
    },
    computed: {
        ...mapState({
            countryList: state => state.dict.countryList,
            languageList: state => state.dict.languageList
        }),
        langTemplateList () {
            let temp = []
            for (let i = 0; i < this.languageList.length; i++) {
                let item = this.languageList[i]
                temp.push({
                    languageCode: item.code,
                    name: ''
                })
            }

            return temp
        },
        existSafeCatch () {
            let index = this.param.luckPrizeInfo.find(item => item.luckPrizeType === 4)

            return index !== -1
        }
    },
    methods: {
        handleCancel () {
            this.$router.push({
                name: 'raffleAssistant'
            })
        },
        onFillList (data) {
            const len = this.languageList.length
            if (data.length === len) return data

            let tempData = JSON.parse(JSON.stringify(data))
            for (let i = 0; i < len; i++) {
                let temp = this.languageList[i]
                let index = tempData.findIndex(item => item.languageCode === temp.code)
                if (index === -1) {
                    tempData.push({
                        languageCode: temp.code,
                        name: ''
                    })
                }
            }

            return tempData
        },
        // 国家修改了，则清掉积分部分
        handleCountryChange () {
            Object.assign(this.param, {luckPrizeInfo: []})
        },
        handleIncreaseTimeChange (item, index) {
            let startTime = parseInt(this.param.startTime)
            let endTime = parseInt(this.param.endTime)
            let tempDate = moment(item)
            if (tempDate < startTime || tempDate > endTime) {
                this.$message.error('当前时间不在活动时间范围内，请重新选择')
                this.increaseList1.splice(index, 1, [{time: ''}])
            }
        },
        setActivityTime () {
            this.timeList = this.timeList ? this.timeList : []
            this.param.startTime = !this.timeList[0] ? '' : this.timeList[0]
            this.param.endTime = !this.timeList[1] ? '' : this.timeList[1]
            if (!this.timeList.length) {
                this.increaseList1 = [{time: ''}]
            }
        },
        setAddData () {
            // 主要用于填补所需的初始数据 - 针对新增的时候, 还有默认填充保险栓的奖品
            this.$nextTick(() => {
                this.increaseList1 = [{time: ''}]
                this.increaseList2 = [{time: ''}]
                this.param.zeroList1 = JSON.parse(JSON.stringify(this.langTemplateList))
                this.param.zeroList2 = JSON.parse(JSON.stringify(this.langTemplateList))
            })
        },
        setItemData (data) {
            let increaseValue = data.increaseValue ? JSON.parse(data.increaseValue) : [{time: null}]
            increaseValue = increaseValue.map(item => {
                return {time: item}
            })
            if (!increaseValue || !increaseValue.length) {
                increaseValue = [{time: null}]
            }

            this.increaseList1 = data.increaseFrequency == 1 ? increaseValue : [{time: null}]
            this.increaseList2 = data.increaseFrequency == 2 ? increaseValue : [{time: null}]

            let tempTipsDesc = this.onFillList(data.tipsDesc) // 补充数据完整
            this.param.zeroList1 = data.zeroNumTipsType == 1 ? tempTipsDesc : JSON.parse(JSON.stringify(this.langTemplateList))
            this.param.zeroList2 = data.zeroNumTipsType == 2 ? tempTipsDesc : JSON.parse(JSON.stringify(this.langTemplateList))

            this.freeNumber1 = data.freeType == 1 ? data.freeNumber : []
            this.freeNumber2 = data.freeType == 2 ? data.freeNumber : []

            if (data.startTime && data.endTime) {
                this.timeList = [data.startTime, data.endTime]
            }
            delete data.tipsDesc
            delete data.freeNumber
            delete data.increaseValue

            Object.assign(this.param, data)
        },
        normalizeData () {
            let temp = JSON.parse(JSON.stringify(this.param))
            let timeList = this.timeList || []
            temp.freeNumber = this['freeNumber' + temp.freeType]
            temp.tipsDesc = temp['zeroList' + temp.zeroNumTipsType]
            delete temp.zeroList1
            delete temp.zeroList2
            temp.luckPrizeInfo = temp.luckPrizeInfo.map((item, index) => {
                item.sort = index + 1
                return item
            })
            temp = this.filterData(temp)
            return temp
        },
        checkData () {
            let tempParam = { ...this.param }
            let tag = true
            // 检查奖池里面保险栓的存在
            let existItems = tempParam.luckPrizeInfo.filter(item => item.luckPrizeType == 4)
            if (!existItems || existItems.length !== 1) {
                this.$message.error('须配置唯一一个保险栓')
                tag = false
            }

            return tag
        },
        handleSave () {
            let tempIncreaseList = this['increaseList' + this.param.increaseFrequency]
            let list = []
            tempIncreaseList.forEach(item => {
                if (item.time && !list.includes(item.time)) {
                    list.push(item.time)
                }
            })
            this.param.increaseValue = (list && list.length) ? JSON.stringify(list) : '' // 通过这个来设置时刻必选
            this.$refs['raffleForm'].validate((valid) => {
                if (!valid) {
                    this.$message.error('请先填写必填项')
                    return
                } else {
                    let tag = this.checkData()
                    if (!tag) return
                    let param = this.normalizeData()
                    this.fullscreenLoading = true
                    if (this.type === 'add') {
                        insertLuckDrawTemplate({luckDrawTemplate: param}).then(res => {
                            if (res.ret.errcode === 1) {
                                this.$message.success('添加成功')
                                this.$router.push({
                                    name: 'raffleAssistant'
                                })
                            }
                            this.fullscreenLoading = false
                        }).catch(err => {
                            this.fullscreenLoading = false
                        })
                    } else {
                        param.luckDrawId = this.luckDrawId
                        updateLuckDrawTemplate({luckDrawTemplate: param}).then(res => {
                            if (res.ret.errcode === 1) {
                                this.$message.success('修改成功')
                                this.$router.push({
                                    name: 'raffleAssistant'
                                })
                            }
                            this.fullscreenLoading = false
                        }).catch(err => {
                            console.error(err)
                            this.fullscreenLoading = false
                        })
                    }
                }
            })
        },
        setImg (data) {
            this.param.zeroList1 = data
        },
        getName (list, type) {
            if (!list || !list.length) return ''
            let item = null
            item = list.find(a => a.languageCode === 'cn')

            return item ? item.name : ''
        },
        handlePrizeItemSave (data) {
            if (this.awardType === 'edit') {
                this.param.luckPrizeInfo.splice(this.curEditPrizeIndex, 1, data.luckItem)
            } else {
                this.param.luckPrizeInfo.push(data.luckItem)
            }
            this.awardShow = false

            console.log(this.param.luckPrizeInfo)
        },
        handleEdit (row, index) {
            Object.assign(this.awardData, row)
            this.curEditPrizeIndex = index
            this.awardShow = true
            this.awardType = 'edit'
        },
        handleAdd () {
            let len = this.param.luckPrizeInfo.length
            if (len <= 50) {
                this.awardType = 'add'
                Object.assign(this.awardData, {
                    id: '',
                    luckDrawId: '', //抽奖活动ID
                    luckPrizeId: '', //奖品ID
                    luckPrizeType: 1,
                    luckPrizeName: [],
                    pointsMax: '',
                    pointsMin: '',
                    dataList: [],
                    image: '',
                    onceNumber: 0, // 单次投放量
                    winningProbability: 0, // 抽中概率
                    winningTipsType: 1, // 1 - 弹窗 2 - 文案
                    winningTipsUrl: '' // 弹窗链接
                })
                this.awardShow = true
            } else {
                this.$message.info('奖品不得超过50种')
            }
        },
        handleDelete (index) {
            this.$confirm('是否删除该奖品', '提示', {
                type: 'warning'
            }).then(() => {
                this.param.luckPrizeInfo.splice(index, 1)
            }).catch(() => {
                this.$message('已取消删除')
            })
        },
        getDetail (id) {
            getLuckDrawTemplate({luckDrawId: id}).then(res => {
                if (res.ret.errcode === 1) {
                    this.setItemData(JSON.parse(JSON.stringify(res.luckDrawInfo)))
                }
            })
        },
        handleTimeAdd (type) {
            if (type === 1) {
                this.increaseList1.push({time: null})
            } else {
                this.increaseList2.push({time: null})
            }
        },
        handleDelTime (type, index) {
            this.$confirm('是否删除该时刻', '提示', {
                type: 'warning'
            }).then(() => {
                // 表面上删除，还没有传递给后台
                if (type === 1) {
                    this.increaseList1.splice(index, 1)
                }  else {
                    this.increaseList2.splice(index, 1)
                }
            })
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
