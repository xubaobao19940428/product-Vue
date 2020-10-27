<template>
  <el-dialog
    title="SKU发货详情"
    :visible.sync="toggle"
    width="60%"
    :append-to-body="true"
    :before-close="closeDialog"
    class="ship-dialog"
  >
    <div class="ship-item">
      <img :src="dealShowFileSrc(shipItemData.productCover)" class="thumbnail" />
      <div class="ship-desc">{{shipItemData.productName}}</div>
      <div class="ship-skudesc">{{shipItemData.skuDesc}}</div>
      <div>采购数量：{{shipItemData.purchaseCount}}</div>
    </div>
    <el-table :data="shipData" style="width: 100%; font-size: 10px">
      <el-table-column label="物流单号" min-width="140px" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.logiCode}}</div>
        </template>
      </el-table-column>
      <el-table-column label="物流公司" min-width="140px" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.logiCompany}}</div>
        </template>
      </el-table-column>
      <el-table-column label="发货数量" min-width="140px" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.deliveryCount}}</div>
        </template>
      </el-table-column>
      <el-table-column label="入库数量" min-width="140px" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.incomeNum}}</div>
        </template>
      </el-table-column>
      <el-table-column label="异常数量" min-width="140px" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.abnormalNum}}</div>
        </template>
      </el-table-column>
      <el-table-column label="签收状态" align="center" min-width="120px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.signStatus === 1" type="success" size="mini">仓储签收</el-tag>
          <el-tag v-if="scope.row.signStatus === 2" size="mini">仓储未签收</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="incomeStatus" min-width="120px" align="center" label="入库状态">
          <template slot-scope="scope">
            <el-tag effect="plain" v-if="scope.row.incomeStatus === 1" size="mini">已入库</el-tag>
            <el-tag
              effect="plain"
              v-if="scope.row.incomeStatus === 2"
              type="success"
              size="mini"
            >未入库</el-tag>
            <el-tag effect="plain" v-if="scope.row.incomeStatus === 3" size="mini">已取消</el-tag>
            <el-tag effect="plain" v-if="scope.row.incomeStatus === 4" size="mini">已完结</el-tag>
          </template>
        </el-table-column>
      <el-table-column label="系统发货时间" min-width="140px" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.deliveryTime}}</div>
          <div>{{formatSeconds(scope.row.deliveryTimeContinue)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="签收时间" min-width="140px" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.signTime}}</div>
          <div>{{formatSeconds(scope.row.signTimeContinue)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="入库时间" min-width="140px" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.incomeTime}}</div>
          <div>{{formatSeconds(scope.row.incomeTimeContinue)}}</div>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog">关 闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    shipData: Array,
    shipItemData: {
      type: Object,
      default: {},
    },
  },
  computed: {
    toggle: {
      get: function () {
        return this.dialogVisible;
      },
      set: function () {},
    },
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    formatSeconds(mss) {
      let duration;
      let days = parseInt(mss / (1000 * 60 * 60 * 24));
      let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = parseInt((mss % (1000 * 60)) / 1000);
      if (days > 0)
        duration =
          days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
      else if (hours > 0)
        duration = hours + "小时" + minutes + "分" + seconds + "秒";
      else if (minutes > 0) duration = minutes + "分" + seconds + "秒";
      else if (seconds > 0) duration = seconds + "秒";
      return duration;
    },
  },
};
</script>
<style lang="scss" scoped>
.ship-dialog {
  .ship-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    .ship-desc {
      width: 300px;
      margin-left: 30px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
    .ship-skudesc {
      margin-right: 30px;
    }
  }
}
</style>