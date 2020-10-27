// import Vue from 'vue'
// import Router from 'vue-router'
import store from '../store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth'
import { constantRouterMap } from './routers' // 验权

// Vue.use(Router)
const router = new VueRouter({
    // mode: 'history', // 后端支持可开
    base: process.env.VUE_APP_BASE_URL,
    routes: constantRouterMap,
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
})

const whiteList = ['/login']// no redirect whitelist
NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
    NProgress.start()
    if (getToken()) {
        let userInfo = localStorage.adminUserInfo ? JSON.parse(localStorage.adminUserInfo) : {
            account: ''
        }
        console.log(userInfo)
        if (to.path == '/404' || to.name == 'login' || to.meta.noPermission || userInfo.account == 'admin') {
            next()
            NProgress.done()
        } else {
            let item = store.state.user.permissionKey[to.meta.key]
            if (item) {
                store.dispatch('updateViewRouter', {
                    action: 'add',
                    data: to
                })
                next()
                NProgress.done()
            } else {
                next('/noPermission')
                NProgress.done()
            }
        }
    } else {
        /* has no token */
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            next('/login')
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
export default router
