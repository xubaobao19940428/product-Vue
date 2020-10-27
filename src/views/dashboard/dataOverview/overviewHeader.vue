<template>
  <div class="data_header">
    <!--礼包数据-->
    <el-card class="box-card">
      <div class="box_header">
        <p class="top_header1">今日礼包支付GMV($)</p>
        <p class="top_header2">更新时间：{{todayGiftGmv.updateTime}}</p>
      </div>
      <div class="box_content">
        <span class="content1" v-if="todayGiftGmv.volume!=''">{{todayGiftGmv.volume}}</span>
        <span class="content1" v-else>0</span>
        <div class="content_all">
          <span class="content2">
            昨日同比
             <span style="vertical-align: middle;color: red;" v-if='todayGiftGmv.change.indexOf("-")==-1'>
              {{todayGiftGmv.change}}
              <i class="iconfont">&#xe645;</i>
              </span>
             <span style="vertical-align: middle;color: green;" v-else>
              {{todayGiftGmv.change}}
               <i class="iconfont">&#xe639;</i>
              </span>
          </span>
          <span class="content2">
            占总gmv
            <span v-if="todayGiftGmv.ratio!=''" style="color:black">{{todayGiftGmv.ratio}}</span>
            <span v-else style="color:black">0%</span>
          </span>
        </div>
      </div>
      <!--<div class="box_img box_img1">
      
      </div>-->
      <img
        src="../../../assets/images/header_top.png"
        style=" width:100%;
        height:45px;
        margin-bottom:5px;"
      />
      <div class="box_line"></div>
      <div class="box_bottom">
        <div class="bottom_left">
          <p class="left_left">今日目标达成率</p>
          <p
            class="left_bottom"
            v-if="todayGiftGmv.todayTargetProgress!=''"
          >{{todayGiftGmv.todayTargetProgress}}</p>
          <p class="left_bottom" v-else>0%</p>
        </div>
        <div class="bottom_left">
          <p class="left_left">本月目标达成率</p>
          <p
            class="left_bottom"
            v-if="todayGiftGmv.monthlyTargetProgress!=''"
          >{{todayGiftGmv.monthlyTargetProgress}}</p>
          <p class="left_bottom" v-else>0%</p>
        </div>
      </div>
    </el-card>
    <!--普货数据-->
    <el-card class="box-card">
      <div class="box_header">
        <p class="top_header1">今日普货支付GMV($)</p>
        <p class="top_header2">更新时间：{{todayNormal.updateTime}}</p>
      </div>
      <div class="box_content">
        <span class="content1" v-if="todayNormal.volume!=''">{{todayNormal.volume}}</span>
        <span class="content1" v-else>0</span>
        <div class="content_all">
          <span class="content2">
            昨日同比
            <span style="vertical-align: middle;color: red;" v-if="todayNormal.change.indexOf('-')==-1">
              {{todayNormal.change}}
              <i class="iconfont">&#xe645;</i>
              </span>
              <span style="vertical-align: middle;color: green;" v-else>
              {{todayNormal.change}}
              <i class="iconfont">&#xe639;</i>
              </span>
          </span>
          <span class="content2">
            占总gmv
            <span v-if="todayNormal.ratio!=''" style="color:black">{{todayNormal.ratio}}</span>
            <span v-else style="color:black">0%</span>
          </span>
        </div>
      </div>
      <!--<div class="box_img box_img2">
      </div>-->
      <img
        src="../../../assets/images/header_content.png"
        style=" width:100%;
        height:45px;
        margin-bottom:5px;"
      />
      <div class="box_line"></div>
      <div class="box_bottom">
        <div class="bottom_left">
          <p class="left_left">今日目标达成率</p>
          <p
            class="left_bottom"
            v-if="todayNormal.todayTargetProgress!=''"
          >{{todayNormal.todayTargetProgress}}</p>
          <p class="left_bottom" v-else>0%</p>
        </div>
        <div class="bottom_left">
          <p class="left_left">本月目标达成率</p>
          <p
            class="left_bottom"
            v-if="todayNormal.monthlyTargetProgress!=''"
          >{{todayNormal.monthlyTargetProgress}}</p>
          <p class="left_bottom" v-else>0%</p>
        </div>
      </div>
    </el-card>
    <!--Dau数据-->
    <el-card class="box-card">
      <div class="box_header">
        <p class="top_header1">
          <span>DAU(人)</span>
          <span>
            <el-tooltip class="item" effect="dark" content="当天访问Fingo平台的用户数" placement="top">
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </span>
        </p>
        <p class="top_header2">更新时间：{{todayUser.updateTime}}</p>
      </div>
      <div class="box_content">
        <span class="content1" v-if="todayUser.volume!=''">{{todayUser.volume}}</span>
        <span class="content1" v-else>0</span>
        <span class="content2" style="height:52px">
            昨日同比
            <span style="vertical-align: middle;color: red;" v-if="todayUser.change.indexOf('-')==-1">
              {{todayUser.change}}
              <i class="iconfont">&#xe645;</i>
              </span>
              <span style="vertical-align: middle;color: green;" v-else>
              {{todayUser.change}}
              <i class="iconfont">&#xe639;</i>
              </span>
          </span>
      </div>
      <!-- <div class="box_img box_img3">
      </div>-->
      <img
        src="../../../assets/images/header_content1.png"
        style=" width:100%;
        height:45px;
        margin-bottom:5px;"
      />
      <div class="box_line"></div>
      <div class="box_dau">
        <div class="bottom_left">
          <p class="left_left">今日目标达成率</p>
          <p
            class="left_bottom"
            v-if="todayUser.todayTargetProgres!=''"
          >{{todayUser.todayTargetProgress}}</p>
          <p class="left_bottom" v-else>0%</p>
        </div>
      </div>
    </el-card>
    <!--普货转化率-->
    <el-card class="box-card">
      <div class="box_header">
        <p class="top_header1">
          <span>App普货转化率</span>
          <span>
            <el-tooltip
              class="item"
              effect="dark"
              content="对应时间内，产生非礼包支付订单的用户数/访问APP的用户数(App-DAU)"
              placement="top"
            >
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </span>
        </p>
        <p class="top_header2">更新时间：{{changeNormal.updateTime}}</p>
      </div>
      <div class="box_content">
        <span class="content1" v-if="changeNormal.volume!=''">{{changeNormal.volume}}</span>
        <span class="content1" v-else>0</span>
        <span class="content2" style="height:52px">
            昨日同比
            <span style="vertical-align: middle;color: red;" v-if="changeNormal.change.indexOf('-')==-1">
              {{changeNormal.change}}
              <i class="iconfont">&#xe645;</i>
              </span>
              <span style="vertical-align: middle;color: green;" v-else>
              {{changeNormal.change}}
              <i class="iconfont">&#xe639;</i>
              </span>
          </span>
      </div>
      <!--<div class="box_img box_img4">
      
      </div>-->
      <img
        src="../../../assets/images/header_content2.png"
        style=" width:100%;
        height:45px;
        margin-bottom:5px;"
      />
      <div class="box_line"></div>
      <div class="box_dau">
        <div class="bottom_left">
          <p class="left_left">今日目标达成率</p>
          <p
            class="left_bottom"
            v-if="changeNormal.todayTargetProgress!=''"
          >{{changeNormal.todayTargetProgress}}</p>
          <p class="left_bottom" v-else>0%</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "overviewHeader",
  props: {
    todayGiftGmv: {
      type: Object,
      default: () => {
        return {
          monthlyTargetProgress: "",
          ratio: "0%",
          todayTargetProgress: "",
          updateTime: "",
          volume: "",
          change:''
        };
      }
    },
    todayNormal: {
      type: Object,
      default: () => {
        return {
          monthlyTargetProgress: "",
          ratio: "0%",
          todayTargetProgress: "",
          updateTime: "",
          volume: "",
          change:''
        };
      }
    },
    todayUser: {
      type: Object,
      default: () => {
        return {
          monthlyTargetProgress: "",
          ratio: "0%",
          todayTargetProgress: "",
          updateTime: "",
          volume: "",
          change:''
        };
      }
    },
    changeNormal: {
      type: Object,
      default: () => {
        return {
          monthlyTargetProgress: "",
          ratio: "0%",
          todayTargetProgress: "",
          updateTime: "",
          volume: "",
          change:''
        };
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  mounted(){
    console.log(this.todayGiftGmv.change.indexOf('－'))
  }
};
</script>

<style lang="scss" scoped>
.data_header {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .el-card {
    width: 24%;
    .box_header {
      .top_header1 {
        font-size: 16px;
        color: #7f7f7f;
        display: flex;
        justify-content: space-between;
      }
      .top_header2 {
        margin: 5px 0;
        font-size: 12px;
        color: #cccccc;
      }
    }
    .box_content {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      .content1 {
        font-size: 25px;
        font-weight: 900;
      }
      .content_all {
        display: flex;
        flex-direction: column;
      }
      .content2 {
        line-height: 25px;
        color: #7f7f7f;
        font-size: 12px;
      }
    }
    .box_img {
      width: 100%;
      height: 45px;

      margin-bottom: 5px;
      background-repeat: no-repeat;
      // background-position-y: bottom
    }
    .box_img1 {
      background-image: url(../../../assets/images/header_top.png);
      background-size: 100%, 100%;
      // background-position-y: unset;
    }
    .box_img2 {
      background-image: url(../../../assets/images/header_content.png);
      background-size: 100%, 100%;
    }
    .box_img3 {
      background-image: url(../../../assets/images/header_content1.png);
      background-size: 100%, 100%;
    }
    .box_img4 {
      background-image: url(../../../assets/images/header_content2.png);
      background-size: 100%, 100%;
    }
    .box_line {
      height: 1px;
      width: 100%;
      background-color: #7f7f7f;
      margin-bottom: 5px;
    }
    .box_bottom {
      display: flex;
      justify-content: space-between;
      .bottom_left {
        text-align: center;
        color: #7f7f7f;
        .left_bottom {
          line-height: 2;
        }
        .left_left {
          font-size: 12px;
        }
      }
    }
    .box_dau {
      text-align: center;
      .bottom_left {
        text-align: center;
        color: #7f7f7f;
        .left_bottom {
          line-height: 2;
        }
      }
      .left_left {
        font-size: 12px;
      }
    }
  }
  /deep/ .el-card__body {
    padding-bottom: 10px;
  }
}
</style>
