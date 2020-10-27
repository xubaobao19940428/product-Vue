// import Vue from 'vue'
import initData from '@/utils/pageEditInitData.js'
const pageEdit = {
    state: {
        componentsData: [], // 需要包含sort值
        productList: {}, // 保存所有列表组件加载到的商品列表,用于商品拖拽部分，避免需要请求多次
        allCouponData: {}, // 所有的优惠券信息列表
        allPrizeData: {},
        currentComponentIndex: -1,
        isComponentManage: false, // 当前是否选中了组件管理
        pageData: { // 页面相关信息存储在这里
            name: '页面标题',
            background: '#fff'
        },
        basicDetail: { // 根据basicName查找对应组件的title 主要用于楼层选择和组件管理部分(复制之类的操作) 一个枚举值
            'imageAd': {
                title: '图片广告'
            },
            'productList': {
                title: '商品列表'
            },
            'floorAnchor': {
                title: '楼层锚点'
            },
            'graphicNavigation': {
                title: '图文导航'
            },
            'fingoCoupon': {
                title: '优惠券'
            },
            'fingoGroup': {
                title: '拼团'
            },
            'pageCountDown': {
                title: '倒计时'
            },
            'lottery': {
                title: '抽奖'
            },
            'hoverBtn': {
                title: '悬浮按钮'
            },
            'potentialFans': {
                title: '潜力粉丝'
            }
        },
        leftPrivateList: [{
            basicName: 'potentialFans',
            title: '潜力粉丝',
            icon: '&#xe6f0;',
            info: {}
        }],
        leftNavList: [{
            basicName: '',
            title: '页面标题',
            hidden: true,
            info: {
                background: '#7C0B21',
                shareType: 'top',
                canShare: false, // 页面是否可以分享
                shareTitle: [],
                shareDesc: [],
                shareImg: ''
            }
        }, {
            basicName: 'imageAd',
            title: '图片广告',
            icon: '&#xe611;',
            info: {
                isShowHot: false,
                imgDetailList: [], // [{imgList: [{}] // 单张图片的多语言版本 linkList: [{linkType: '链接类型', url: '跳转地址', detailId: '商品id', desc: '备注说明', left: '各种方位的百分比', width: '还有height的百分比'}], existShare: false // 是否存在唤起分享的}] // 该张图片的所有链接列表}]
                btPadding: 0, // 上下边距
                rlPadding: 0, // 左右边距
                isRadius: false, // 表示直角
                style: 'one' // 'one' - 一行一个，'swipe' - 轮播
            }
        }, {
            basicName: 'productList',
            title: '商品列表',
            icon: '&#xe653;',
            info: JSON.parse(JSON.stringify(initData.productList))
        }, {
            basicName: 'floorAnchor',
            title: '楼层锚点',
            icon: '&#xe619;',
            info: {
                background: '#f59a23',
                color: '#fff',
                activeBackground: '#d9001b',
                activeColor: '#EDD56C',
                List: []
            }
        }, {
            basicName: 'fingoCoupon',
            title: '优惠券',
            icon: '&#xe682;',
            info: JSON.parse(JSON.stringify(initData.fingoCoupon))
        },
        {
            basicName: 'fingoGroup',
            title: '拼团',
            icon: '&#xe6a2;',
            info: JSON.parse(JSON.stringify(initData.fingoGroup))
        },
        {
            basicName: 'lottery',
            title: '抽奖',
            icon: '&#xe68c;',
            info: JSON.parse(JSON.stringify(initData.lottery))
        },
        {
            basicName: 'pageCountDown',
            title: '倒计时',
            icon: '&#xe621;',
            info: {
                startTime: null,
                endTime: null,
                backgroundImg: [],
                numBackground: '#F7E5C5',
                textColor: '#FFFFFF',
                numColor: '#B12619',
                startText: [],
                endText: []
            }
        }, {
            basicName: 'hoverBtn',
            title: '悬浮按钮',
            icon: '&#xe62c;',
            info: {
                imgDetailList: [],
                effect: 'static', // 默认静态
                bottom: 0, // 距离底部的值
                left: 0,
                right: 0,
                selectModuleId: ''
            }
        }]
    },
    mutations: {
        UPDATE_ALL: (state, data) => {
            state.componentsData = data
        },
        UPDATE_COMPONENTS_DATA: (state, Obj) => {
            // 更新数组项
            state.componentsData[Obj.index] = Obj.data
            state.isComponentManage = false
            state.currentComponentIndex = Obj.index
        },
        UPDATE_COMPONENT_NAME_DATA: (state, data) => {
            state.componentsData[data.index].name = data.name
        },
        UPDATE_INIT_PARAM: (state, data) => {
            let allData = {}
            console.log(state.componentsData[data.index])
            Object.assign(allData, state.componentsData[data.index].info, data.info)
            state.componentsData[data.index].info = allData
        },
        UPDATE_PAGE_DATA: (state, data) => {
            let temp = Object.assign({}, state.pageData, data)
            state.pageData = temp
        },
        INSERT_COMPONENTS_DATA: (state, Obj) => {
            // 新增
            state.componentsData.splice(Obj.index, 0, Obj.data)
            state.isComponentManage = false
            state.currentComponentIndex = Obj.index
        },
        REMOVE_COMPONENTS_DATA: (state, index) => {
            // 删除,删除的时候，不改变是否选中组件管理的状态
            let curModuleId = state.componentsData[index].moduleId
            state.currentComponentIndex -= 1
            state.componentsData.splice(index, 1)
            // 删除的时候需要考虑列表组件中是否存在这个这个组件。
            state.componentsData.forEach(item => {
                if (item.basicName === 'floorAnchor' && item.info.List && item.info.List.length) {
                    let index = item.info.List.findIndex(ele => ele.moduleId === curModuleId)
                    item.info.List.splice(index, 1)
                }
            })
        },
        SORT_COMPONENTS_DATA: (state, data) => {
            // 排序
            const tempIndex = state.componentsData.splice(data.oldIndex, 1)
            state.componentsData.splice(data.newIndex, 0, ...tempIndex)
        },
        SET_COMPONENT_INDEX: (state, index) => {
            if (index === -2) {
                state.isComponentManage = true
            } else {
                state.isComponentManage = false
            }
            state.currentComponentIndex = index
        },
        UPDATE_COMPONENT_NAME: (state, data) => {
            let updateIndex = state.name.findIndex(item => item.id === data.id)
            if (updateIndex === -1) {
                state.name.push(data)
            } else {
                state.name[updateIndex] = data
            }
        },
        CLEAR_ALL_DATA: (state) => {
            state.componentsData = []
            state.pageData = {}
        },
        UPDATE_PRODUCT_LIST: (state, data) => {
            Vue.set(state.productList, data.key, data.data)
        },
        UPDATE_ALL_COUPON_DATA: (state, data) => {
            Vue.set(state.allCouponData, data.key, data.data)
        },
        UPDATE_ALL_PRIZE_LIST: (state, data) => {
            Vue.set(state.allPrizeData, data.key, data.data)
        }
    },
    actions: {
        updatePageData: ({ commit }, data) => {
            switch (data.type) {
                case 'add':
                    commit('INSERT_COMPONENTS_DATA', data)
                    break
                case 'del':
                    commit('REMOVE_COMPONENTS_DATA', data.index)
                    break
                case 'update':
                    commit('UPDATE_COMPONENTS_DATA', data)
                    break
                case 'sort':
                    commit('SORT_COMPONENTS_DATA', data)
                    break
                case 'updateAll':
                    commit('UPDATE_ALL', data.data)
                    break
            }
        },
        updateComponentNameData: ({ commit }, data) => {
            commit('UPDATE_COMPONENT_NAME_DATA', data)
        },
        setCurrentComponentIndex: ({ commit }, data) => {
            commit('SET_COMPONENT_INDEX', data)
        },
        updateInitParam: ({ commit }, data) => {
            commit('UPDATE_INIT_PARAM', data)
        },
        updateComponentName: ({ commit }, data) => {
            commit('UPDATE_COMPONENT_NAME', data)
        },
        updateWholePageData: ({ commit }, data) => {
            commit('UPDATE_PAGE_DATA', data)
        },
        clearAllData: ({ commit }) => {
            commit('CLEAR_ALL_DATA')
        },
        updateProductList: ({ commit }, data) => {
            commit('UPDATE_PRODUCT_LIST', data)
        },
        updateAllCouponData: ({ commit }, data) => {
            commit('UPDATE_ALL_COUPON_DATA', data)
        },
        updateAllPrizeList: ({ commit }, data) => {
            commit('UPDATE_ALL_PRIZE_LIST', data)
        }
    }
}

export default pageEdit
