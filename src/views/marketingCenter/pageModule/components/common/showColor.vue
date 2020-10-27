<template>
    <div class="show-color" :style="{'background': color}"></div>
</template>

<script>
export default {
    props: {
        color: ''
    }
}
</script>

<style lang="scss">
    .show-color {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        box-shadow: 0 0 4px #eee;
    }
</style>