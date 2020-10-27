<template>
  <div class="pushchase">
      <p>HI,</p>
      <p>我们为您提供了全新的服务平台-Fingo商家系统。请放心,您之前的订单信息都已经迁移到Fingo商家系统</p>
      <div class="pushchase_botton">
          <el-button type="primary" @click="clickToSale">即刻前往</el-button>
      </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
    };
  },
  computed:{
  },
  watch:{
  },
  methods: {
      clickToSale(){
          window.open('https://supplier.fingo.shop/')
      }
  },
};
</script>

<style lang="scss" scoped>
.pushchase{
    font-size: 25px;
    padding: 200px 0 0 100px;
    box-sizing: border-box;
    p{
        margin:20px;
    }
    .pushchase_botton{
        text-align:center;
        margin-top:100px;
        .el-button{
            width:200px;
            height:60px;
            font-size:18px;
        }
    }
}
</style>
