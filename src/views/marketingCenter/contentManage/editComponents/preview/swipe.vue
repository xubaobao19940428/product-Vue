<template>
    <div class="swipe-preview-box">
        <swiper-carousel v-if="componentVal.video || componentVal.img" :data="componentVal" :isEdit="true" :imgHeadUrl="imgHeadUrl"></swiper-carousel>
        <div v-else class="default-box">
            <img src="@/assets/add.png">
            <span>添加图片或视频</span>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            data: [Array, Object]
        },
        computed: {
            componentVal () {
                let Obj = JSON.parse(this.data.componentValue)
                return Obj.data
            }
        },
        data () {
            return {
                imgHeadUrl: process.env.VUE_APP_FILE_URL
            }
        }
    }
</script>
<style lang="scss" scoped>
    .swipe-preview-box{
        width: 100%;
        height: 311px;
        .default-box{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            background-color: #f1f2f3;
            img{
                width: 50px;
                display: flex;
                margin-bottom: 10px;
            }
        }
    }
</style>
