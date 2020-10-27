<template>
    <div>
        <video-box :data="componentsVal" :imgHeadUrl="imgHeadUrl" isEdit="true"></video-box>
    </div>
</template>
<script>
    export default {
        props: {
            data: [Object, Array]
        },
        data () {
            return {
                imgHeadUrl: process.env.VUE_APP_FILE_URL
            }
        },
        computed: {
            componentsVal () {
                try {
                    return JSON.parse(this.data.componentValue)
                } catch (e) {
                    return {
                        url: this.data.componentValue,
                        cover: ''
                    }
                }
            }
        }
    }
</script>
