<template>
    <div class="page-container">
        <img :src="dealShowFileSrc(imgSrc)" @load="printPage"/>
    </div>
</template>
<script>
    import { getSkuBarCode } from '@/request/warehouse'
    export default {
        data () {
            return {
                imgSrc: '',
                hiddenSvg: false
            }
        },
        mounted () {
            getSkuBarCode({
                skuCode: [this.$route.query.productCode]
            }).then((res) => {
                if (res.ret.errcode === 1) {
                    if (res.barCode.length > 0) {
                        this.imgSrc = res.barCode[0].barcode
                    }
                }
            })
        },
        methods: {
            printPage () {
                window.print()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .page-container{
        box-sizing: border-box;
        padding: 5px;
        img{
            width: 100%;
        }
    }
    @media print {
        @page {
            margin: 0;
            padding: 0;
        }
        html, body {
            position: relative;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }
        .page-container{
            box-sizing: border-box;
            padding: 5px;
            img{
                width: 100%;
            }
        }
        svg {
            width: 100%;
            height: 100%;
        }
    }
</style>
