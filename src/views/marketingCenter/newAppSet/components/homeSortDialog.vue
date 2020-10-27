<template>
    <el-dialog 
        class="home-set-dialog" 
        :visible="showSort" 
        :close-on-click-modal="false"
        @close="handleClose" width="600px">
        <el-form label-position="left" inline :model="param">
            <el-form-item label="选择国家：">
                <el-select v-model="param.countryCode" @change="selectChange" size="small">
                    <el-option
                    v-for="item in countryList"
                    :key="item.shortCode"
                    :label="item.nameCn"
                    :value="item.shortCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择人群：">
                <el-select v-model="param.activeCrowdType" @change="selectChange">
                    <el-option v-for="item in activeCrowdTypeList" :key="item.key"
                        :value="item.key"
                        :label="item.name"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="content-wrapper">
            <ul class="app-home-list-wrapper">
                <li v-for="item in sortData" :key="item.type">
                    <div class="left">
                        {{ list[item.type] }}
                    </div>
                    <i class="iconfont">&#xe6b3;</i>
                </li>
            </ul>
        </div>
        <span class="footer" slot="footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import Sortable from 'sortablejs'
import { saveHomePage, listHomePage } from '@/request/promotion'

export default {
    props: {
        countryList: Array,
        showSort: Boolean
    },
    data () {
        return {
            param: {
                countryCode: 'MY',
                activeCrowdType: 1
            },
            sortable: null,
            sortData: [],
            activeCrowdTypeList: [{
                key: 1,
                name: '仅新用户',
            }, {
                key: 2,
                name: '仅老用户'
            }],
            list: {
                1: '腰封',
                2: '营销Card',
                3: '新人0元免费拿',
                4: '今日爆款',
                5: '限时抢购',
                6: '平台广告',
                7: '广告Card',
                8: '拼团Card'
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            let $el = this.$el.querySelector('.app-home-list-wrapper')
            this.sortable = Sortable.create($el, {
                group: {
                    name: 'app-set-manage',
                    pull: false,
                    put: true
                },
                sort: true,
                ghostClass: 'components-class',
                onUpdate: (e) => {
                    const tempIndex = this.sortData.splice(e.oldIndex, 1)
                    this.sortData.splice(e.newIndex, 0, ...tempIndex)
                }
            })
        })
    },
    created () {
        this.getData()
    },
    methods: {
        selectChange () {
            this.getData()
        },
        getData () {
            listHomePage(this.param).then(res => {
                if (res.ret.errcode === 1) {
                    this.sortData = res.homePageSort
                }
            })
        },
        handleClose () {
            this.$emit('close')
        },
        handleConfirm () {
            let tempsortData = JSON.parse(JSON.stringify(this.sortData))
            tempsortData = tempsortData.map((item, index) => {
                item.sort = index + 1
                return item
            })
            let res = Object.assign(this.param, {
                homePageSort: tempsortData
            })
            saveHomePage(res).then(res => {
                if (res.ret.errcode === 1) {
                    this.$message.success('排序保存成功')
                    this.$emit('close')
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.content-wrapper {
    ul {
        padding: 0 32px;
        li {
            cursor: move;
            margin: 12px 0 0 0;
            border-radius: 2px;
            background-color: #fff;
            line-height: 40px;
            padding: 0 10px;
            user-select: none;
            font-size: 14px;
            box-shadow: 0 0 4px 0 rgba(10,42,97,.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 400;
            color: #606266;
            .iconfont {
                font-size: 18px;
                cursor: pointer;
            }

        }
    }
}
</style>