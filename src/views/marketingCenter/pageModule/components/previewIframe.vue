<template>
    <div class="preview-iframe">
        <iframe id="previewIframe"
            v-if="srcUrl"
            width="375"
            height="610"
            :src="srcUrl"
        ></iframe>
    </div>
</template>
<script>
export default {
    data () {
        return {
            srcUrl: ''
        }
    },
    created () {
        let query = this.$route.query || {}
        let lang = query.lang || 'cn'
        let countryCode = query.countryCode || 'MY'
        if (query && query.historySerialId) {
            this.srcUrl = process.env.VUE_APP_BASIC_URL + 'activityPreview?historySerialId=' + query.historySerialId + '&lang=' + lang + '&countryCode=' + countryCode
        }
    }
}
</script>
<style lang="scss">
.preview-iframe {
    margin: 0 auto;
}
</style>
