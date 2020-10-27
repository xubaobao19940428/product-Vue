<template>
    <div>
        <graphic-navigation :info="item.info" :lang="lang" :imgHeadUrl="imgHeadUrl"></graphic-navigation>
    </div>
</template>
<script>
    export default {
        props: {
            data: [Object, Array]
        },
        data () {
            return {
                lang: 'cn',
                item: {
                    info: {}
                },
                imgHeadUrl: process.env.VUE_APP_FILE_URL
            }
        },
        watch: {
            data: {
                handler (val, oldVal) {
                    this.initData(JSON.parse(JSON.stringify(val)))
                },
                deep: true
            }
        },
        created () {
            this.initData(JSON.parse(JSON.stringify(this.data)))
        },
        methods: {
            initData (data) {
                data.info.isWeb = true
                if (!data.info.navList || !data.info.navList.length) {
                    data.info.isTest = true
                    data.info.navList = [{
                        titleList: [
                            {
                                languageCode: 'cn',
                                name: '导航'
                            }
                        ],
                        url: 'xxx' // 跳转链接
                    }, {
                        titleList: [
                            {
                                languageCode: 'cn',
                                name: '导航'
                            }
                        ],
                        url: 'xxx' // 跳转链接
                    }, {
                        titleList: [
                            {
                                languageCode: 'cn',
                                name: '导航'
                            }
                        ],
                        url: 'xxx' // 跳转链接
                    }, {
                        titleList: [
                            {
                                languageCode: 'cn',
                                name: '导航'
                            }
                        ],
                        url: 'xxx' // 跳转链接
                    }]
                }

                Object.assign(this.item, data)
            }
        }
    }
</script>
