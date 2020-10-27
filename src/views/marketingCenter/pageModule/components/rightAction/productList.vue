<template>
    <div class="page-product-list">
        <div class="head">
            <h5>商品列表</h5>
        </div>
        <div class="content">
            <el-form :model="info">
                <el-form-item label="组件名称" class="label-line border-line">
                    <el-select v-model="nameLang" style="width: 31%">
                        <el-option v-for="(item, index) in languageList"
                            :key="index"
                            :label="item.desc"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                    <div v-for="(item, index) in name" v-show="nameLang === item.languageCode" :key="index" class="name-input mar-l-10">
                        <el-input v-model="item.name" type="text" placeholder="请输入" @change="handleNameChange({currentComponentIndex, name})"/>
                    </div>
                </el-form-item>
                <el-form-item class="dFlex">
                    <div class="border-box border-line add-product-box" slot="label">
                        <span class="left">添加商品</span>
                        <el-select v-model="info.sortColumn" v-show="productList[data.moduleId] && productList[data.moduleId].length" @change="(val) => handleInitParamChange({sortColumn: val, isChange: true})" size="mini">
                            <el-option :value="4" :disabled="info.selectedType == 'noActivityProductData'" label="活动排序"></el-option>
                            <el-option :value="2" :disabled="info.selectedType == 'activityData' || info.selectedType == 'groupData' || info.selectedType == 'activityProductData'" label="人工排序"></el-option>
                            <el-option :value="1" label="销量排序"></el-option>
                            <el-option :value="3" label="加购排序"></el-option>
                        </el-select>
                    </div>
                    <div class="add-wrapper">
                        <ul class="add-wrapper-ul" v-show="info.selectedType === 'activityProductData' || info.selectedType === 'noActivityProductData'">
                            <li v-for="(item, i) in productList[data.moduleId]" :key="item.productId + '_' + i" class="add-wrapper-li">
                                <div class="product-img-box">
                                    <img :src="dealShowFileSrc(item.cover || item.productCover)"/>
                                    <div class="delete-box" @click.stop="deleteProduct(item.productId)">
                                        <i class="el-icon-delete"></i>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <p class="select-p" v-if="info.selectedType === 'activityData'">活动ID 一 {{ info.selectedId.join(',') }}</p>
                        <p class="select-p" v-if="info.selectedType === 'groupData'">活动分组ID 一 {{ info.selectedId.join(',') }}</p>
                        <div class="add-box" @click="handleShowAdd">
                            <i class="el-icon-plus"></i>
                        </div>
                        <div class="add-box" @click="handleDelAll" v-show="info.selectedType === 'activityProductData' || info.selectedType === 'noActivityProductData'">
                            <i class="el-icon-minus"></i>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item
                    label="自动更新"
                    class="label-line"
                    v-show="info.selectedType !== 'noActivityProductData'"
                >
                    <el-checkbox-group v-model="info.productStatus" @change="(val) => handleInitParamChange({productStatus: val, isChange: true})">
                        <el-checkbox :label="1">未开始</el-checkbox>
                        <el-checkbox :label="2">进行中</el-checkbox>
                        <el-checkbox :label="3">已结束</el-checkbox>
                        <el-checkbox :label="4">预热中</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="列表样式" class="border-line col-num">
                    <el-radio-group v-model="info.colNum" @change="(val) => handleInitParamChange({colNum: val})">
                        <el-radio-button label="2">一行两个</el-radio-button>
                        <el-radio-button label="3">一行三个</el-radio-button>
                        <el-radio-button label="1">详细列表</el-radio-button>
                        <el-radio-button label="no">横向滑动</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上限控制" v-show="info.colNum !== 'no'">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowLimit ? '启用' : '不启用' }}</span>
                        <el-checkbox class="right" v-model="info.isShowLimit" @change="(val) => handleInitParamChange({isShowLimit: val})"></el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item class="more-show-item" v-show="info.isShowLimit && info.colNum !== 'no'">
                    最多展示 <el-input-number
                        style="margin: 0 8px;"
                        controls-position="right"
                        :min="1"
                        v-model="info.limitLine"
                        @change="(val) => handleInitParamChange({limitLine: val})"
                    ></el-input-number> 行
                </el-form-item>
                <el-form-item label="卡片样式" class="label-line border-line">
                    <el-radio-group v-model="info.cardType" @change="(val) => handleInitParamChange({cardType: val})">
                        <el-radio-button label="no-border">无底</el-radio-button>
                        <el-radio-button label="border">描边</el-radio-button>
                        <el-radio-button label="shadow">投影</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="label-line border-line">
                    <template slot="label">
                        <span>背景颜色</span>
                        <show-color style="marginLeft: 24px;" :color="info.background"></show-color>
                    </template>
                    <el-radio-group v-model="backgroundType" @change="handleBackgroundChange">
                        <el-radio-button label="transparent">透明</el-radio-button>
                        <el-radio-button label="white">白色</el-radio-button>
                        <el-radio-button label="custom">自定义</el-radio-button>
                    </el-radio-group>
                    <el-color-picker class="line" v-show="backgroundType === 'custom'" v-model="info.background" @change="(val) => handleInitParamChange({background: val})"></el-color-picker>
                </el-form-item>
                <el-form-item label="背景图片" class="label-line">
                    <ul class="img-wrapper common-box">
                        <li class="item">
                            <multi-lang-file-upload
                                accept="image/jpeg,image/jpg,image/png,image/gif"
                                :propFileList="info.headImg"
                                @setData="setHeadImg"
                            />
                            首图链接 <el-input
                                class="input-url"
                                size="medium"
                                placeholder="可不填"
                                v-model="info.headLink"
                                @change="(val) => handleInitParamChange({headLink: val})"/>
                        </li>
                        <li class="item">
                            <multi-lang-file-upload
                                accept="image/jpeg,image/jpg,image/png,image/gif"
                                :propFileList="info.endImg"
                                @setData="setEndImg"
                            />
                            尾图链接 <el-input
                                class="input-url"
                                size="medium"
                                v-model="info.footLink"
                                placeholder="可不填" @change="(val) => handleInitParamChange({footLink: val})"/>
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item class="label-line border-line">
                    <template slot="label">
                        <span>模块倒角</span>
                        <span class="common-text" style="marginLeft: 24px;">{{ info.isRadius ? '圆角' : '直角' }}</span>
                    </template>
                    <el-radio-group v-model="info.isRadius" @change="(val) => handleInitParamChange({isRadius: val})">
                        <el-radio-button :label="false">直角</el-radio-button>
                        <el-radio-button :label="true">圆角</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上边距">
                    <div class="margin-left">
                        <el-input-number
                            placeholder="允许0-16"
                            :max="30"
                            :min="0"
                            :controls="false"
                            v-model="info.topPadding"
                            @change="(val) => handleInitParamChange({topPadding: val})"
                        ></el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="下边距">
                    <div class="margin-left">
                        <el-input-number
                            placeholder="允许0-16"
                            :max="30"
                            :min="0"
                            :controls="false"
                            v-model="info.bottomPadding"
                            @change="(val) => handleInitParamChange({bottomPadding: val})"
                        ></el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="左右边距">
                    <div class="margin-left">
                        <el-input-number
                            placeholder="允许0-16"
                            :max="16"
                            :min="0"
                            :controls="false"
                            v-model="info.padding"
                            @change="(val) => handleInitParamChange({padding: val})"
                        ></el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="商品标题" class="border-line">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowTitle ? '显示' : '不显示' }}</span>
                        <el-checkbox
                            class="right"
                            v-model="info.isShowTitle"
                            @change="(val) => handleInitParamChange({isShowTitle: val})"
                        ></el-checkbox>
                    </div>
                    <div class="common-box" v-show="info.isShowTitle">
                        <el-radio-group
                            v-model="info.isOneLine"
                            @change="(val) => handleInitParamChange({isOneLine: val})"
                        >
                            <el-radio :label="true">单行</el-radio>
                            <el-radio :label="false">双行</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item label="营销文案" v-show="info.selectedType !== 'noActivityProductData'">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowPromotionDesc ? '显示' : '不显示' }}</span>
                        <el-checkbox
                            class="right"
                            v-model="info.isShowPromotionDesc"
                            @change="(val) => handleInitParamChange({isShowPromotionDesc: val})"
                        ></el-checkbox>
                    </div>
                    <div v-if="info.isShowPromotionDesc">
                        <div class="flex flex-item--center">
                            <span class="mar-r-10">营销文案颜色</span>
                            <el-color-picker class="line" v-model="info.promotionDescColor" @change="(val) => handleInitParamChange({promotionDescColor: val})"></el-color-picker>
                        </div>
                    </div>
                </el-form-item>
                <!-- <el-form-item label="营销主图" v-show="info.selectedType !== 'noActivityProductData'">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowPromotionCover ? '使用' : '不使用' }}</span>
                        <el-checkbox
                            class="right"
                            v-model="info.isShowPromotionCover"
                            @change="(val) => handleInitParamChange({isShowPromotionCover: val})"
                        ></el-checkbox>
                    </div>
                </el-form-item> -->
                <el-form-item label="商品VIP价">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowVipPrice ? '显示' : '不显示' }}</span>
                        <el-checkbox class="right" v-model="info.isShowVipPrice" @change="(val) => handleInitParamChange({isShowVipPrice: val})"></el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="商品活动价" v-show="info.selectedType !== 'noActivityProductData'">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowActivePrice ? '显示' : '不显示' }}</span>
                        <el-checkbox class="right" v-model="info.isShowActivePrice" @change="(val) => handleInitParamChange({isShowActivePrice: val})"></el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="商品积分">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowPoint ? '显示' : '不显示' }}</span>
                        <el-checkbox class="right" v-model="info.isShowPoint" @change="(val) => handleInitParamChange({isShowPoint: val})"></el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="划线原价">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowPrice ? '显示' : '不显示' }}</span>
                        <el-checkbox class="right" v-model="info.isShowPrice" @change="(val) => handleInitParamChange({isShowPrice: val})"></el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="商品销量">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowSale ? '显示' : '不显示' }}</span>
                        <el-checkbox class="right" v-model="info.isShowSale" @change="(val) => handleInitParamChange({isShowSale: val})"></el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="商品加购量">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowAddCaetNum ? '显示' : '不显示' }}</span>
                        <el-checkbox class="right" v-model="info.isShowAddCaetNum" @change="(val) => handleInitParamChange({isShowAddCaetNum: val})"></el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="购买按钮">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowBuyBtn ? '显示' : '不显示' }}</span>
                        <el-checkbox class="right" v-model="info.isShowBuyBtn" @change="(val) => handleInitParamChange({isShowBuyBtn: val})"></el-checkbox>
                    </div>
                    <template v-if="info.isShowBuyBtn">
                        <div class="common-box mar-b-10">
                            <el-radio-group v-model="info.btnType" @change="(val) => handleInitParamChange({btnType: val})">
                                <el-radio :label="1">样式1</el-radio>
                                <el-radio :label="2">样式2</el-radio>
                                <el-radio :label="3">样式3</el-radio>
                            </el-radio-group>
                        </div>
                        <el-select v-model="btnValLang" style="width: 31%">
                            <el-option v-for="(item, index) in languageList"
                                       :key="index"
                                       :label="item.desc"
                                       :value="item.code"
                            ></el-option>
                        </el-select>
                        <div v-for="(item, index) in info.btnVal" v-show="btnValLang === item.languageCode" :key="index" class="name-input mar-l-10">
                            <el-input v-model="item.name" type="text" placeholder="请输入" @change="handleInitParamChange({btnVal: info.btnVal})"/>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="主图贴纸">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowTickerImg ? '显示' : '不显示' }}</span>
                        <el-checkbox class="right" v-model="info.isShowTickerImg" @change="(val) => handleInitParamChange({isShowTickerImg: val})"></el-checkbox>
                    </div>
                    <div class="ticker-box" v-show="info.isShowTickerImg">
                        <ul class="ticker-img-wrapper" v-if="info.stickerImgList.length">
                            <li class="item" v-for="(item, index) in info.stickerImgList" :key="index" @click="handleEditTicker(item, index)">
                                <img :src="dealShowFileSrc(item.tickerImg.cn)"/>
                            </li>
                        </ul>
                        <el-button type="primary" class="add-btn" @click="handleAddTicker">添加贴图</el-button>
                    </div>
                </el-form-item>
                <!-- <el-form-item label="商品角标" v-show="info.selectedType !== 'noActivityProductData'">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowProductCorner ? '显示' : '不显示' }}</span>
                        <el-checkbox class="right" v-model="info.isShowProductCorner"></el-checkbox>
                    </div>
                    <div class="common-box" v-show="info.isShowProductCorner">
                        <el-radio-group v-model="info.productCornerType">
                            <el-radio :label="1">样式1</el-radio>
                            <el-radio :label="2">样式2</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item> -->
                <el-form-item label="商品分组" class="border-line" v-show="info.selectedType !== 'noActivityProductData'">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowGroup ? '启用' : '不启用' }}</span>
                        <el-checkbox class="right" v-model="info.isShowGroup" @change="(val) => handleInitParamChange({isShowGroup: val})"></el-checkbox>
                    </div>
                </el-form-item>
                <div v-show="info.isShowGroup">
                    <el-form-item label="分组方式" class="label-line">
                        <el-radio-group v-model="info.groupType">
                            <el-radio-button label="time">商品活动时间</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="锚点样式" class="label-line">
                        <el-radio-group v-model="pointIndex" @change="handlePointChange">
                            <el-radio-button v-for="(item, index) in ponitList" :key="item.name" :label="index">{{ item.name }}</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="label-line">
                        <div class="posre">
                            锚点颜色 
                            <el-popover
                                placement="top-start"
                                width="400"
                                trigger="hover">
                                <img src="../../../../../assets/images/page-module-tip.png" style="width: 360px;">
                                <i class="el-icon-question" slot="reference"></i>
                            </el-popover>
                        </div>
                        <ul class="point-wrapper common-box">
                            <li class="item">
                                默认背景
                                <el-color-picker style="margin: 0 60px 0 32px" v-model="info.pointBackground" @change="(val) => handleInitParamChange({ pointBackground: val })"></el-color-picker>
                                <span class="show-text">{{ info.pointBackground }}</span>
                            </li>
                            <li class="item">
                                默认文字
                                <el-color-picker style="margin: 0 60px 0 32px" v-model="info.pointColor" @change="(val) => handleInitParamChange({ pointColor: val })"></el-color-picker>
                                <span class="show-text">{{ info.pointColor }}</span>
                            </li>
                            <li class="item">
                                选中背景
                                <el-color-picker style="margin: 0 60px 0 32px" v-model="info.pointActiveBackground" @change="(val) => handleInitParamChange({ pointActiveBackground: val })"></el-color-picker>
                                <span class="show-text">{{ info.pointActiveBackground }}</span>
                            </li>
                            <li class="item">
                                选中文字
                                <el-color-picker style="margin: 0 60px 0 32px" v-model="info.pointActiveColor" @change="(val) => handleInitParamChange({ pointActiveColor: val })"></el-color-picker>
                                <span class="show-text">{{ info.pointActiveColor }}</span>
                            </li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="时间锚点" class="label-line">
                        <el-radio-group v-model="info.timePointType" @change="handleInitParamChange({ timePointType: info.timePointType, isChange: true })">
                            <el-radio-button label="time">按当日时分</el-radio-button>
                            <el-radio-button label="date-time">按日期时分</el-radio-button>
                        </el-radio-group>
                        <div class="common-box">
                            <ul v-show="info.timePointType === 'time'">
                                <div v-for="(item, index) in info.timePoint" :key="index" class="hover-del">
                                    <i class="el-icon-delete hover" @click="handleDel(index)"></i>
                                    <li>
                                        锚点{{ index + 1 }} <el-time-picker
                                            v-model="item.time"
                                            value-format="timestamp"
                                            class="input-url"
                                            @change="handleInitParamChange({ timePoint: info.timePoint })"
                                            size="medium" />
                                    </li>
                                </div>
                            </ul>
                            <ul v-show="info.timePointType === 'date-time'">
                                <div v-for="(item, index) in info.timePoint" :key="index" class="hover-del">
                                    <i class="el-icon-delete hover" @click="handleDel(index)"></i>
                                    <li>
                                        锚点{{ index + 1 }} <el-date-picker
                                            v-model="item.time"
                                            value-format="timestamp"
                                            type="datetime"
                                            @change="handleInitParamChange({ timePoint: info.timePoint })"
                                            placeholder="请选择"
                                        />
                                    </li>
                                </div>
                            </ul>
                            <el-button @click="handleAdd" type="primary" plain>添加锚点</el-button>
                        </div>
                    </el-form-item>

                    <el-form-item label="开抢倒计时">
                        <div class="margin-left">
                            <span class="common-text">{{ info.isShowBuyTime ? '显示' : '不显示' }}</span>
                            <el-checkbox class="right" v-model="info.isShowBuyTime" @change="(val) => handleInitParamChange({isShowBuyTime: val})"></el-checkbox>
                        </div>
                    </el-form-item>
                    <el-form-item label="结束倒计时">
                        <div class="margin-left">
                            <span class="common-text">{{ info.isShowEnd ? '显示' : '不显示' }}</span>
                            <el-checkbox class="right" v-model="info.isShowEnd" @change="(val) => handleInitParamChange({isShowEnd: val})"></el-checkbox>
                        </div>
                    </el-form-item>
                </div>
            </el-form>
        </div>

        <add-product-dialog
            v-if="showAddProduct"
            :showAddProduct="showAddProduct"
            :selectedType="info.selectedType"
            :productStatus="info.productStatus"
            @cancel="showAddProduct = false"
            @confirm="handleAddProductConfirm"
        ></add-product-dialog>

        <set-ticker-img 
            v-if="showTickerSet" 
            :showTickerSet="showTickerSet" 
            @close="showTickerSet = false"
            :productList="productList[data.moduleId]" 
            :allSelectIds="allSelectIds"
            :curSelecIds="curSelecIds"
            :curTickerImg="curTickerImg"
            @confirm="handleTickerConfirm"
            :languageList="languageList"></set-ticker-img>
    </div>
</template>
<script>
    import { POINT_LIST } from '../commonEnum.js'
    import showColor from '../common/showColor'
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    import addProductDialog from './components/addProductDialog'
    import { mapState } from 'vuex'
    import Sortable from 'sortablejs'
    import initData from '@/utils/pageEditInitData.js'
    import setTickerImg from './components/setTickerimg'

    const NAME = '商品列表'
    export default {
        components: {
            showColor,
            multiLangFileUpload,
            addProductDialog,
            setTickerImg
        },
        props: {
            data: [Object, Array],
            handleNameChange: Function,
            currentComponentIndex: [String, Number]
        },
        data () {
            return {
                pointIndex: 0,
                sortable: null,
                name: [],
                ponitList: POINT_LIST,
                nameLang: 'cn',
                btnValLang: 'cn',
                backgroundType: 'custom', // 背景色的选中类型
                info: JSON.parse(JSON.stringify(initData.productList)),
                showAddProduct: false,
                showTickerSet: false,
                allSelectIds: [], // 其他已经勾选贴图的商品ID
                curTickerImg: {},
                curTickerIndex: -1,
                curSelecIds: [] // 当前贴图已经勾选的商品ID
            }
        },
        watch: {
            data: {
                handler (val) {
                    console.log('watch---')
                    console.log(val)
                    this.init(val)
                }
            }
        },
        computed: {
            ...mapState({
                languageList: state => state.dict.languageList,
                componentsData: state => state.pageEdit.componentsData,
                productList: state => state.pageEdit.productList
            })
        },
        created () {
            this.init(this.data)
        },
        mounted () {
            let ele = this.$el.querySelector('.add-wrapper-ul')
            this.sortable = Sortable.create(ele, {
                group: {
                    name: 'product',
                    pull: false,
                    put: true
                },
                filter: '.delete-box',
                animation: 100,
                sort: true,
                onEnd: (e) => {
                    let temp = { ...this.info }
                    let tempList = temp.selectedId.splice(e.oldIndex, 1)
                    temp.selectedId.splice(e.newIndex, 0, ...tempList)

                    this.$store.dispatch('updateInitParam', {
                        index: this.currentComponentIndex,
                        info: { selectedId: temp.selectedId, isChange: true }
                    })
                }
            })
        },
        methods: {
            init (data) {
                let { info, name } = data
                if (!info.sortColumn) {
                    if (info.selectedType == 'noActivityProductData') {
                        info.sortColumn = 2 // 默认为人工排序
                    } else {
                        info.sortColumn = 4 // 其他则默认为活动排序
                    }
                }
                
                Object.assign(this.info, JSON.parse(JSON.stringify(initData.productList)), info)
                let res = []
                if (info.background == 'transparent') {
                    this.backgroundType = 'transparent'
                } else if (info.background == '#FFF') {
                    this.backgroundType = 'white'
                } else {
                    this.backgroundType = 'custom'
                }
                for (let i = 0; i < this.languageList.length; i++) {
                    let item = this.info.btnVal.find((val) => {
                        return val.languageCode == this.languageList[i].code
                    })
                    if (item) {
                        res.push(item)
                    } else {
                        res.push({
                            languageCode: this.languageList[i].code,
                            name: ''
                        })
                    }
                }
                this.info.btnVal = res
                this.name = name
            },
            handleAddTicker () {
                let allSelectIds = []
                this.info.stickerImgList.forEach((item, index) => {
                    console.log(item)
                    allSelectIds = allSelectIds.concat(item.selectIds)
                })
                this.allSelectIds = allSelectIds
                this.curTickerIndex = -1
                this.curSelecIds = []
                this.curTickerImg = {}
                this.showTickerSet = true
            },
            handleEditTicker (curItem, curIndex) {
                // 重新编辑贴图，因为顺序不会变，所以直接用index就可以区分
                let allSelectIds = []
                this.info.stickerImgList.forEach((item, index) => {
                    if (curIndex != index) {
                        allSelectIds = allSelectIds.concat(item.selectIds)
                    }
                })
                this.curTickerIndex = curIndex
                this.curTickerImg = curItem.tickerImg
                this.curSelecIds = curItem.selectIds
                this.allSelectIds = allSelectIds
                this.showTickerSet = true
            },
            getLangSrc (list) {
                let res = ''
                res = list.find(item => item.languageCode === 'cn')

                return res ? res.name : ''
            },
            handleShowAdd () {
                this.showAddProduct = true
            },
            handleBackgroundChange (val) {
                switch (val) {
                    case 'transparent':
                        this.info.background = 'transparent'
                        break
                    case 'white':
                        this.info.background = '#FFF'
                        break
                }

                this.handleInitParamChange({ background: this.info.background })
            },
            handlePointChange (val) {
                let res = this.ponitList[val]
                this.handleInitParamChange(res)
            },
            handleInitParamChange (obj) {
                let newObj = Object.assign({ isChange: false }, obj)
                this.$store.dispatch('updateInitParam', {
                    index: this.currentComponentIndex,
                    info: newObj
                })
            },
            handleAdd () {
                this.info.timePoint.push({
                    time: null
                })
            },
            setHeadImg (data) {
                this.info.headImg = data

                this.$store.dispatch('updateInitParam', {
                    index: this.currentComponentIndex,
                    info: { headImg: data, isChange: false }
                })
            },
            setEndImg (data) {
                this.info.endImg = data

                this.$store.dispatch('updateInitParam', {
                    index: this.currentComponentIndex,
                    info: { endImg: data, isChange: false }
                })
            },
            handleTickerConfirm (data) {
                // 设置贴图，保存的数组对象[{selectIds: [], stickerImg: {}}]
                if (this.curTickerIndex !== -1) { // 编辑
                    this.info.stickerImgList[this.curTickerIndex] = data
                } else {
                    this.info.stickerImgList.push(data)
                }
                this.showTickerSet = false
                this.$store.dispatch('updateInitParam', {
                    index: this.currentComponentIndex,
                    info: { stickerImgList: this.info.stickerImgList, isChange: false }
                })
            
            },
            handleDel (index) {
                this.info.timePoint.splice(index, 1)
            },
            handleAddProductConfirm (data) {
                // 添加商品,
                // 活动商品和普通商品新增,活动替换
                let currentCompoData = this.componentsData[this.currentComponentIndex]

                if ((data.selectedType == 'noActivityProductData' || data.selectedType == 'activityProductData') &&
                    Object.keys(currentCompoData.info).length > 0) {
                    let tempId = currentCompoData.info.selectedId || [] // 因为是从componentsDat中取数据，最开始是没有这些值的
                    data.selectedId = tempId.concat(data.selectedId)
                    data.selectedId = [...new Set(data.selectedId)]
                }
                if (data.selectedType == 'noActivityProductData') {
                    data.sortColumn = 2 // 默认为人工排序
                    Object.assign(this.info, {
                        sortColumn: 2
                    })
                } else {
                    data.sortColumn = 4 // 其他则默认为活动排序
                    Object.assign(this.info, {
                        sortColumn: 4
                    })
                }
                const { selectedType, selectedId, sortColumn } = data
                this.showAddProduct = false
                Object.assign(this.info, { selectedType, selectedId })
                this.$store.dispatch('updateInitParam', {
                    index: this.currentComponentIndex,
                    info: { selectedType, selectedId, isChange: true, sortColumn }
                })
            },
            // 全部删除
            handleDelAll () {
                this.$confirm('确定删除所有商品？', '提示')
                    .then(() => {
                        this.$store.dispatch('updateInitParam', {
                            index: this.currentComponentIndex,
                            info: { selectedId: [], isChange: false }
                        })
                    })
                    .catch(() => {})
            },
            // 单个删除
            deleteProduct (productId) {
                this.$confirm('确定删除商品？', '提示')
                    .then(() => {
                        let temp = { ...this.info }
                        let index = temp.selectedId.findIndex(id => id === productId) // 不能保证接口返回的顺序和自己选择时存入的id顺序一致
                        if (index !== -1) {
                            temp.selectedId.splice(index, 1)
                            this.$store.dispatch('updateInitParam', {
                                index: this.currentComponentIndex,
                                info: { selectedId: temp.selectedId, isChange: true }
                            })
                        }
                    })
                    .catch(() => {})
            }
        }
    }
</script>
<style lang="scss">
.page-product-list {
    .add-product-box {
        .el-select {
            width: 94px;
            float: right;
            .el-input__inner {
                border: none;
                color: #409EFF;
            }
        }
    }
    .posre {
        position: relative;
    }
    .dFlex {
        display: flex;
        flex-direction: column;
    }

    .add-wrapper-ul {
        display: flex;
        flex-wrap: wrap;
    }
    li[class=add-wrapper-li] {
        padding: 0;
        margin: 4px 4px;
        background-color: #ffffff;
        padding: 12px 0;
        width: 22%;
        border-radius: 4px;
        position: relative;
        .delete-box{
            position: absolute;
            height: 30px;
            left: 0;
            bottom: 0;
            right: 0;
            cursor: pointer;
            z-index: 9;
            opacity: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.5);
            i {
                font-size: 14px;
                color: #fff;
            }
        }
        &:hover{
            .delete-box{
                opacity: 1;
            }
        }
    }
    .common-text {
        font-weight: 500;
        font-size: 16px;
    }
    .add-wrapper {
        max-height: 800px;
        overflow: auto;
        line-height: 22px;
        background-color: #f1f2f3;
        padding: 12px;
        color: #606266;

        .add-box {
            width: 70px;
            height: 70px;
            background-color: #fff;
            text-align: center;
            display: inline-block;
            margin-left: 5px;
            cursor: pointer;
            i {
                line-height: 70px;
                font-size: 24px;
                font-weight: bold;
                color: #409eff;
            }
        }
        .select-p {
            margin: 10px 0;
            padding-left: 8px;
            background-color: #fff;
        }
        .product-name {
            color: #333333;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            padding: 0 8px;
            line-height: 22px;
            -webkit-box-orient: vertical;
        }
    }

    .product-img-box {
        width: 60px;
        height: 60px;
        overflow: hidden;
        margin: 0 auto;
        img {
            width: 100%;
        }
    }
    .col-num {
        .el-radio-button {
            &:last-child {
                border-left: 1px solid #eee;
            }
        }
    }
    .line {
        .el-color-picker {
            display: block;
            margin-top: 8px;
        }
    }
    .ticker-box {
        background-color: #f1f2f3;
        padding: 12px;
        .add-btn {
            width: 100%;
        }
    }
    .ticker-img-wrapper {
        display: flex;
        flex-wrap: wrap;
        .item {
            flex: 0 0 24%;
            margin: 0 4px 6px 0;
            img {
                width: 100%;
            }
        }
        .item:hover {
            border: 2px solid #409eff;
        }
    }
    .input-url {
        width: 75%;
        margin-left: 8px;
    }
    .show-text {
        border: 1px solid #f1f2f3;
        padding: 10px 12px;
    }
    .border-box {
        padding: 8px 0;
    }
}
</style>