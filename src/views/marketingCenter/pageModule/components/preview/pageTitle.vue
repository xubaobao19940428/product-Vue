<template>
    <div class="preview-header">
        <i class="el-icon-arrow-left btn-back"></i>
        <div class="title">{{ getTitle(data.title) }}</div>
        <div class="preview-img" v-show="data.share == 1">
            <img src="../../../../../assets/share-btn.png"/>
        </div>
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
                shareShow: false
            }
        },
        // watch: {
        //     data: {
        //         handler (val) {
        //             this.getTitle()
        //         }
        //     },
        //     deep: true
        // },
        methods: {
            getTitle (title) {
                let res = ''
                if (title && title.length) {
                    res = title.find(item => item.languageCode === this.lang)
                }

                return res ? res.name : ''
            }
        }
    }
</script>
<style lang="scss" scoped>
    .preview-header{
        width: 100%;
        height: 46px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin-top: 16px;
        .title {
            font-size: 18px;
            color: #000;
            font-weight: 500;
        }
        .btn-back{
            position: absolute;
            left: 10px;
        }
        .preview-img {
            width: 18px;
            height: 18px;
            position: absolute;
            right: 10px;
            img {
                width: 100%;
                vertical-align: middle;
            }
        }
    }
</style>
