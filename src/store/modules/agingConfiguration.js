// import Vue from 'vue'
const agingConfiguration = {
    state: {
        queryData : {
            agingType: '',
            countryCode: ''
        },
        homeCountryAgingInfo: [{
            nature: "NATURE_NULL",
            minDay: '0',
            maxDay: '0'
        }],
        homeAreaInfo: [],
        freightCountryAgingInfo: [{
            nature: "GENERAL",//普货
            minDay: '0',
            maxDay: '0'
        }, {
            nature: "SENSITIVE",//敏感货
            minDay: '0',
            maxDay: '0'
        }],
        freightAreaInfo: [],
        adressChosen: [],//已选地址
        editAddressIndex:-1,//宅配点击编辑地区
    },
    mutations: {
        UPDATE_QUERY_DATA:(state, data)=> {
            console.log(data)
            state.queryData.agingType = data.agingType
            state.queryData.countryCode = data.countryCode
            state.homeCountryAgingInfo = [{
                nature: "NATURE_NULL",
                minDay: '',
                maxDay: ''
            }]
            state.homeAreaInfo = []
            state.freightCountryAgingInfo=[{
                nature: "GENERAL",
                minDay: '',
                maxDay: ''
            }, {
                nature: "SENSITIVE",
                minDay: '',
                maxDay: ''
            }]
            state.freightAreaInfo = [{stateInfo:[]}]
            console.log(state.queryData)
        },
        UPDATE_AGING_TYPE:(state, data)=> {
            console.log(data)
            state.queryData.agingType = data.agingType
            console.log(state.queryData)
        },
        UPDATE_COUNTRY_CODE:(state, data)=> {
            console.log(data)
            state.queryData.countryCode = data.countryCode
            console.log(state.queryData)
        },
        UPDATE_HOME:(state, data)=> {
            console.log(data)
            state.homeCountryAgingInfo = data.homeCountry
            state.homeAreaInfo = data.homeArea
            console.log(state.homeCountryAgingInfo)
            console.log(state.homeAreaInfo)
        },
        UPDATE_FREIGHT:(state, data)=> {
            console.log(data)
            state.freightCountryAgingInfo = data.freightCountry
            state.freightAreaInfo = data.freightArea
        },
        DELETE_STATE_INFO:(state, data)=> {
            console.log(data)
            state.homeAreaInfo.splice(data.deleteIndex, 1)
        },
        PUSH_STATE_INFO:(state, data)=> {
            console.log(data)
            state.homeAreaInfo[state.editAddressIndex].stateInfo.splice(0)
            for (const iterator of data.statePushInfo) {
                state.homeAreaInfo[state.editAddressIndex].stateInfo.push(iterator)
            }
            console.log(state.homeAreaInfo)
        },
        ADD_STATE_INFO:(state, data)=> {
            console.log(data)
            state.homeAreaInfo.push({
                agingInfo: [{
                    nature: "NATURE_NULL",
                    minDay: '0',
                    maxDay: '0'
                }],
                stateInfo: [...data.statePushInfo]
            })
        },
        DELETE_FORWARD_STATE_INFO:(state, data)=> {
            console.log(data)
            state.freightAreaInfo.splice(data.deleteIndex, 1)
        },
        PUSH_FORWARD_STATE_INFO:(state, data)=> {
            console.log(data)
            state.freightAreaInfo[state.editAddressIndex].stateInfo.splice(0)
            for (const iterator of data.statePushInfo) {
                state.freightAreaInfo[state.editAddressIndex].stateInfo.push(iterator)
            }
        },
        ADD_FORWARD_STATE_INFO:(state, data)=> {
            console.log(data)
            state.freightAreaInfo.push({
                agingInfo:[{
                    nature: "GENERAL",
                    minDay: '0',
                    maxDay: '0'
                }, {
                    nature: "SENSITIVE",
                    minDay: '0',
                    maxDay: '0'
                }],
                stateInfo:[...data.statePushInfo]
            })
        },
        UPDATE_ADDRESS_INDEX:(state, data)=> {
            console.log(data)
            state.editAddressIndex = data.editIndex
        },
        UPDATE_INIT_DATA:(state, data)=> {
            console.log(data)
            state.queryData.agingType = data.agingType
            state.queryData.countryCode = data.countryCode
            state.homeAreaInfo.splice(0)
            state.freightAreaInfo.splice(0)
            state.homeCountryAgingInfo[0].minDay = '0'
            state.homeCountryAgingInfo[0].maxDay = '0'
            state.freightCountryAgingInfo[0].minDay = '0'
            state.freightCountryAgingInfo[0].maxDay = '0'
            state.freightCountryAgingInfo[1].minDay = '0'
            state.freightCountryAgingInfo[1].maxDay = '0'
        },
    },
    actions: {
        updateQueryData:({ commit }, data)=>{
            commit('UPDATE_QUERY_DATA', data)
        },
        updateAgingType:({ commit }, data)=>{
            commit('UPDATE_AGING_TYPE', data)
        },
        updateCountryCode:({ commit }, data)=>{
            commit('UPDATE_COUNTRY_CODE', data)
        },
        updateHome:({ commit }, data)=>{
            commit('UPDATE_HOME', data)
        },
        updateFreight:({ commit }, data)=>{
            commit('UPDATE_FREIGHT', data)
        },
        // 删除宅配地区
        deleteStateInfo:({ commit }, data)=>{
            commit('DELETE_STATE_INFO', data)
        },
        // 编辑宅配地区
        pushStateInfo:({ commit }, data)=>{
            commit('PUSH_STATE_INFO', data)
        },
        // 添加宅配地区
        addStateInfo:({ commit }, data)=>{
            commit('ADD_STATE_INFO', data)
        },
        // 编辑地区对应table的index
        updateAddressIndex:({ commit }, data)=>{
            commit('UPDATE_ADDRESS_INDEX', data)
        },
        // 删除货代地区
        deleteForwardStateInfo:({ commit }, data)=>{
            commit('DELETE_FORWARD_STATE_INFO', data)
        },
        // 编辑货代地区
        pushForwardStateInfo:({ commit }, data)=>{
            commit('PUSH_FORWARD_STATE_INFO', data)
        },
        // 添加货代地区
        addForwardStateInfo:({ commit }, data)=>{
            commit('ADD_FORWARD_STATE_INFO', data)
        },
        // 编辑/添加后的初始化数据
        updateInitData:({ commit }, data)=>{
            commit('UPDATE_INIT_DATA', data)
        },
    }
}
export default agingConfiguration
