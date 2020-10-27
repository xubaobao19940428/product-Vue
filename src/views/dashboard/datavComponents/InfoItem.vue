<template>
    <div class="info-item-wrapper">
        <p class="title">{{infoData.title}}</p>
        <p class="data">{{infoData.data}}</p>
        <p class="sub-data">{{infoData.subData}}</p>
    </div>
</template>

<script>
    import ProgressItem from './ProgressItem'
    import InfoItem from './InfoItem'
    export default {
        props: {
        },
        data() {
            return {
                infoData: {
                    title: '今日统计',
                    data: '$3232311',
                    subData: '总订单量34200'
                }
            };
        },
        watch: {

        },
        methods: {
        }
    };
</script>

<style lang="scss" scoped>
    .info-item-wrapper {
        width: 120px;
        height: 100px;
        padding: 6px;
        border: 1px solid #00c7db;
        .title {
            font-size: 13px;
        }
        .data {
            font-size: 22px;
            color: #00c7db;
            margin: 4px 0;
        }
        .sub-data {
            font-size: 16px;
            color: #00c7db;
        }

    }
</style>
