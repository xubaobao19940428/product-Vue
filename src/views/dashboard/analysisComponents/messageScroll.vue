<template>
  <div class="notice-card-wrapper">
    <div class="header">
      <div class="title">
        <!-- 系统公告 -->
        <div class="message">
            <div class="fixed-message" >
                <i class="iconfont" style="color:#e6a23c;font-size:25px">&#xe689;</i>
            </div>
         
          <div class="inner-container">
            <span v-html="notice"></span>
          </div>
          <!-- <div class="box">
                <p class="animate">
                    君不见黄河之水天上来，奔流到海不复回，君不见高堂明镜悲白发，朝如青丝暮成雪，人生得意须尽欢，莫使金樽空对月111111111dsfafsdafsfsdafdasfdsfsdfasdfasdff
                </p>
            </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemNotice',
  components: {
  },
  props:{
      notice:{
          type:String,
          default:''
      }
  },
  data() {
    return {
     
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.notice-card-wrapper {
    width:50%;
    margin-left:25%;
    overflow: hidden;
    .message{
        // background:#faecd8;
        .fixed-message{
            background:#ffffff;
            width:36px;
            position: relative;
            z-index:10;
            top:18px;
           
        }
        .inner-container {
            color:#e6a23c;
            margin-left:100%; // 把文字弄出可见区域
            width: 150%;
            white-space:nowrap;
            overflow: hidden;
            animation: myMove 20s linear infinite; // 重点，定义动画
            animation-fill-mode: forwards;  
        }
    }
    /*文字无缝滚动*/
  @keyframes myMove {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
//   .box {
//             width: 100%;
//             margin: 0 auto;
//             position: relative;
//             border: 1px solid #ff6700;
//             overflow: hidden;
           
//         }
 
//         .animate {
//             padding-left: 20px;
//             font-size: 12px;
//             color: #000;
//              margin-left:100%;
//             white-space: nowrap;
//             animation: 15s wordsLoop linear infinite normal;
//              display: inline-block;
//         }
 
//         @keyframes wordsLoop {
//             0% {
//                 transform: translateX(0px);
//                 -webkit-transform: translateX(0px);
//             }
//             100% {
//                 transform: translateX(-100%);
//                 -webkit-transform: translateX(-100%);
//             }
//         }
 
//         @-webkit-keyframes wordsLoop {
//             0% {
//                 transform: translateX(0px);
//                 -webkit-transform: translateX(0px);
//             }
//             100% {
//                 transform: translateX(-100%);
//                 -webkit-transform: translateX(-100%);
//             }
//         }

  }
</style>
