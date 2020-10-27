// import Vue from 'vue'
// import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import dict from './modules/dict'
import globalNum from './modules/globalNum'
import contentManage from './modules/contentManage'
import pageEdit from './modules/pageEdit'
import agingConfiguration from './modules/agingConfiguration'

import getters from './getters'
// Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        user,
        dict,
        globalNum,
        pageEdit,
        agingConfiguration,
        contentManage
    },
    getters
})

export default store
