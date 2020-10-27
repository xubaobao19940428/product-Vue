import { createRandomId } from '@/utils/index.js'
const waterfallBaseComponents = [{
    componentType: 2,
    componentLocation: '0',
    moduleId: createRandomId(),
    componentValue: JSON.stringify({
        componentName: 'swipe',
        data: {
            video: '',
            videoCover: '',
            img: ''
        }
    })
}, {
    componentType: 2,
    componentName: 'productList',
    componentLocation: '1',
    moduleId: createRandomId(),
    componentValue: JSON.stringify({
        componentName: 'productList',
        isChange: true,
        data: []
    })
}, {
    componentType: 2,
    componentName: 'topic',
    componentLocation: '2',
    moduleId: createRandomId(),
    componentValue: JSON.stringify({
        componentName: 'topic',
        data: ''
    })
}]
const pageData = {
    contentType: 1, // 1图文 2Feed 3瀑布流
    specialColumnId: null,
    specialSubjectId: null,
    userLevel: [],
    contentTag: [],
    browserBaseNumber: '0',
    shareBaseNumber: '0',
    collectBaseNumber: '0',
    articleCode: '',
    roleCover: '',
    roleName: '',
    articleTopicId: '',
    productIds: []
} 
const contentManage = {
    state: {
        initData: {
            countryCode: 'MY',
            countryName: '马来西亚'
        },
        pageData: JSON.parse(JSON.stringify(pageData)), // 文章基础信息
        levelList: [{
            value: '游客',
            id: '1'
        }, {
            value: 'SH',
            id: '2'
        }, {
            value: 'PS',
            id: '3'
        }, {
            value: 'AM',
            id: '4'
        }, {
            value: 'AT',
            id: '5'
        }],
        shareDescirbeDeafult:{
            'cn':'这是我发现的超值好物，亲测不错，推荐购买',
            'en':'This is the best stuff I find, highly recommend!',
            'ms':'Ini adalah barangan terbaik saya jumpa, sangat disarankan',
            'th':'รีนี่เป็นสินค้าสุดคุ้มที่เราค้นพบ,ไม่เลวเลยล่ะ,สั่งซื้อเลย'
        },
        shareTitleDeafult:{
            'cn':'快看！我发现超值好物了',
            'en':'Hey, I got some good stuff',
            'ms':'Hey, Saya mempunyai barangan terbaik',
            'th':'รีบเข้ามาดู! ตอนนี้ฉันเจอสินค้าสุดคุ้ม'
        },
        baseLayout: {
            language: '',
            articleTitle: '',
            articleDescribe: '',
            coverPic: '',
            shareTitle: '',
            shareDescribe: '',
            sharePic: '',
            contentComponents: [],
            videoCover: '',
            videoUrl: ''
        }, // 每个语言对应基础结构
        waterfallBaseComponents: JSON.parse(JSON.stringify(waterfallBaseComponents)), // 瀑布流基础模板
        articleLangInfos: [],
        currentLangIndex: -1, // 当前选中语言
        currentComponentIndex: -1, // 当前选中组件
        leftNavList: [{
            basicName: 'textBox',
            title: '文本框',
            componentType: 1,
            icon: '&#xe959;',
            info: ''
        }, {
            basicName: 'imgBox',
            title: '图片',
            componentType: 2,
            icon: '&#xe6ba;',
            info: ''
        }, {
            basicName: 'videoBox',
            title: '视频',
            icon: '&#xe678;',
            componentType: 4,
            info: {
                cover: '',
                url: ''
            }
        }, {
            basicName: 'urlBox',
            title: 'URL',
            icon: '&#xe60d;',
            componentType: 5,
            info: {
                piclinkSrc: '',
                piclinkHref: ''
            }
        }], // 组件list
        productList: {}, // 商品信息list
        contentTag: []
    },
    mutations: {
        // 切换当前语言
        UPDATE_ARTICLE_LANG_INDEX: (state, index) => {
            state.currentLangIndex = index
        },
        // 更改语言公共信息
        UPDATE_ARTICLE_LANG_DATA: (state, data) => {
            if (state.currentLangIndex != -1) {
                Object.assign(state.articleLangInfos[state.currentLangIndex], data)
            }
        },
        // 文章语言信息新增编辑删除
        LANG_ARTICLE_ACTION: (state, data) => {
            state.articleLangInfos = data
        },
        // 修改文章公共信息
        UPDATE_ARTICLE_PAGE_DATA: (state, data) => {
            Object.assign(state.pageData, data)
        },
        // 切换组件index
        UPDATE_ARTICLE_COMPONENTS_INDEX: (state, index) => {
            state.currentComponentIndex = index
        },
        // 更改语言组件信息
        UPDATE_ARTICLE_COMPONENTS: (state, Obj) => {
            let contentComponents = state.articleLangInfos[state.currentLangIndex].contentComponents
            if (Obj.type == 'edit') {
                contentComponents[Obj.index].componentValue = Obj.componentValue
            } else if (Obj.type == 'add') {
                contentComponents.splice(Obj.index, 0, Obj.data)
                state.currentComponentIndex = Obj.index
            } else if (Obj.type == 'del') {
                contentComponents.splice(Obj.index, 1)
            } else if (Obj.type == 'sort') {
                const tempIndex = contentComponents.splice(Obj.oldIndex, 1)
                contentComponents.splice(Obj.newIndex, 0, ...tempIndex)
            }
        },
        // 重置
        RESET_ARTICLE_INFO: (state, Obj) => {
            state.pageData = JSON.parse(JSON.stringify(pageData))
            state.articleLangInfos = []
            state.waterfallBaseComponents = JSON.parse(JSON.stringify(waterfallBaseComponents))
            state.currentLangIndex = -1
            state.currentComponentIndex = -1
            state.contentTag = []
        },
        // 更改商品信息
        UPDATE_ARTICLE_PRODUCT: (state, data) => {
            Vue.set(state.productList, data.key, data.data)
        },
        // 主页面国家切换
        UPDATE_COUNTRY: (state, data) => {
            state.initData.countryCode = data.countryCode
            state.initData.countryName = data.countryName
        },
        // 设置内容标签
        UPDATE_CONTENT_TAG: (state, contentTag) => {
            state.contentTag = contentTag
        }
    },
    actions: {
        // 切换当前语言
        updateArticleLangIndex: ({ commit }, index) => {
            commit('UPDATE_ARTICLE_LANG_INDEX', index)
        },
        // 更改语言公共信息
        updateArticleLangData: ({ commit }, data) => {
            commit('UPDATE_ARTICLE_LANG_DATA', data)
        },
        // 切换组件index
        updateArticleComponentsIndex: ({ commit }, index) => {
            commit('UPDATE_ARTICLE_COMPONENTS_INDEX', index)
        },
        // 文章语言信息新增编辑删除
        langArticleAction: ({ commit }, data) => {
            commit('LANG_ARTICLE_ACTION', data)
        },
        // 更改语言组件信息
        updateArticleComponents: ({ commit }, data) => {
            commit('UPDATE_ARTICLE_COMPONENTS', data)
        },
        // 修改文章公共信息
        updateArticlePageData: ({ commit }, data) => {
            commit('UPDATE_ARTICLE_PAGE_DATA', data)
        },
        // 重置
        resetArticleInfo: ({ commit }, data) => {
            commit('RESET_ARTICLE_INFO', data)
        },
        // 更改商品信息
        updateArticleProductList: ({ commit }, data) => {
            commit('UPDATE_ARTICLE_PRODUCT', data)
        },
        // 主页面国家切换
        updateCountry: ({ commit }, data) => {
            commit('UPDATE_COUNTRY', data)
        }
    }
}
export default contentManage
