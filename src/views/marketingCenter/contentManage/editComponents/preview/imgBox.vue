<template>
    <div class="c-img-box">
        <img-box :data="data" :imgHeadUrl="imgHeadUrl"></img-box>
    </div>
</template>
<script>
    export default {
        props: {
            data: Object
        },
        components: {},
        data () {
            return {
                imgHeadUrl: process.env.VUE_APP_FILE_URL
            }
        }
    }
</script>
