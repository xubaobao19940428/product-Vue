<template>
  <div class="chart_view">
    <div class="check_button">
        <el-button-group>
            <el-button v-for="(item,index) in checkButton" :key="index" @click="clickType(index,item.value)" class="btn" :class="{'isactive':isChange === index}">
                {{item.name}}
            </el-button>
        </el-button-group>
    </div>
    <div id="chart_line" style="width:100%;height:250px" ref="lineChart"></div>
    <div id="chart_bar" style="width:100%;height:100px" ref="barChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
// let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
// let boxCallback = (mutationList) => {
//             console.log('box callback is called');
//         for (let mutation of mutationList) {
//             console.log(mutation);
//             console.log(mutation.target);
//             console.log('oldValue: ' + mutation.oldValue);
//             console.log('');
//             }
//         };
// let observer_box = new MutationObserver(boxCallback);

export default {
  name: 'chartView',
  props:{
      checkValue:{
          type:String,
          default:'1',
      },
     barData:{
           type:Object,
           default:()=>{
               return {
                   xAxis:[],
                   payBarData:[],
                   sealBarData:[]
               }

           }
        },
        watchTypeChange:{
            type:Number,
            default:0
        },
        lineData:{
            type:Object,
            default:()=>{
                return {
                    xAxis:[],
                    payNum:[],
                    sealNum:[]
                }
            }
        }
  },
  data() {
    return {
        lineChart:null,
        barChart:null,
        resizeLine:'',
        resizeBar:'',
        checkButton:[
            {name:'普货订单',value:'1'},
            {name:'用户',value:'2'}
        ],
        isChange:0,
        changeType:['支付订单数','售出件数'],
        changeColor:['#2f4553','#c23531','#2f4553','#c23531'],
        
    };
  },
  computed:{
  },
  watch:{
      //类型
      checkValue:{
           handler(newVal, oldVal) {
				if(newVal=='1'){
                    this.isChange=0
                }
            },
            deep: true
      },
      barData:{
          handler(newVal, oldVal) {
				if(newVal){
                    this.setOption()
                }
            },
        deep: true
      },
     lineData:{
          handler(newVal, oldVal) {
				if(newVal){
                    this.setOptionLine()
                }
            },
        deep: true
      },
      //监听type发生变化
    //   watchTypeChange:{
    //       handler(newVal, oldVal) {
    //           console.log(newVal,oldVal)
    //           if(newVal!=0){
    //               this.changeType=['支付订单数','售出件数']
    //               this.changeColor=['#2f4553','#c23531']
    //           }else{
    //               this.changeType=['注册用户数','新增PS数']
    //               this.changeColor=['#2f4553','#c23531']
    //           }
    //         },
    //     deep: true
    //   },
      isCollapse:{
          handler(newVal, oldVal) {
                setTimeout(()=>{
                    this.lineChart.resize()
                    this.barChart.resize()
                },800)
            },
        deep: true
      }
  },
  computed:{
      isCollapse(){
          return this.$store.state.app.isCollapse
      }
  },
  methods: {
      //订单和用户按钮传参是用户还是订单
      clickType(index,value){
          console.log(value)
          this.isChange=index
          this.checkValue=value
          this.$emit('changeValue',this.checkValue)
          if(value=='1'){
              this.changeType=['支付订单数','售出件数']
              this.changeColor=['#2f4553','#c23531']
          }else{
              this.changeType=['注册用户数','新增PS数']
              this.changeColor=['#2f4553','#c23531']
          }
      },
      initChart() {
                this.lineChart = echarts.init(this.$refs.lineChart);
                this.resizeLine = _.throttle(this.lineChart.resize, 100);
                this.barChart = echarts.init(this.$refs.barChart);
                this.resizeBar = _.throttle(this.barChart.resize, 100);
                window.addEventListener('resize', this.resizeLine);
                window.addEventListener('resize',this.resizeBar)
                window.addEventListener('onorientationchange',this.resizeLine)
                window.addEventListener('onorientationchange',this.resizeBar)
            
            },
            /*
            * 折线图显示
            */
            setOptionLine(){
                
                 if(this.lineChart){
                    this.lineChart.clear()
                }else{
                    this.lineChart = echart.init(this.$refs.lineChart)
                }
                let setData = this.lineData
                   let options = {
                    // backgroundColor:'#11183c',

	                grid: {
                        left: '10%',
                        right: '10%',
                        bottom:'0',
                        containLabel: true
	            	},
	            	tooltip : {
	            		show: true,
	            		trigger: 'axis',
                        formatter:function(params){
                            // if(this.checkValue==1){
                            return `<p>
                            <span style="display:inline-block;width:10px;height:10px;background:#2f4553;border-radius:50%">
                            </span>${params[0].seriesName}:${params[0].data.value}</p>
                            <p style="padding-left:10px">同比增长率:${params[0].data.change}</p>
                            <p>
                            <span style="display:inline-block;width:10px;height:10px;background:#c23531;border-radius:50%">
                            </span>${params[1].seriesName}:${params[1].data.value}</p>
                            <p style="padding-left:10px">同比增长率:${params[1].data.change}</p>
                            `
                            // }
                            
                        }
	            	},
	            	legend: {
                        x:'center',
	            		y:'20',
	            		show:true,
	            		icon:'circle',
	            		itemWidth:10,
	            		itemHeight:10,
	            		data:this.changeType,
	            	},
	            	xAxis : [
	                    {
	                        type : 'category',
	                        boundaryGap : true,
	                        axisLine:{
                           		show:true,
                           		lineStyle:{
	            	            	color:'black'
	            	            }
	            			},
	            			axisTick:{
	                        	show:true,
	                        },

	                        data:setData.xAxis
                        }
	                ],
	                yAxis : [
	            		{
	            			type : 'value',
	            			name : '',
	            			axisLabel : {
	            				formatter: '{value}',
	            			},
	            			axisLine:{
	            				lineStyle:{
	            					color:'#195384'
	            				}
	            			},
	            			axisTick:{
	                        	show:true,
	                        },
	            			splitLine:{
	            				show:false,
	            				lineStyle:{
	            					color:'#11366e'
	            				}
	            			}
	            		}
	            	],
	            	series : [
	            		{
	            			name:this.changeType[0],
	            			type:'line',
	            			// stack: '总量',
	            			symbol:'circle',
	            			symbolSize: 5,
                            smooth:true,
							label:{
								normal:{
									textStyle:{
									}
								}
							},
	                        itemStyle: {
	            		        normal: {
	            					color:this.changeColor[0],
	            		            lineStyle: {
	            						color: this.changeColor[0],
	            						width:1,

	            		            },
									label:{
										show:true,
									}
	            		        },

	            			},
	            			markPoint:{
	            				itemStyle:{
	            					normal:{
	            						color:'red'
	            					}
	            				}
	            			},
							animation:true,
	            			data:setData.payNum,
							animationDuration:2000,
						},
	            		{
	            			name:this.changeType[1],
	            			type:'line',
	            			// stack: '总量',
	            			symbol:'circle',
	            			symbolSize: 5,
                            smooth:true,
							label:{
								normal:{
									textStyle:{

									}
								}
							},
	                        itemStyle: {
	            		        normal: {
	            		            color:this.changeColor[1],
	            		            lineStyle: {
	            						color: this.changeColor[1],
	            						width:1
	            		            },
									label:{
										show:true,
									}
	            		        }
	            			},
							animation:true,
	            			data:setData.sealNum,
							animationDuration:2000,
	            		}
	            	]
                };
                this.lineChart.setOption(options,true);
        },
            /*
            * 柱状图显示
            */
            setOption(){
                if(this.barChart){
                    this.barChart.clear()
                }else{
                    this.barChart = echart.init(this.$refs.barChart)
                }
                let settingData = this.barData
                var that = this
                let options = {
                    // backgroundColor: '#00265f',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: this.changeType,
                        show:false,

                    },
                    grid: {
                        left: '10%',
                        right: '10%',
                        top:'10',
                        bottom:'0',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: settingData.xAxis,
                        show:true,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#195384",
                                width: 1,
                                type: "solid",
                            }
                        },
                        axisTick: {
                            show: true,
                        },
                    }],
                    yAxis: [{
                        type: 'value',
                        show:true,
                        axisTick: {
                            show: true,
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#195384",
                                // width: 1,
                                type: "solid"
                            },
                        },
                        splitLine: {
                            show:false,
                            lineStyle: {
                                color: "#063374",
                            }
                        }
                    }],
                    series: [{
                        name: this.changeType[0],
                        type: 'bar',
                        data: settingData.payBarNum,
                        // barWidth: 13, //柱子宽度
                        barGap: 0.2 , //柱子之间间距
                         barMinHeight:10,
                        itemStyle: {
                            normal: {
                                color: this.changeColor[0],
                                opacity: 1,
                            }
                        },
                        animation:true,
                        animationDuration:2000,
                    }, {
                        name: this.changeType[1],
                        type: 'bar',
                        data: settingData.sealBarNum,
                        // barWidth: 13,
                        barGap: 0.2,
                        barMinHeight:10,
                        itemStyle: {
                            normal: {
                                color: this.changeColor[1],
                                opacity: 1,
                            }
                        },
                        animation:true,
                        animationDuration:2000,
                    }]
                };
                this.barChart.setOption(options,true);
        }
  },
  mounted(){
      this.initChart()
      this.setOption()
      this.setOptionLine()
      console.log(this.$store.state.app.isCollapse)
  }
};
</script>

<style lang="scss" scoped>
.chart_view{
    width:100%;
    height:auto;
    .isactive {
        color: #409eff!important;
        background: #ecf5ff!important;
        border-color: #b3d8ff!important;
        }
    .btn{
        background: #FFF;
        border: 1px solid #DCDFE6;
    }
    /deep/ .el-card__body{
        padding-bottom:0;
    }
}
</style>
