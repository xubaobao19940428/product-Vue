const app = {
    state: {
        isCollapse: false,
        showCustomerNotice: false,
        viewRouterList: [],
        customerStatus: 2,
        config: {
            WEB_FILE_URL: 'https://file.fingo.shop'
        }
    },
    mutations: {
        TOGGLE_SIDEBAR: (state, data) => {
            state.isCollapse = data
        },
        UPDATE_VIEW_ROUTER: (state, info) => {
            let itemI = state.viewRouterList.findIndex((val) => {
                return val.name == info.data.name && val.fullPath == info.data.fullPath
            })
            if (info.action == 'del') {
                if (itemI != -1) {
                    state.viewRouterList.splice(itemI, 1)
                }
            } else {
                if (itemI == -1) {
                    state.viewRouterList.push(info.data)
                }
            }
        },
        SWITCH_NOTICE_STATUS: (state, data) => {
            state.showCustomerNotice = data
        },
        SET_CUSTOMER_STATUS: (state, data) => {
            state.customerStatus = data
        }
    },
    actions: {
        ToggleSideBar: ({ commit }, data) => {
            commit('TOGGLE_SIDEBAR', data)
        },
        updateViewRouter: ({ commit }, data) => {
            commit('UPDATE_VIEW_ROUTER', data)
        },
        switchNoticeStatus: ({ commit }, data) => {
            commit('SWITCH_NOTICE_STATUS', data)
        },
        setCustomerStatus: ({ commit }, data) => {
            commit('SET_CUSTOMER_STATUS', data)
        }
    }
}

export default app
