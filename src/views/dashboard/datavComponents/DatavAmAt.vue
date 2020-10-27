<template>
  <div class="datav_am_at">
    <ul v-if="dauData.length>0">
       <li >
                <p class="title">DAU  总计</p>
                <p class="money">{{dauData[0].volume}}</p>
                <p class="total" v-if="dauData[0].change.indexOf('-')==-1&&dauData[0].change!=''"><i class="el-icon-top"></i>{{dauData[0].change}}</p>
                <p class="total" v-else-if="dauData[0].change==''"><i class="el-icon-top"></i>0</p>
                <p class="total_bottom" v-else><i class="el-icon-bottom"></i>{{dauData[0].change}}</p>
            </li>
            <li>
                <p class="title">H5</p>
                <p class="money">{{dauData[1].volume}}</p>
                <p class="total" v-if="dauData[1].change.indexOf('-')==-1&&dauData[1].change!=''"><i class="el-icon-top"></i>{{dauData[1].change}}</p>
                <p class="total" v-else-if="dauData[1].change==''"><i class="el-icon-top"></i>0</p>
                <p class="total_bottom" v-else><i class="el-icon-bottom"></i>{{dauData[1].change}}</p>
            </li>
            <li>
                <p class="title">App</p>
                <p class="money">{{dauData[2].volume}}</p>
                <p class="total" v-if="dauData[2].change.indexOf('-')==-1&&dauData[2].change!=''"><i class="el-icon-top"></i>{{dauData[2].change}}</p>
                <p class="total" v-else-if="dauData[2].change==''"><i class="el-icon-top"></i>0</p>
                <p class="total_bottom" v-else><i class="el-icon-bottom"></i>{{dauData[2].change}}</p>
            </li>
    </ul>
  </div>
</template>

<script>
import {BigScreenDauStats} from '@/request/dataV'
export default {
  name: 'DatavAmAt',
  props:{
      dauData:{
          type:Array,
          default:()=>{
              return []
          }
      }
  },
  data() {
    return {

    };
  },
  computed:{
  },
  watch:{
  },
  methods: {
    //    userDataScreen(){
    //         BigScreenDauStats().then((res)=>{
    //             if(res.ret.errcode==1){
    //                 this.dauData = res.dauData
    //             }
    //         }).catch((err)=>{
    //             console.log(err)
    //         })
    //     },
  },
        mounted(){
            // this.userDataScreen()

        },
};
</script>

<style lang="scss" scoped>
.datav_am_at{
    width:100%;
    margin:0.165rem 0 .15rem;
    height: 1.2rem;
    ul{
        font-size:14px;
        display:flex;
        height:100%;
        li:first-child{
            width:40%;
            margin-right:0.05rem;
            background-image: url(../../../assets/images/dau_banner.png);
                // background:url(../../assets/images/)
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
        }
        li:nth-child(2){
            width:30%;
            margin-right:0.05rem;
            background-image: url(../../../assets/images/h5_banner.png);
                // background:url(../../assets/images/)
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
        }
        li:nth-child(3){
            width:30%;
            background-image: url(../../../assets/images/h5_banner.png);
                // background:url(../../assets/images/)
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
        }
        li{
            padding:0.05rem;
            padding-top: .12rem;
            height:1.06rem;
            box-sizing:border-box;
            p{
                text-align:center;
            }
            p[class="title"]{
                    font-size:.18rem;

                }
                p[class="money"]{
                    font-size:.3rem;
                    padding:.11rem 0;
                    color:#00EBFF;
                }
                p[class="total"]{
                    font-size:.18rem;
                    color:#FF0000;
                }
                p[class="total_bottom"]{
                    font-size:.18rem;
                    color:#13CE8C;
                }
        }
    }
}
</style>
