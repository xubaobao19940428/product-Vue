<template>
    <div>
        <el-card class="batch-add-card">
            <div slot="header" class="clearfix">
                <span>团队统计下载</span>
                <span class="batch-add-span">可下载今日之前数据(不包括今日)</span>
            </div>
            <div class="block">
                <el-date-picker
                    v-model="value"
                    :picker-options='pickerOptions'
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
                <el-button type="primary" class="batch-add-money" @click="downloadTemp" style="margin-left: 20px">统计数据下载</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: 'downloadTeamStatistics',
        data () {
            return {
                value: '',
                url: '',
                // 限制今日之前不可选
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() > Date.now()
                    }
                }
            }
        },
        methods: {
            // 时间转换格式
            formatDateTime (inputTime) {
                var date = new Date(inputTime)
                var y = date.getFullYear()
                var m = date.getMonth() + 1
                m = m < 10 ? ('0' + m) : m
                var d = date.getDate()
                d = d < 10 ? ('0' + d) : d
                return y + '-' + m + '-' + d
            },
            downloadTemp () {
                let url = `https://file.fingo.shop/fingo/member/teams/user_team_${this.formatDateTime(this.value)}.xlsx`
                window.open(`${url}`)
                this.value = ''
            }

        }
    }
</script>

<style lang="scss" scoped>
    .batch-add-span{
        color: red;
        margin-left: 30px;
        font-size: 14px
    }
    .batch-add-card {
        margin-bottom: 20px;
    }
    .import-tips {
        color: red;
        font-size: 14px;
    }
</style>
