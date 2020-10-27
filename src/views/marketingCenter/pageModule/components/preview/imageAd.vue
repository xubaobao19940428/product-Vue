<template>
    <div>
        <image-ad  :info="item.info" :lang="lang" :moduleId="item.moduleId" :edit="true" :imgHeadUrl="imgHeadUrl" @detail="goToDetail"></image-ad>
    </div>
</template>
<script>
    export default {
        props: {
            data: [Object, Array],
            lang: String
        },
        data () {
            return {
                item: {
                    info: {}
                },
                imgHeadUrl: process.env.VUE_APP_FILE_URL
            }
        },
        watch: {
            data: {
                handler (val) {
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
                if (!data.info.imgDetailList || !data.info.imgDetailList.length) {
                    data.info.isTest = true
                    data.info.imgDetailList = [{imgList: [{languagCode: 'cn', name: ''}]}]
                } else {
                    data.info.isTest = false
                }

                Object.assign(this.item, data)
            },
            goToDetail (data) {
            }
        }
    }
</script>
