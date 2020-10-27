<template>
    <div class="out-rect">
        <div class="in-rect"></div>
    </div>
</template>

<script>

    export default {
        props: {
        },
        data() {
            return {
                title: '拉新产品数据'
            };
        },
        watch: {

        },
        methods: {
        }
    };
</script>

<style lang="scss" scoped>
    .out-rect {
        margin-top: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 200px;
        height: 20px;
        padding: 5px;
        background: linear-gradient(-45deg, transparent 10px, rgb(170, 85, 92) 0) top right;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    .in-rect{
        width: 100%;
        height: 100%;
        background: linear-gradient(-45deg, transparent 8px, rgba(0, 0, 0, 0.021) 0) top right;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
</style>
