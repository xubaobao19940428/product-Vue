<template>
    <div class="notice-entrance-wrapper" @click="showNoticeList">
        <div><i class="el-icon-chat-dot-round"></i></div>
        <div :class="['customer-status-wrapper', getStatusClassName()]"></div>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    export default {
        computed: {
            ...mapState({
                showCustomerNotice: state => state.app.showCustomerNotice,
                customerStatus: state => state.app.customerStatus
            })
        },
        methods: {
            showNoticeList () {
                this.$store.dispatch('switchNoticeStatus', !this.showCustomerNotice)
            },
            getStatusClassName () {
                switch (this.customerStatus) {
                    case 1: return 'status1' // 忙碌
                    case 2: return 'status2' // 退出
                    case 3: return 'status3' // 在线
                }
                return ''
            }
        }
    }
</script>
<style lang="scss" scoped>
.notice-entrance-wrapper{
    position: fixed;
    right: 10px;
    bottom: 10px;
    width: 50px;
    height: 50px;
    border-radius: 5px;
    background: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 8;
    color: #fff;
    cursor: pointer;
    font-size: 30px;
    .customer-status-wrapper{
        width: 12px;
        height: 12px;
        display: flex;
        border-radius: 100%;
        overflow: hidden;
        position: absolute;
        right: 2px;
        top: 2px;
    }
    .status1{
        background: #ff051d;
    }
    .status2{
        background: #d7d7d7;
    }
    .status3{
        background: #00cc2a;
    }
}
</style>
