<template>
    <div class="c-img-box">
        <jump-link-box :data="data" :imgHeadUrl="imgHeadUrl" isEdit="true"></jump-link-box>
    </div>
</template>
<script>
    export default {
        props: {
            data: Object
        },
        data () {
            return {
                imgHeadUrl: process.env.VUE_APP_FILE_URL
            }
        }
    }
</script>
