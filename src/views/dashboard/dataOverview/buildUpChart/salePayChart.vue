<template>
  <div class="sale_pay_chart">
      <div ref="pieChart" class="pie_chart" style="width:100%;height:400px">

      </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'salePayChart',
  props:{
      pieData: {
      type: Array,
      default: () => {
        return [];
      }
   }
  },
  data() {
    return {
      pieChart: null,
      resizePieChart: null,
    };
  },
  computed: {
    isCollapse() {
      return this.$store.state.app.isCollapse;
    }
  },
  watch:{
      isCollapse: {
      handler(newVal, oldVal) {
        setTimeout(() => {
        window.addEventListener(
            "resize",
            () => {
            this.pieChart.resize();
            },
            800
        );
        }, 100);
      },
      deep: true
    },
  },
  methods: {
      initChart(){
        this.pieChart = echarts.init(this.$refs.pieChart,'macarons');
        this.resizePieChart = _.throttle(this.pieChart.resize, 100);
        window.addEventListener("onorientationchange", this.resizePieChart);
      },
      setPieChart() {
      if (this.pieChart) {
        this.pieChart.clear();
      } else {
        this.pieChart = echarts.init(this.$refs.pieChart,'macarons');
      }
      let options = {
        title: {
          text: "普货品类分布图（支付GMV)",
          left: "35%",
          bottom:'0'
        },

        series: [
          {
            type: "pie",
            radius: "50%",
            bottom:0,
            center: ["50%", "50%"],
            data: this.pieData,
            animation: true,
            label: {
              position: "outer",
              alignTo: "none",
              bleedMargin: 5,
              formatter: "{value|{b}}\n{d}%\n{c}",
              rich: {
                value: {
                  fontSize: 14,
                  color: "black"
                }
              }
            },
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        ]
      };
      this.pieChart.setOption(options, true);
      this.pieChart.resize();
    },
  },
  mounted(){
      this.initChart()
      this.setPieChart()
  }
};
</script>

<style scoped>
.sale_pay_chart{
    position: absolute;
    top:20px;
}
</style>
