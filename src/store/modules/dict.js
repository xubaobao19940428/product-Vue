/**
 *  项目中常用的数据字典
 */
import { getCountryList, getLanguageList } from '@/request/i18n'

const dict = {
    state: {
        memberLevel: {
            2: 'SH',
            3: 'PS',
            4: 'AM',
            5: 'AT',
            6: 'PS+',
            7: 'AM+',
            8: 'AT+'
        },
        memberLevelList: [
            {
                value: null,
                label: '全部'
            }, {
                value: 2,
                label: 'SH'
            },
            {
                value: 3,
                label: 'PS'
            },
            {
                value: 4,
                label: 'AM'
            },
            {
                value: 5,
                label: 'AT'
            }
        ],
        countryList: [],
        languageList: [],
        saleCountryList: []
    },
    mutations: {
        SET_COUNTRY_LIST: (state, countryList) => {
            state.countryList = countryList
        },
        SET_LANGUAGE_LIST: (state, languageList) => {
            state.languageList = languageList
        },
        SET_SALE_COUNTRY_LIST: (state, countryList) => {
            state.saleCountryList = countryList
        }
    },
    actions: {
        // 获取国家数据字典
        getCountryList({ commit }) {
            let params = {
                pageSize: 100,
                pageNum: 1
            }
            getCountryList(params).then((response) => {
                let res = response
                if (res.ret.errcode === 1) {
                    commit('SET_COUNTRY_LIST', res.countryInfo);
                }
            }).catch((err) => {
                console.error(err)
            })
        },
        getLanguageList({ commit }) {
            let params = {
                pageSize: 100,
                pageNum: 1
            }
            getLanguageList(params).then((response) => {
                if (response.ret.errcode === 1) {
                    commit('SET_LANGUAGE_LIST', response.languageInfo);
                }
            }).catch((err) => {
                console.error(err)
            })
        }
    }
};

export default dict;
