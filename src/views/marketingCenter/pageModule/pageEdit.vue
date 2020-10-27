<template>
    <div class="page-edit-wrapper">
        <div class="tar">
            <el-button type="text" @click="handleSave('close')" v-loading="pending" size="medium">保存草稿并关闭</el-button>
            <el-button type="primary" size="medium" @click="handleSave('continue')" v-loading="pending">保存草稿并继续</el-button>
        </div>
        <div class="page-edit-content" v-if="!visible && finished">
            <div class="components-nav-box">
                <c-nav></c-nav>
            </div>
            <div class="components-preview-box">
                <c-preview ref="previewContent"></c-preview>
                <ul class="tip-icon-box">
                    <li @click="handleSet('title')" :class="currentComponentIndex === -1 ? 'active' : ''">
                        <i class="el-icon-tickets"></i>
                        页面设置
                    </li>
                    <li @click="handleSet('component')" :class="isComponentManage ? 'active' : ''">
                        <i class="el-icon-coin"></i>
                        组件管理
                    </li>
                </ul>
                <ul class="components-list-icon-box tip-icon-box">
                    <li v-for="(item, index) in componentsData"
                        :key="item.moduleId"
                        :class="currentComponentIndex == index ? 'active' : ''"
                        @click="handleSelect(index)">
                        <span class="com-name">{{ getComponentName(item) }}</span>
                    </li>
                </ul>
            </div>
            <div class="components-action-box">
                <c-action></c-action>
            </div>
        </div>
        <el-dialog
            title="选择国家"
            :visible="visible"
            width="460px"
            :close-on-click-modal="false"
            :show-close="false"
        >
            <el-form :model="form" label-width="128px" ref="countryForm" :rules="rules">
                <el-form-item label="活动国家：" prop="countryCode">
                    <el-select v-model="form.countryCode"
                        filterable
                        size="medium">
                        <el-option v-for="item in countryList"
                            :key="item.shortCode"
                            :label="item.nameLocal"
                            :value="item.shortCode">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button size="medium" @click="handleDialogClose">取消</el-button>
                <el-button type="primary" size="medium" @click="handleSaveCountry">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import { getPageAndLayouts, insertPageLayout } from '@/request/marketing'
    import cNav from './components/leftNavBox'
    import cPreview from './components/previewBox'
    import cAction from './components/rightActionBox'
    import { mapState } from 'vuex'
    import { Loading } from 'element-ui'
    import { scrollTo } from '@/utils/index'
    import moment from 'moment'
    export default {
        data () {
            return {
                finished: false,
                pending: false,
                loadingInstance: null,
                form: {
                    countryCode: ''
                },
                visible: false,
                rules: {
                    countryCode: [{ required: true, message: '活动国家必选' }]
                },
                pageSerialId: '',
                type: '' // 页面类型，主要识别是否是复制
            }
        },
        components: {
            cNav,
            cPreview,
            cAction
        },
        computed: {
            ...mapState({
                countryList: state => state.dict.countryList,
                componentsData: state => state.pageEdit.componentsData,
                pageData: state => state.pageEdit.pageData,
                currentComponentIndex: state => state.pageEdit.currentComponentIndex,
                isComponentManage: state => state.pageEdit.isComponentManage,
                basicDetail: state => state.pageEdit.basicDetail
            })
        },
        created () {
            let query = this.$route.query
            if (query && query.historySerialId) {
                this.getData(query.historySerialId)
                if (query.pageSerialId) { // 是否有页面级别的serialId 如果有则表示是在这个页面下增加历史,复制的时候
                    this.pageSerialId = query.pageSerialId
                }
                this.type = query.type

                if (query.type === 'copy') {
                    // 复制新页面的时候，可以重新填国家
                    this.visible = true
                }
            } else {
                this.visible = true
                this.$store.dispatch('clearAllData')
            }
        },
        beforeDestroy () {
            this.$store.dispatch('clearAllData')
        },
        methods: {
            getComponentName (item) {
                let { name } = item
                let res = name.find(item => item.languageCode === 'cn')

                return res.name || this.basicDetail[item.basicName].title
            },
            handleSaveCountry () {
                this.$refs['countryForm'].validate((valid) => {
                    if (valid) {
                        let unit = this.getUnit(this.form.countryCode)
                        this.$store.dispatch('updateWholePageData', { countryCode: this.form.countryCode, unit })
                        this.visible = false
                        this.finished = true
                    }
                })
            },
            handleSelect (index) {
                // 选中了，则需要把内容展示滚动到对应地方
                this.$store.dispatch('setCurrentComponentIndex', index)
                this.$refs.previewContent.scrollTo(index)
            },
            getUnit (countryCode) {
                let res = this.countryList.find(item => item.shortCode === countryCode)

                return res ? res.currencyUnit : ''
            },
            handleDialogClose () { // 取消了选择国家
                this.$router.push({
                    name: 'pageList'
                })
            },
            checkLangList ({shareTitle, shareDescription, shareImg}) {
                let tag = true
                let len = shareTitle ? shareTitle.length : 0
                let imgLen = shareImg ? shareImg.length : 0
                // 图片的赋值不同，只有存了才会这个语言项,且在填写的时候中英文是必填的
                if (!len || !shareDescription.length || (!imgLen || imgLen < 2)) return false
                for (let i = 0; i < len; i++) {
                    if (shareTitle[i].languageCode === 'cn' || shareTitle[i].languageCode === 'en') {
                        if (!shareTitle[i].name) {
                            tag = false
                            break
                        }
                    }

                    if (shareDescription[i].languageCode === 'cn' || shareDescription[i].languageCode === 'en') {
                        if (!shareDescription[i].name) {
                            tag = false
                            break
                        }
                    }
                }

                return tag
            },
            handleSave (type) {
                let tempPageData = { ...this.pageData }
                let shareTag = true
                if (!tempPageData.endTime) {
                    if (this.currentComponentIndex !== -1) {
                        this.$store.dispatch('setCurrentComponentIndex', -1)
                    }
                    this.$message.error('请设置页面失效时间')
                    return
                } else if (tempPageData.share == 1) {
                    // 判断分享的文案、标题、图片是否全部填写
                    shareTag = this.checkLangList(tempPageData)
                }
                let titleEn = tempPageData.title.find(item => item.languageCode == 'en' && item.name.trim())
                if (!titleEn) {
                    if (this.currentComponentIndex !== -1) {
                        this.$store.dispatch('setCurrentComponentIndex', -1)
                    }
                    this.$message.error('至少须设置页面的英文标题')
                    return
                }
                let temp = JSON.parse(JSON.stringify(this.componentsData))

                let existShowCouponShare = null // 券
                let existPageCountDown = null // 倒计时
                let existImgAdShare = null // 存在走分享的图片
                let pos = -1
                let existLottry = null // 抽奖
                let lotteryPos = -1
                temp.forEach((item, index) => {
                    if (item.basicName === 'pageCountDown' && item.info.startTime && item.info.endTime) {
                        // 开始和结束时间都有
                        pos = index
                        existPageCountDown = item
                    }
                    if (item.basicName === 'fingoCoupon' && item.info.isShouldShare) {
                        existShowCouponShare = item
                    }
                    // 抽奖配置了id
                    if (item.basicName === 'lottery' && item.info.luckDrawId) {
                        existLottry = item
                        lotteryPos = index
                    }

                    if (item.basicName === 'imageAd' && item.info.isShowHot && item.info.imgDetailList) {
                        let list = item.info.imgDetailList || []
                        existImgAdShare = list.find(a => a.existShare)
                    }
                })

                if (existShowCouponShare && this.pageData.share != 1) {
                    this.$message.error('当前已开启分享领券，需要将页面的分享功能打开')
                    return
                }
                if (existImgAdShare && this.pageData.share != 1) {
                    this.$message.error('当前已开启唤起分享的图片热区，需要将页面的分享功能打开')
                    return
                }
                if (existPageCountDown && moment(existPageCountDown.info.startTime) >= moment(existPageCountDown.info.endTime)) {
                    this.$message.error('倒计时的结束时间须晚于开始时间')
                    if (pos !== -1 && this.currentComponentIndex !== pos) {
                        this.$store.dispatch('setCurrentComponentIndex', pos)
                    }
                    return
                }
                if (existLottry && (!existLottry.info.bgImg1 || !existLottry.info.prizeBgImg || !existLottry.info.prizeActiveBgImg ||
                    !existLottry.info.btnBg.cn || (existLottry.info.showRecord && !existLottry.info.recordBg.cn))) {
                    this.$message.error('抽奖所需图片缺少')
                    if (lotteryPos !== -1 && this.currentComponentIndex !== lotteryPos) {
                        this.$store.dispatch('setCurrentComponentIndex', lotteryPos)
                    }
                    return
                }

                if (shareTag) {
                    this.pending = true
                    let resParam = this.setResParam()
                    insertPageLayout(this.filterData(resParam)).then(res => {
                        this.pending = false
                        if (res.ret.errcode === 1) {
                            this.$message.success('保存草稿成功')
                            this.pageSerialId = res.serialId // 页面serialid需要保留下来
                            if (type === 'close') {
                                this.$router.push({
                                    name: 'pageList'
                                })
                            }
                        }
                    }).catch(err => {
                        console.error(err)
                        this.pending = false
                    })
                } else {
                    if (this.currentComponentIndex !== -1) {
                        this.$store.dispatch('setCurrentComponentIndex', -1)
                    }
                    this.$message.error('页面分享的标题、文案、图片的中英文项必填')
                }
            },
            // 处理保存传递给后端的数据
            setResParam () {
                let res = {}
                let temp = JSON.parse(JSON.stringify(this.componentsData))
                // 修改页面级的信息
                res.info = this.pageData
                res.info.invalidTime = res.info.endTime
                res.countryCode = res.info.countryCode
                res.layout = temp.map((item, index) => {
                    if (item.basicName === 'productList' || item.basicName === 'fingoGroup' || item.basicName === 'fingoCoupon' || item.basicName === 'lottery') {
                        item.info.isChange = true // isChange用于判断是否需要重新请求接口数据
                    }
                    item.info = JSON.stringify(item.info)
                    item.sort = index
                    delete item.title
                    return item
                })
                res.serialId = this.pageSerialId // 传递页面级别的serialId

                return res
            },
            handleSet (type) {
                if (type === 'title') {
                    this.$store.dispatch('setCurrentComponentIndex', -1)
                } else {
                    this.$store.dispatch('setCurrentComponentIndex', -2) // 选中这个的时候，其他组件都不在选中的状态
                }
            },
            getData (historySerialId) {
                this.loadingInstance = Loading.service()
                getPageAndLayouts({ historySerialId }).then(res => {
                    if (res.ret.errcode === 1) {
                        let temp = JSON.parse(JSON.stringify(res))
                        if (this.type === 'edit') { // 编辑的时候需要保存国家码
                            let unit = this.getUnit(temp.countryCode)
                            this.$store.dispatch('updateWholePageData', { countryCode: temp.countryCode, unit })
                        }
                        let pageLayoutPb = this.setData(temp.pageLayoutPb)
                        delete temp.pageLayoutPb
                        delete temp.countryCode
                        this.$store.dispatch('updateWholePageData', temp)
                        this.$store.dispatch('updatePageData', {
                            type: 'updateAll',
                            data: pageLayoutPb
                        })
                    }
                    this.$nextTick(() => {
                        this.loadingInstance.close()
                        this.finished = true
                    })
                }).catch(err => {
                    this.$nextTick(() => {
                        this.loadingInstance.close()
                        this.finished = true
                    })
                })
            },
            // 处理拿到的数据
            setData (layout) {
                if (!layout || !layout.length) return []

                let resLayout = layout.map(item => {
                    item.info = JSON.parse(item.info)
                    // 因为保存的时候，默认isChange改为了true
                    if (item.basicName === 'productList' || item.basicName === 'fingoGroup') {
                        // 复制新页面的时候则去除商品\优惠券的相关内容
                        if (this.type === 'copy') {
                            item.info.selectedType = ''
                            item.info.selectedId = []
                            item.info.isChange = false // 方便填充初始值
                        } else if (!item.info.selectedId || !item.info.selectedId.length) {
                            // 其他操作时，如果没有选中商品，也需要把isChange改为false.方便填充初始值
                            item.info.isChange = false
                        }
                    } else if (item.basicName === 'fingoCoupon') {
                        if (this.type === 'copy') {
                            item.info.couponList = []
                            item.info.isChange = false // 方便填充初始值
                        } else if (!item.info.couponList || !item.info.couponList.length) {
                            // 其他操作时（编辑时），如果没有选中优惠券，也需要把isChange改为false.方便填充初始值
                            item.info.isChange = false
                        }
                    } else if (item.basicName === 'lottery') {
                        if (this.type === 'copy') {
                            item.info.luckDrawId = ''
                            item.info.isChange = false // 方便填充初始值
                            item.info.prizeList = []
                        } else if (!item.info.luckDrawId) {
                            item.info.isChange = false // 方便填充初始值
                        }
                    }

                    return item
                })

                return resLayout
            }
        }
    }
</script>
<style lang="scss" scoped>
    .page-edit-wrapper {
        width: 100%;
        height: 96%;
    }
    .tar {
        text-align: right;
    }
    .page-edit-content{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 10px 20px;
        .components-nav-box{
            width: 160px;
            height: 100%;
            background: #fff;
            overflow: auto;
        }
        .components-preview-box{
            flex: 1;
            height: 100%;
            background-color: #f7f8fa;
            box-sizing: border-box;
            padding: 10px 0;
            position: relative;
        }
        .tip-icon-box {
            position: absolute;
            top: 16px;
            right: 10px;
            text-align: center;
            font-size: 12px;
            color: #323233;
            z-index: 1;
            .active {
                background-color: #155bd4;
                color: #fff;
            }
            li {
                background-color: #fff;
                box-shadow: 0 2px 8px 0 rgba(0,0,0,.1);
                border-radius: 2px;
                width: 86px;
                height: 32px;
                line-height: 32px;
                margin-bottom: 4px;
                cursor: pointer;
                .com-name {
                    overflow: hidden;
                    display: -webkit-box;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }
            }
        }
        .components-list-icon-box {
            top: 160px;
            height: 400px;
            overflow: scroll;
        }
        .components-action-box{
            width: 376px;
            height: 100%;
            overflow: auto;
            box-sizing: border-box;
            padding: 24px 16px;
            background: #fff;
        }
    }
</style>
