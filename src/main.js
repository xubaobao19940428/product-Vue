// import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueLazyload from 'vue-lazyload'
import VueClipboard from 'vue-clipboard2'
// import VueQuillEditor from 'vue-quill-editor'
// import fingoUI from '@fingo-littlec/fingo-components'

import '@/styles/index.scss'

import App from './App'
import router from './router'
import store from './store'
import './js/common/filter'
import './js/common/directive'
import globalMethods from './js/common/globalMethod.js'
import { setStore, getStore, removeStore } from '@/utils/storage'

// import plTable from 'pl-table'
// import 'pl-table/themes/index.css'

if (localStorage.getItem('adminToken')) {
    Vue.prototype.$headers = {
        token: localStorage.getItem('adminToken'),
        deviceId: new DeviceUUID().get(),
        version: '2.4.0'
    }
}
Vue.use(ElementUI)
// Vue.use(fingoUI)
Vue.use(VueLazyload, {
    lazyComponent: true
})
Vue.use(VueClipboard)
// Vue.use(VueQuillEditor)
// Vue.use(plTable)
// 全局方法注册
Object.keys(globalMethods).forEach(key => {
    Vue.prototype[key] = globalMethods[key]
})

Vue.config.productionTip = false

// 挂载全局使用的方法
Vue.prototype.setStore = setStore
Vue.prototype.getStore = getStore
Vue.prototype.removeStore = removeStore
Vue.prototype.$EventBus = new Vue();

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
