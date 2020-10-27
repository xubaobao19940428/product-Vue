<template>
    <el-dialog 
        class="current-pool-dialog"
        title="当前奖池"
        width="650px"
        :visible="dialogVisible"
        :close-on-click-modal="false"
        @close="handleClose"
    >
        <div class="title-tip">以下数据分别代表：当前累计被抽中数/当前奖池累计总数/预计累计投放总数</div>
        <ul >
            <el-checkbox-group v-model="selectluckPrizeIds" class="pool-content-list">
                <li class="item" v-for="(item, index) in luckPrizeList" 
                    :key="item.luckPrizeId">
                    <div :class="[isShowSelect ? 'select-state' : 'opacity0']">
                        <el-checkbox :label="item.luckPrizeId" v-show="isShowSelect">{{ item.luckPrizeName }}</el-checkbox>
                    </div>
                    <!-- 根据index来设置不同的圆 -->
                    <div :id="'chart' + index" style="width: 100%; height: 200px"></div>
                    <p class="num-p">{{ `${item.winningTotal}/${item.putTotal}/${item.featurePutTotal}` }}</p>
                    <el-button class="a-text" type="text" @click="handleChangeState('edit', index)" v-show="curStateList[index] === 'close'">修改数量</el-button>
                    <div class="change-num-box" v-if="curStateList[index] === 'edit'">
                        <el-select v-model="param[index].tag" style="width: 30%" size="small">
                            <el-option v-for="(item, index) in tagList" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                        <el-input-number v-model="param[index].quantity" :controls="false" :min="1" class="input-num-box" size="small"></el-input-number>
                        <el-button type="text" size="small" @click="handleNumChange(item.luckPrizeId, index)">确定</el-button>
                        <el-button type="text" size="small" @click="handleChangeState('close', index)">取消</el-button>
                    </div>
                </li>
            </el-checkbox-group>
        </ul>

        <div slot="footer" class="dialog-footer">
            <div class="left">
                <el-button @click="handleSelect" type="text" :loading="pending" v-show="!isShowSelect">选择需要导出获奖名单的奖品</el-button>
                <el-button @click="handleDownload(2)" type="text" v-show="isShowSelect">确定导出</el-button>
                <el-button @click="handleCancelSelect" type="text" v-show="isShowSelect">取消导出</el-button>
            </div>
            <el-button size="small" @click="handleClose">取消</el-button>
            <!-- <el-button type="primary"
                size="small"
                @click="handleClose"
                >确 定</el-button> -->
        </div>
    </el-dialog>
</template>

<script>
import echarts from 'echarts';
import { downloadWinningUserInfo, updateLuckPrizeQuantity, queryLuckPrizeInfo } from '@/request/luckdraw'
export default {
    props: {
        dialogVisible: Boolean,
        luckDrawId: [String, Number]
    },
    data () {
        return {
            allColor: {
                1: '#47A2FF',
                2: '#66D38E',   
                0: '#FBDA6E'
            },
            pending: false,
            tagList: ['-', '+'],
            param: [],
            curStateList: [],
            luckPrizeList: [],
            isShowSelect: false,
            selectluckPrizeIds: [] // 选中的下载奖品id
        }
    },
    created () {
        this.getPoolList()
    },
    methods: {
        reset () {
            this.isShowSelect = false
            this.selectluckPrizeIds = []
            this.curStateList = []
            this.luckPrizeList = []
        },
        handleClose () {
            this.reset()
            this.$emit('close')
        },
        handleChangeState (state, index) {
            this.curStateList.splice(index, 1, state)
        },
        initChart () {
            let temp = JSON.parse(JSON.stringify(this.luckPrizeList))
            for (let i = 0; i < temp.length; i++) {
                let item = temp[i]
                let dataList = []
                dataList.push({
                    value: item.winningTotal,
                    name: '当前累计被抽中数'
                })
                dataList.push({
                    value: item.putTotal,
                    name: '当前奖池累计总数'
                })
                let luckPrizeName = item.luckPrizeName.replace(/(.{1,7})/g, '$1\n')
                this['chart' + i] = echarts.init(document.getElementById('chart' + i))
                let num = (i + 1) % 3
                let curColor = this.allColor[num]
                this.setOption(dataList, 'chart' + i, luckPrizeName, item.winningRate, curColor)
            }
        },
        handleNumChange (luckPrizeId, index) {
            let tempParam = { ...this.param[index] }
            let quantity = tempParam.quantity
            if (tempParam.tag === '-') {
                quantity = parseInt('-' + quantity)
            }
            updateLuckPrizeQuantity({luckPrizeId, luckDrawId: this.luckDrawId, quantity}).then(res => {
                if (res.ret.errcode === 1) {
                    this.$message.success('修改成功')
                    this.getPoolList()
                }
            })
        },
        getPoolList () {
            queryLuckPrizeInfo({luckDrawId: this.luckDrawId}).then(res => {
                if (res.ret.errcode === 1) {
                    this.luckPrizeList = [].concat(res.queryLuckPrizeInfo)
                    this.$nextTick(() => {
                        this.initChart()
                    })
                    this.initData(res.queryLuckPrizeInfo.length)
                }
            })
        },
        initData (len) {
            this.param = new Array(len).fill({
                tag: '+',   
                quantity: 1
            })
            this.curStateList = new Array(len).fill('close')
        },
        setOption (data, name, luckPrizeName, winningRate, curColor) {
            let options = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c} ({d}%)'
                },
                color: [curColor,'#F0F2F5'],
                graphic: [{
                    type: 'text',
                    left: 'center',
                    top: '34%',
                    style: {
                        text: luckPrizeName, 
                        textAlign: 'center',
                        color: '#eee',
                        fontSize: 12
                    }
                }, {
                    type: 'text',
                    left: 'center',
                    top: '58%',
                    style: {
                        text: winningRate,
                        textAlign: 'center',
                        color: '#333',
                        fontSize: 20
                    }
                }],
                series: [{
                    data,
                    type: 'pie',
                    radius: ['60%', '82%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    }
                }]
            }
            this[name].setOption(options)
        },
        handleSelect () {
            this.isShowSelect = true
        },
        handleCancelSelect () {
            this.selectluckPrizeIds = []
            this.isShowSelect = false
        },
        handleDownload (type) {
            // 导出所有的获奖名单
            if (!this.selectluckPrizeIds.length) {
                this.$message('请先选择需要导出名单的奖品')
                return
            }
            this.pending = true
            downloadWinningUserInfo({luckPrizeId: this.selectluckPrizeIds, type}).then(res => {
                if (res.ret.errcode === 1) {
                    if (res.url) {
                        let a = document.createElement('a')
                        a.download = this.dealShowFileSrc(res.url)
                        a.href = this.dealShowFileSrc(res.url)
                        a.click()
                    }
                    this.pending = false
                } else {
                    this.pending = false
                }
            }).catch(err => {
                console.error(err)
                this.pending = false
            })
        } 
    }
}
</script>

<style lang="scss">
.current-pool-dialog {
    .el-checkbox__inner {
        width: 20px;
        height: 20px;
        &::after {
            height: 10px;
            width: 6px;
            left: 5px;
        }
    }
    .el-checkbox {
        white-space: pre-wrap;
    }
    .el-checkbox__label {
        color: #fff;
    }
    .pool-content-list {
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;

        .item {
            flex: 0 0 32%;
            text-align: center;
            position: relative;
            margin-top: 6px;
        }
        .opacity0 {
            opacity: 0;
        }
        .select-state {
            transition: opacity 1s;
            background-color: rgba(0, 0, 0, .6);
            opacity: 1;
            position: absolute;
            z-index: 1000;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
        }
        .a-text {
            color: #409eff;
        }
        .num-p {
            font-size: 18px;
        }
    }
    .input-num-box {
        width: 36%;
        display: inline-block;
    }
    .title-tip {
        background-color: #eee;
        text-align: center;
        margin: 0;
        padding: 8px 0;
        color: #333333;
    }
}
</style>