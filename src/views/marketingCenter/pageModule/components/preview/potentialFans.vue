<template>
    <potential-fans :data="dataList" :isEdit="true"></potential-fans>
</template>
<script>
    export default {
        data () {
            return {
                dataList: []
            }
        }
    }
</script>
