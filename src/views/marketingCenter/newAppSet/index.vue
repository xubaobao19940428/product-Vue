<template>
    <div class="app-container new-app-set-wrapper">
        <div class="head-btn-wrapper">
            <el-button
                type="primary"
                plain size="medium"
                @click="handleChange('screen')"
                :class="['btn-padding', {'active': curPage == 'screen'}]"
            >开屏</el-button>
            <el-button
                type="primary"
                plain
                size="medium"
                :class="['btn-padding', {'active': curPage == 'home'}]"
                @click="handleChange('home')">首页</el-button>
            <el-button
                type="primary"
                plain
                size="medium"
                :class="['btn-padding', {'active': curPage == 'category'}]"
                @click="handleChange('category')">类目列表</el-button>
            <el-button
                type="primary"
                plain
                size="medium"
                :class="['btn-padding', {'active': curPage == 'PSShopper'}]"
                @click="handleChange('PSShopper')">PS店铺</el-button>
            <el-button
                type="primary"
                plain
                size="medium"
                :class="['btn-padding', {'active': curPage == 'center'}]"
                @click="handleChange('center')">个人中心</el-button>
            <el-button
                type="primary"
                plain
                size="medium"
                :class="['btn-padding', {'active': curPage == 'footIcon'}]"
                @click="handleChange('footIcon')">底部图标</el-button>

            <el-button class="right" v-show="curPage == 'home'" @click="showSort = true" type="text" v-if="hasPermission('BTN_HOME_SORT')">排序</el-button>
        </div>
        <keep-alive>
            <component v-bind:is="curPage" :countryList="countryList" :langList="langList"></component>
        </keep-alive>

        <home-sort-dialog v-if="showSort" :showSort="showSort" :countryList="countryList" @close="showSort = false"></home-sort-dialog>
    </div>
</template>

<script>
import { getCountryList } from '@/request/i18n'
import screen from './screenPage'
import home from './homePage'
import category from './categoryPage'
import PSShopper from './PSShopperPage'
import center from './centerPage'
import footIcon from './footIconPage'
import homeSortDialog from './components/homeSortDialog'

export default {
    data () {
        return {
            curPage: 'screen',
            showSort: false
        }
    },
    components: {
        screen,
        home,
        category,
        PSShopper,
        center,
        footIcon,
        homeSortDialog
    },
    computed: {
        countryList () {
            return this.$store.state.dict.countryList
        },
        langList () {
            return this.$store.state.dict.languageList
        }
    },
    created() {
        this.getCountryList()
    },
    methods: {
        // 获取国家数据字典
        getCountryList() {
            let params = {
                pageSize: 100,
                pageNum: 1
            }
            getCountryList(params).then((res) => {
                if (res.ret.errcode === 1) {
                    this.setStore("countryList", res.countryInfo)
                }
            }).catch((err) => {
                console.error(err)
            })
        },
        handleChange (type) {
            this.curPage = type
        }
    }
}
</script>

<style scoped lang="scss">
.new-app-set-wrapper {
    padding: 10px 14px;
    .head-btn-wrapper {
        background: #fff;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
        .btn-padding {
            width: 100px;
            padding: 10px 0;
            text-align: center;
        }
    }
    .el-button {
        &.active {
            color: #ffffff;
            background-color: #409EFF;
            border-color: #409EFF;
        }
    }
}
</style>
