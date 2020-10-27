<template>
    <el-card class="data-card">
        <div>
            <p class="title">{{cardInfo.title}}</p>
            <el-tooltip class="item" effect="dark" :content="cardInfo.desc" placement="top">
                <i class="el-icon-warning-outline"></i>
            </el-tooltip>
        </div>
        <div class="time-info">
            {{cardDataModel.time || '-'}} | {{cardDataModel.timeText || '-'}}
        </div>
        <div class="detail-data">
            {{cardDataModel.volume || '-'}} <span>{{cardInfo.unit || '-'}}</span>
        </div>
        <!-- <div class="compare-data">
            周同比
            <div class="triangle-up" v-if="cardDataModel.weeklyChange > 0"></div>
            <div class="triangle-down" v-if="cardDataModel.weeklyChange < 0"></div>
            <span>{{cardDataModel.weeklyChange| toDecimal2}}%</span>
            日环比 <div class="triangle-up" v-if="cardDataModel.dailyChange > 0"></div>
            <div class="triangle-down" v-if="cardDataModel.dailyChange < 0"></div>
            <span>{{cardDataModel.dailyChange | toDecimal2 }}%</span>
        </div> -->
    </el-card>
</template>

<script>

export default {
    props: {
        cardInfo: {
            type: Object,
            default: () => { return {} }
        },
        cardData: {
            type: Object,
            default: () => { return {} }
        }
    },
    data() {
        return {
        }
    },
    computed: {
        cardDataModel() {
            return this.cardData
        }
    },
    filters: {
        toDecimal2: function(x) {
            var f = parseFloat(x);
            if (isNaN(f)) {
                return '';
            }
            var f = Math.round(x * 100) / 100;
            var s = f.toString();
            var rs = s.indexOf('.');
            if (rs < 0) {
                rs = s.length;
                s += '.';
            }
            while (s.length <= rs + 2) {
                s += '0';
            }
            return Math.abs(s);
        }
    }
}
</script>

<style lang="scss">
.data-card {
    .el-card__body {
        padding: 14px;
    }
}
</style>

<style lang="scss" scoped>
    .data-card {
        .title {
            display: inline-block;
            width: 90%;
            color: #1b2027;
            font-size: 18px;
        }
        .time-info {
            font-weight: 400;
            font-size: 14px;
            color: #5a5a5a
        }
        .detail-data {
            // padding: 10px 0;
            color: #1b2027;
            font-size: 34px;
            font-weight: 600;
            span {
                font-size: 14px;
                font-weight: 500;
            }
        }
        .compare-data {
            font-weight: 400;
            color: #5a5a5a;
            font-size: 14px;
            span {
                color: #1b2027;
            }
        }
        .triangle-up{
            display: inline-block;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0px 6px 6px 6px;
            border-color: transparent transparent red;
            margin: 0 2px 3px 2px;
        }
        .triangle-down {
            display: inline-block;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 6px 6px 0px 6px;
            border-color:  #15d6ba  transparent transparent transparent;
            margin: 0 2px 3px 2px;
        }
    }

</style>

