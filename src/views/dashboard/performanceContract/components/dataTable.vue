<template>
  <div class="data-table">
    <div class="data-title">
      <div>{{ title }}</div>
      <el-button type="primary" icon="el-icon-download" @click="exportTable">导出数据</el-button>
    </div>
    <el-table :data="tableList" style="width: 100%" border max-height="180">
      <el-table-column label="下单日期" width="180" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.date }}</div>
        </template>
      </el-table-column>
      <el-table-column label="SO出库异常单量" width="180" align="center" v-if="type==1">
        <template slot-scope="scope">
          <div>{{scope.row.outErrorNum}}</div>
        </template>
      </el-table-column>
      <el-table-column label="SO出库异常GMV" width="180" align="center" v-if="type==1">
        <template slot-scope="scope">
          <div>{{scope.row.outErrorGmv}}</div>
        </template>
      </el-table-column>
      <el-table-column label="SO跨境异常" width="180" align="center" v-if="type==1">
        <template slot-scope="scope">
          <div>{{scope.row.overseaErrorNum}}</div>
        </template>
      </el-table-column>
      <el-table-column label="SO跨境异常GMV" width="180" align="center" v-if="type==1">
        <template slot-scope="scope">
          <div>{{scope.row.overseaErrorGmv}}</div>
        </template>
      </el-table-column>
      <el-table-column label="SO宅配异常单量" width="160" align="center" v-if="type==1">
        <template slot-scope="scope">
          <div>{{scope.row.deliveryErrorNum}}</div>
        </template>
      </el-table-column>
      <el-table-column label="SO宅配异常GMV" width="160" align="center" v-if="type==1">
        <template slot-scope="scope">
          <div>{{scope.row.deliveryErrorGmv}}</div>
        </template>
      </el-table-column>
      <el-table-column label="开始日期" width="160" align="center" v-if="type==2">
        <template slot-scope="scope">
          <div>{{scope.row.deliveryStartTime}}</div>
        </template>
      </el-table-column>
      <el-table-column label="完成日期" width="160" align="center" v-if="type==2">
        <template slot-scope="scope">
          <div>{{scope.row.deliveryEndTime}}</div>
        </template>
      </el-table-column>
      <el-table-column label="宅配时效" width="160" align="center" v-if="type==2">
        <template slot-scope="scope">
          <div>{{scope.row.timeTaken}}</div>
        </template>
      </el-table-column>
      <el-table-column label="出库单号" width="160" align="center" v-if="type==2">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="goPurchaseOrderOutNo(scope.row.outNo)"
          >{{scope.row.outNo}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="PO采购单号" align="center" v-if="type==3">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="goPurchaseOrder(scope.row.purchaseOrderNo)"
          >{{scope.row.purchaseOrderNo}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="异常类型" width="160" align="center" v-if="type==3">
        <template slot-scope="scope">
          <div>{{scope.row.errorType}}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { RouteAndExport } from "@/request/fileCenter";
export default {
  props: {
    title: String,
    total: {
      type: Number,
      default: 0,
    },
    tableList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    type: {
      type: Number,
      default: 1,
    },
    queryData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      dataTitle: "",
      page: {
        pageSize: 10,
        pageNum: 1,
      },
    };
  },
  watch: {
    title: {
      handler(newval) {
        this.dataTitle = newval;
      },
    },
  },
  methods: {
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.$emit("on-page-select", {
        page: this.page,
        type: this.type,
      });
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.$emit("on-page-select", {
        page: this.page,
        type: this.type,
      });
    },
    //导出数据
    exportTable() {
      RouteAndExport({
        type: this.type == 1 ? 7 : this.type == 2 ? 6 : 5,
        param: JSON.stringify(this.queryData),
      })
        .then((response) => {
          if (response.ret.errcode == 1) {
            switch (response.code) {
              case 1:
              case 2:
              case 3:
                this.$notify({
                  title: "生成导出任务成功",
                  message:
                    "导出的数据文件正在生成中，请至文件中心查看进度并下载",
                  type: "success",
                  onClose: () => {
                    this.$router.push("/fileCenter/exportList");
                  },
                  duration: 1500,
                });
                break;
              case 4:
                this.$notify({
                  title: "生成导出任务失败",
                  message: "任务生成失败，请稍后再试",
                  type: "info",
                });
                break;
              case 5:
                this.$notify({
                  title: "导出限制",
                  message: "相同参数的导出任务，同个用户15分钟内只允许导出一次",
                  type: "info",
                });
                break;

              case 6:
                this.$notify({
                  title: "请勿反复提及导出任务",
                  message: "请勿重复提交，30秒后再尝试",
                  type: "info",
                });
              default:
                break;
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    goPurchaseOrder(purchaseOrderNo){
        // this.$router.push({
        //     path:'/purchaseManage/purchaseOrder',
        //     query:{
        //         purchaseOrderNo:purchaseOrderNo
        //     }
        // })
        let url
        switch (window.location.host) {
            case 'localhost:8080':
                url = `http://localhost:8080/#/purchaseManage/purchaseOrder?purchaseOrderNo=${purchaseOrderNo}`
                break;
            case 'boss-test.fingo.shop':
                url = `https://boss-test.fingo.shop/#/purchaseManage/purchaseOrder?purchaseOrderNo=${purchaseOrderNo}`
                break;
            case 'boss.fingo.shop':
                url = `https://boss.fingo.shop/#/purchaseManage/purchaseOrder?purchaseOrderNo=${purchaseOrderNo}`
                break;
        }
        window.open(url)
    },
    goPurchaseOrderOutNo (outNo) {
        let url
        switch (window.location.host) {
            case 'localhost:8080':
                url = `http://localhost:8080/#/warehouseManage/sockOutOrder?outNo=${outNo}`
                break;
            case 'boss-test.fingo.shop':
                url = `https://boss-test.fingo.shop/#/warehouseManage/sockOutOrder?outNo=${outNo}`
                break;
            case 'boss.fingo.shop':
                url = `https://boss.fingo.shop/#/warehouseManage/sockOutOrder?outNo=${outNo}`
                break;
        }
        window.open(url)
    }
  },
};
</script>
<style lang="scss" scoped>
.data-table {
  .data-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
</style>