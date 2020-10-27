<template>
    <div class="welcome-wrapper">
        <div>欢迎使用fingo运营支撑系统</div>
    </div>
</template>

<script>
    import { getCountryList, getLanguageList } from '@/request/i18n'
    export default {
        mounted() {
            this.getCountryList()
            this.getLanguageList()
        },
        methods: {
            // 获取国家数据字典
            getCountryList() {
                let params = {
                    pageSize: 100,
                    pageNum: 1
                }
                getCountryList(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.setStore("countryList", res.countryInfo)
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            // 获取语言
            getLanguageList() {
                let params = {
                    pageSize: 100,
                    pageNum: 1
                }
                getLanguageList(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.setStore("languageList", res.languageInfo)
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .welcome-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding-top: 200px;
        font-size: 40px;
        img {
            margin-bottom: 20px;
        }
    }
</style>
