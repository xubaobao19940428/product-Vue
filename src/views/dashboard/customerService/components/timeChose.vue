<template>
    <el-dialog
    title="提示"
    :visible.sync="toggle"
    width="30%"
    :before-close="cancle"
    class="time-dialog">
        <div>
            <el-date-picker
                class="statistic-time"
                v-model="dateRangeTwo" 
                type= "datetimerange"
                align="right"
                size="small"
                unlink-panels
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                :picker-options="pickerOptions"
                @change="handelDateTimeChange"
                disabledDate="disabledDate">
            </el-date-picker>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancle">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>

</template>
<script>
    export default {
        data () {
            return{
                dateRangeTwo: [],
                dateRangeTimeStamp: [moment(moment().subtract('days', 1).startOf('day').format('YYYY-MM-DD HH:mm:ss')).valueOf(), moment(moment().subtract('days', 1).endOf('day').format('YYYY-MM-DD HH:mm:ss')).valueOf()],
                pickerOptions: {
                    disabledDate: this.disabledDate,
                    shortcuts: [{
                        text: '昨日',
                        onClick(picker) {
                            const end = moment(new Date()).add(-1, 'days').format('YYYY-MM-DD');
                            const start = moment(new Date()).add(-1, 'days').format('YYYY-MM-DD');
                            console.log(end)
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '今日',
                        onClick(picker) {
                            const end = moment(new Date()).format('YYYY-MM-DD');
                            const start = moment(new Date()).format('YYYY-MM-DD');
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上周',
                        onClick(picker) {
                            const weekOfday = parseInt(moment().format('d')) // 计算今天是这周第几天  周日为一周中的第一天
                            const start = moment().subtract(weekOfday + 7, 'days').format('YYYY-MM-DD') // 周一日期
                            const end = moment().subtract(weekOfday + 1, 'days').format('YYYY-MM-DD') // 周日日期
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本周',
                        onClick(picker) {
                            let weekOfday = parseInt(moment().format('d')) // 计算今天是这周第几天 周日为一周中的第一天
                            let start = moment().subtract(weekOfday-1, 'days').format('YYYY-MM-DD') // 周一日期
                            let end = moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD') // 周日日期
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上月',
                        onClick(picker) {
                            let start = moment().subtract('month', 1).format('YYYY-MM') + '-01'
                            let end = moment(start).subtract('month', -1).add('days', -1).format('YYYY-MM-DD')
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本月',
                        onClick(picker) {
                            let start = moment().add('month', 0).format('YYYY-MM') + '-01'
                            let end = moment(start).add('month', 1).add('days', -1).format('YYYY-MM-DD')
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '去年',
                        onClick(picker) {
                            let start = moment().year(moment().year() -1).startOf('year')
                            let end = moment().year(moment().year() -1).endOf('year')
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '今年',
                        onClick(picker) {
                            let start = moment().startOf('year')
                            let end = moment().endOf('year')
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '过去7天',
                        onClick(picker) {
                          const end = new Date();
                          const start = new Date();
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                          picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '过去30天',
                        onClick(picker) {
                          const end = new Date();
                          const start = new Date();
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
                          picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上线至今',
                        onClick(picker) {
                          const end = new Date();
                          const start = moment('2018-12-26 00:00:00');
                          picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            timeMark:String,
            dateRangeVariousTimeStamp: Array
        },
        created() {
            this.dateRangeTwo = this.dateRangeVariousTimeStamp
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {}
            },
        },
        methods: {
            disabledDate (time) {
                if (this.timeMark === 'add' || this.timeMark === 'returns' || this.timeMark === 'cancles') {
                    // console.log(moment(time).format('YYYY-MM-DD') < moment('2020-04-18').format('YYYY-MM-DD'))
                    // console.log(moment(time).format('YYYY-MM-DD') > moment(new Date()).add(-1, 'days').format('YYYY-MM-DD'))
                    return moment(time).format('YYYY-MM-DD') < moment('2020-04-18').format('YYYY-MM-DD') || moment(time).format('YYYY-MM-DD') > moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')
                } else {
                    return moment(time).format('YYYY-MM-DD') > moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')
                }
            },
            cancle () {
                this.$emit('on-cancle')
            },
            confirm () {
                console.log(this.dateRangeTimeStamp)
                console.log(this.timeMark)
                this.$emit('on-confirms',this.timeMark, this.dateRangeTwo, this.dateRangeTimeStamp)
                
            },
            handelDateTimeChange (data) {
                console.log(data)
                this.dateRangeTwo = [moment(data[0]).format('YYYY-MM-DD HH:mm:ss'),moment(data[1]).format('YYYY-MM-DD HH:mm:ss')]
                console.log(this.dateRangeTwo)
                this.dateRangeTimeStamp[0] = this.dateRangeTwo[0].valueOf()
                this.dateRangeTimeStamp[1] = this.dateRangeTwo[1].valueOf()
                console.log(this.dateRangeTimeStamp)
            }
        }
    }
</script>
<style lang="scss">
    .time-dialog{
        .el-picker-panel{
            display: block;
            z-index: 2015;
            position: fixed;
            top: 241px;
            left: 121px;
        }
    }
</style>
<style lang="scss" scoped>
    .time-dialog{
        .statistic-time{
            cursor: pointer;
        }
    }
</style>
