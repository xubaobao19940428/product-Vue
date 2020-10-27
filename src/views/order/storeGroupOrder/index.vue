<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        ref="supplierFilterForm"
        inline
        label-width="90px"
        :model="queryData"
      >
        <el-form-item
          label="第三方单号："
          class="filter-item"
          prop="supplierName"
        >
          <el-input
            placeholder="请输入第三方单号"
            size="medium"
            clearable
            v-model="queryData.supplierName"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item label="SO单号：" class="filter-item" prop="shortName">
          <el-input
            placeholder="请输入SO单号"
            size="medium"
            clearable
            v-model="queryData.shortName"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="付款方式："
          class="filter-item"
          prop="cooperativeStatus"
        >
          <el-select
            v-model="queryData.cooperativeStatus"
            size="medium"
            clearable
            @change="search"
          >
          </el-select>
        </el-form-item>
        <el-form-item label="国家：" class="filter-item" prop="status">
          <el-select
            v-model="queryData.status"
            size="medium"
            clearable
            @change="search"
          >
          </el-select>
        </el-form-item>
        <el-form-item label="时间类型：" class="filter-item">
          <el-select
            v-model="queryData.timeType"
            clearable
            size="medium"
            style="width: 100px"
          >
          </el-select>
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="queryData.timeList"
            type="daterange"
            size="medium"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态：" class="filter-item" prop="status">
          <el-select
            v-model="queryData.status"
            size="medium"
            clearable
            @change="search"
          >
          </el-select>
        </el-form-item>
        <el-form-item label="创建SO状态：" class="filter-item" prop="status">
          <el-select
            v-model="queryData.status"
            size="medium"
            clearable
            @change="search"
          >
          </el-select>
        </el-form-item>
        <el-form-item class="filter-item" style="margin-left: 20px">
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="search"
            size="medium"
            @keyup.enter.native="search"
            >搜索</el-button
          >
          <el-button
            icon="el-icon-refresh-left"
            @click="resetSearch"
            size="medium"
            >重置</el-button
          >
          <el-button type="primary" class="operator-item" size="medium"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="main-content-wrapper">
      <el-table
        :data="tableData"
        border
        height="100%"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column align="center" label="第三方订单号" width="200">
        </el-table-column>
        <el-table-column align="center" label="订单状态" min-width="120">
        </el-table-column>
        <el-table-column align="center" label="创建SO状态" min-width="190">
        </el-table-column>
        <el-table-column align="center" label="SO单号" min-width="140">
        </el-table-column>
        <el-table-column align="center" label="付款方式" width="100">
        </el-table-column>
        <el-table-column
          prop="cooperativeStatus"
          label="国家"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column prop="status" label="地址" align="center" width="150">
        </el-table-column>
        <el-table-column
          prop="cooperativeStatus"
          label="用户信息"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="cooperativeStatus"
          label="时间信息"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="160"
          fixed="right"
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-box">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="queryData.page.pageNum"
        :page-size="queryData.page.pageSize"
        layout="sizes, total, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100]"
        :total="totals"
      >
      </el-pagination>
    </div>
    <order-detail 
    :dialogVisible="dialogVisible" 
    ref="rderDetailRef"
    @on-cancel="cancelDialog"
    ></order-detail>
  </div>
</template>

<script>
import orderDetail from './components/orderDetail'
export default {
  // 供应商管理
  name: "storeGroupOrder",
  components: {
    orderDetail
  },
  data() {
    return {
      loading: false,
      totals: "",
      queryData: {
        supplierName: "",
        shortName: "",
        cooperativeStatus: null,
        status: null,
        timeList:[],
        timeType:'',
        page: {
          pageSize: 20,
          pageNum: 1,
        },
      },
      dialogVisible:false
    };
  },
  mounted() {},
  methods: {
   cancelDialog(){
     this.dialogVisible = false
   }
  },
};
</script>
