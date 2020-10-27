import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'
export default {
    path: '/product',
    meta: { title: '商品中心', icon: '&#xe60f;' },
    components: {
        default: layout,
        cHeader: cHeader,
        cNav: cNav
    },
    children: [
        {
            path: 'productListNew',
            component: () => import('@/views/product/ProductListNew'),
            name: 'productListNew',
            meta: {
                title: '商品管理',
                icon: '',
                isBack: false,
                key: 'MENU_PRODUCT_LIST',
                btnPermission: [{
                    key: 'BTN_PRODUCT_ADD',
                    title: '新增商品'
                }, {
                    key: 'BTN_PRODUCT_ADD_GROUP',
                    title: '新增组合商品'
                }, {
                    key: 'BTN_PRODUCT_EDIT',
                    title: '编辑'
                }, {
                    key: 'BTN_PRODUCT_DELETE',
                    title: '删除'
                }, {
                    key: 'BTN_PRODUCT_SHELVES',
                    title: '上下架'
                }, {
                    key: 'BTN_PRODUCT_EXPORT',
                    title: '商品导出'
                }, {
                    key: 'BTN_PRODUCT_TYPE',
                    title: '更改商品类型'
                }]
            }
        },
        {
            path: 'shelveManage',
            component: () => import('@/views/product/ShelveManage'),
            name: 'ShelveManage',
            meta: {
                title: '上下架管理',
                icon: '',
                key: 'MENU_SHELVE_MANAGE',
                btnPermission: [
                    {
                        key: 'BTN_BATCH_ADVICE',
                        title: '采纳建议'
                    }, {
                        key: 'BTN_BATCH_ON_SHELVE',
                        title: '上架'
                    }, {
                        key: 'BTN_BATCH_OFF_SHELVE',
                        title: '下架'
                    }, {
                        key: 'BTN_ON_SALE',
                        title: '在售'
                    }, {
                        key: 'BTN_OFF_SALE',
                        title: '停售'
                    }
                ]
            }
        },
        {
            path: 'productPublish',
            component: () => import('@/views/product/productPublish/ProductPublish'),
            name: 'productPublish',
            meta: {
                title: '商品发布',
                icon: '',
                key: 'MENU_PRODUCT_PUBLISH',
                btnPermission: [
                ]
            }
        },
        {
            path: 'storeGroupProductManage',
            component: () => import('@/views/product/storeGroupProductManage'),
            name: 'storeGroupProductManage',
            meta: {
                title: '店群商品管理',
                icon: '',
                key: 'MENU_STORE_GROUP_PRODUCT_MANAGE',
                btnPermission: [
                ]
            }
        },
        {
            path: 'categoryMapping',
            component: () => import('@/views/product/categoryMapping'),
            name: 'categoryMapping',
            meta: {
                title: '类目映射',
                icon: '',
                key: 'MENU_CATEGORY_MAPPING',
                btnPermission: [
                ]
            }
        },
        {
            path: 'productCheck',
            component: () => import('@/views/product/ProductCheck'),
            name: 'productCheck',
            meta: {
                title: '商品审核',
                icon: '',
                keepAlive:true,
                key: 'MENU_PRODUCT_CHECK',
                btnPermission: [{
                    key: 'BTN_PRODUCT_DRAFT_CHECK',
                    title: '审核'
                }, {
                    key: 'BTN_PRODUCT_DRAFT_DEL',
                    title: '删除商品草稿'
                }, {
                    key: 'BTN_PRODUCT_DRAFT_UPDATE',
                    title: '暂存'
                }]
            }
        },
        {
            path: 'presale',
            component: () => import('@/views/product/presale/Presale'),
            name: 'presale',
            meta: {
                title: '商品预售',
                icon: '',
                key: 'MENU_PRODUCT_PRE_SALE',
                btnPermission: [
                    {
                        key: 'BTN_PRODUCT_PRESALE_ADD',
                        title: '新增'
                    }, {
                        key: 'BTN_PRODUCT_PRESALE_EDIT',
                        title: '编辑'
                    }, {
                        key: 'BTN_PRODUCT_PRESALE_BATCH_ADD',
                        title: '批量导入'
                    }, {
                        key: 'BTN_PRODUCT_PRESALE_PUSH_PURCHASE',
                        title: '手动推采购单'
                    }
                ]
            }
        },
        {
            path: 'brandManage',
            component: () => import('@/views/product/BrandManage'),
            name: 'brandManage',
            meta: {
                title: '品牌管理',
                icon: '',
                key: 'MENU_BRAND_MANAGE',
                btnPermission: [{
                    key: 'BTN_BRAND_MANAGE_ADD',
                    title: '新增'
                }, {
                    key: 'BTN_BRAND_MANAGE_EDIT',
                    title: '编辑'
                }, {
                    key: 'BTN_BRAND_MANAGE_DELETE',
                    title: '删除'
                }, {
                    key: 'BTN_BRAND_MANAGE_FORBIDDEN',
                    title: '禁用'
                }]
            }
        },
        {
            path: 'frontCategory',
            component: () => import('@/views/product/frontCategory/FrontCategory'),
            name: 'frontCategory',
            hidden:true,
            meta: {
                title: '前台类目',
                icon: '',
                key: 'MENU_PRODUCT_FONT_CATEGORY',
                btnPermission: [{
                    key: 'ProductCategoryService.CategoryAdd',
                    title: '新增'
                }, {
                    key: 'ProductCategoryService.CategoryUpdate',
                    title: '编辑'
                }, {
                    key: 'ProductCategoryService.CategoryDelete',
                    title: '删除'
                }, {
                    key: 'ProductCategoryService.CategoryHiddenOrShow',
                    title: '显示隐藏'
                }, {
                    key: 'ProductCategoryService.CategoryChangSort',
                    title: '排序'
                }]
            }
        },
        // {
        //     path: 'fontGroupManage',
        //     component: () => import('@/views/product/frontCategory/frontGroupManage'),
        //     name: 'frontGroupManage',
        //     hidden:true,
        //     meta: {
        //         title: '分组管理',
        //         icon: '',
        //         key: 'MENU_PRODUCT_FONT_GROUP_MANAGE',
        //         btnPermission: [
        //         //     {
        //         //     key: 'ProductCategoryService.CategoryAdd',
        //         //     title: '新增'
        //         // }, {
        //         //     key: 'ProductCategoryService.CategoryUpdate',
        //         //     title: '编辑'
        //         // }, {
        //         //     key: 'ProductCategoryService.CategoryDelete',
        //         //     title: '删除'
        //         // }, {
        //         //     key: 'ProductCategoryService.CategoryHiddenOrShow',
        //         //     title: '显示隐藏'
        //         // }, {
        //         //     key: 'ProductCategoryService.CategoryChangSort',
        //         //     title: '排序'
        //         // }
        //     ]
        //     }
        // },
        {
            path: 'productCategorySort',
            component: () => import('@/views/product/productCategorySort/index.vue'),
            name: 'productCategorySort',
            hidden: true,
            meta: {
                title: '分类排序',
                icon: '',
                key: 'MENU_PRODUCT_CATEGORY_SORT',
                btnPermission: [{
                    key: 'BTN_PRODUCT_CATEGORY_SORT',
                    title: '排序'
                }]
            }
        },
        {
            path: 'backCategory',
            component: () => import('@/views/product/BackCategory'),
            name: 'backCategory',
            meta: {
                title: '后台类目',
                icon: '',
                key: 'MENU_PRODUCT_BACK_CATEGORY',
                btnPermission: [{
                    key: 'BTN_BACK_CATE_ADD',
                    title: '新增类目'
                }, {
                    key: 'BTN_BACK_CATE_EDIT',
                    title: '编辑类目'
                }, {
                    key: 'BTN_BACK_CATE_DELETE',
                    title: '删除类目'
                }, {
                    key: 'BTN_BACK_CATE_SORT',
                    title: '排序类目'
                },{
                    key:'BTN_CATE_GROUP_ADD',
                    title:'新增类目分组'
                },
                {
                    key:'BTN_CATE_GROUP_EDIT',
                    title:'编辑类目分组'
                },
                {
                    key:'BTN_CATE_GROUP_DETAIL',
                    title:'查看类目分组'
                },
                {
                    key:'BTN_CATE_ROLE_DETELE',
                    title:'删除类目权限'
                },
                {
                    key:'BTN_CATE_ROLE_DETAIL',
                    title:'查看类目权限'
                },{
                    key:'BTN_CATE_ROLE_EDIT',
                    title:'编辑类目权限'
                }]
            }
        },
        {
            path: 'productAttribute',
            component: () => import('@/views/product/productAttribute'),
            name: 'productAttribute',
            meta: {
                title: '属性管理',
                icon: '',
                key: 'MENU_PRODUCT_ATTRIBUTE',
                btnPermission: [{
                    key: 'BTN_PRODUCT_ATTRIBUTE_DOWNLOAD',
                    title: '属性导出'
                }, {
                    key: 'BTN_PRODUCT_ATTRIBUTE_ADD',
                    title: '属性新增'
                }, {
                    key: 'BTN_PRODUCT_ATTRIBUTE_EDIT',
                    title: '属性编辑'
                }, {
                    key: 'BTN_PRODUCT_ATTRIBUTE_DELETE',
                    title: '属性删除'
                }, {
                    key: 'BTN_PRODUCT_UPLOAD_EDIT',
                    title: '导表修改'
                }, {
                    key: 'BTN_PRODUCT_ATTRIBUTE_TRANSLATE',
                    title: '一键自动翻译'
                }, {
                    key: 'BTN_PRODUCT_ATTRIBUTE_VALUE_DOWNLOAD',
                    title: '属性值导出'
                }, {
                    key: 'BTN_PRODUCT_ATTRIBUTE_VALUE_EDIT',
                    title: '属性值编辑'
                }, {
                    key: 'BTN_PRODUCT_ATTRIBUTE_VALUE_DELETE',
                    title: '属性值删除'
                }]
            }
        },
        {
            path: 'wordsManage',
            component: () => import('@/views/product/WordsManage'),
            name: 'wordsManage',
            meta: {
                title: '词库管理',
                icon: '',
                key: 'MENU_WORDS_MANAGE',
                btnPermission: [{
                        key: 'BTN_SYNONYM_WORD_ADD',
                        title: '新增同义词'
                    }, {
                        key: 'BTN_SYNONYM_WORD_EDIT',
                        title: '编辑同义词'
                    }, {
                        key: 'BTN_SYNONYM_WORD_DEL',
                        title: '删除同义词'
                    }, {
                        key: 'BTN_SENSITIVE_WORD_ADD',
                        title: '新增敏感词'
                    }, {
                        key: 'BTN_SENSITIVE_WORD_EDIT',
                        title: '编辑敏感词'
                    }, {
                        key: 'BTN_SENSITIVE_WORD_DEL',
                        title: '删除敏感词'
                    }
                ]
            }
        },
        {
            path: 'productEditNew',
            component: () => import('@/views/product/ProductEditNew'),
            name: 'productEditNew',
            hidden: true,
            meta: {
                title: '商品编辑',
                icon: '',
                key: 'MENU_PRODUCT_EDIT',
                btnPermission: [{
                    key: 'BTN_OPERATION_EDIT',
                    title: '全量编辑'
                }]
            }
        },
        {
            path: 'salesManage',
            component: () => import('@/views/product/SalesManage'),
            name: 'salesManage',
            hidden: true,
            meta: {
                title: '销量管理',
                icon: '',
                key: 'MENU_SALES_MANAGE',
                btnPermission: [{
                    key: 'BTN_SALES_MANAGE_EDIT_SAVE',
                    title: '编辑'
                }]
            }
        },
        {
            path: 'priceTemplate',
            component: () => import('@/views/product/priceTemplate/index'),
            name: 'priceTemplate',
            meta: {
                key: 'MENU_PRICE_TEMPLATE',
                title: '定价模板',
                icon: '',
                btnPermission: [{
                    key: 'BTN_PRICE_TEMPLATE_ADD',
                    title: '新增'
                }, {
                    key: 'BTN_PRICE_TEMPLATE_EDIT',
                    title: '编辑'
                }, {
                    key: 'BTN_PRICE_TEMPLATE_UPDATE_STATUS',
                    title: '显示隐藏'
                }]
            }
        },
        {
            path: 'servicesTemplate',
            component: () => import('@/views/product/servicesTemplate/index'),
            name: 'servicesTemplate',
            meta: {
                title: '服务模板',
                icon: '',
                key: 'MENU_SERVICES_TEMPLATE',
                btnPermission: [{
                    key: 'BTN_AFTER_SALE_ADD',
                    title: '新增售后政策'
                }, {
                    key: 'BTN_AFTER_SALE_EDIT',
                    title: '编辑售后政策'
                }, {
                    key: 'BTN_AFTER_SALE_UPDATE_STATUS',
                    title: '启用停用售后政策'
                }, {
                    key: 'BTN_ARRIVAL_PROMISE_ADD',
                    title: '新增到货承诺'
                }, {
                    key: 'BTN_ARRIVAL_PROMISE_EDIT',
                    title: '编辑到货承诺'
                }, {
                    key: 'BTN_ARRIVAL_PROMISE_UPDATE_STATUS',
                    title: '启用停用到货承诺'
                }]
            }
        },
        {
            path: 'getProductInfo',
            component: () => import('@/views/product/getProductInfo'),
            name: 'getProductInfo',
            meta: {
                title: '获取商品信息',
                icon: '',
                key: 'MENU_GET_PRODUCT_INFO'
            }
        },
        {
            path: 'productOperation',
            component: () => import('@/views/product/ProductOperation'),
            name: 'productOperation',
            meta: {
                title: '商品运营',
                icon: '',
                key: 'MENU_PRODUCT_OPERATION'
            }
        },
        {
            path: 'sameProduct',
            component: () => import('@/views/product/SameProduct.vue'),
            name: 'sameProduct',
            hidden: true,
            meta: {
                title: '商品同款',
                icon: '',
                key: 'MENU_SAME_PRODUCT',
                btnPermission: []
            }
        },
        {
            path: 'productSelect',
            component: () => import('@/views/product/productSelect/index'),
            name: 'productSelect',
            meta: {
                title: '商品搜索',
                icon: '',
                key: 'MENU_PRODUCT_SELECT',
                btnPermission: []
            }
        }
    ]
}
