<template>
  <div class="task-list">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="导入任务" name="first"></el-tab-pane>
      <el-tab-pane label="导出任务" name="second"></el-tab-pane>
    </el-tabs>
    <el-form ref="directMailFilter" inline label-width="80px" :model="queryData">
      <el-form-item class="filter-item" label="时间：">
        <el-select v-model="queryData.timeChose" placeholder="请选择" @change="timeChoseChange">
          <el-option
            v-for="(item, index) in timeChoseList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="timeList" class="filter-item">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="queryData.timeList"
          size="medium"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <span>
        <el-form-item
          prop="importType"
          label="任务类型："
          class="filter-item"
          v-if="activeName=='first'"
        >
          <el-select v-model="queryData.importType" placeholder="请选择">
            <el-option
              v-for="(val, key) in importTypeList"
              :key="key"
              :label="val.label"
              :value="val.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </span>
      <span>
        <el-form-item
          prop="exportType"
          label="任务类型："
          class="filter-item"
          v-if="activeName=='second'"
        >
          <el-select v-model="queryData.exportType" placeholder="请选择" clearable>
            <el-option
              v-for="(val, key) in exportTypeList"
              :key="key"
              :label="val.label"
              :value="val.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </span>

      <el-form-item class="filter-item" label="提交人：">
        <el-select v-model="queryData.buyerId" placeholder="请选择">
          <el-option
            v-for="val in buyerList"
            :key="val.sysUserId"
            :label="val.nickName"
            :value="val.sysUserId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="filter-item" label="任务状态：">
        <el-select v-model="queryData.importStatus" placeholder="请选择">
          <el-option
            v-for="(item, index) in importStatusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="filter-item" style="margin-left: 20px;">
        <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
        <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="任务号" width="200" align="center" fixed="left">
        <template slot-scope="scope">
          <div>{{activeName=='first'?scope.row.importNo:scope.row.exportNo || '-'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="提交日期" width="200" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.submitTime | formatTime}}</div>
        </template>
      </el-table-column>
      <el-table-column label="任务开始时间" width="200" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.startTime | formatTime}}</div>
        </template>
      </el-table-column>
      <el-table-column label="任务结束时间" width="200" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.endTime | formatTime}}</div>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" width="130" align="center">
        <template slot-scope="scope">{{activeName=='first'?(scope.row.importType === 1? '确认采购':''):exportType(scope.row.exportType)}}</template>
      </el-table-column>
      <el-table-column label="提交人" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.submitName }}</template>
      </el-table-column>
      <el-table-column label="状态" width="130" align="center">
        <template slot-scope="scope" >{{activeName=='first'?importStatus[scope.row.importStatus]:exportStatus(scope.row.exportStatus)}}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button v-if="activeName=='first'" type="text" @click="detailClick(scope.row.importNo)">详情</el-button>
          <el-button
            type="text"
            v-if="scope.row.importStatus === 2"
            @click="errorClick(scope.row.errorUrl)"
          >下载错误记录</el-button>
          <el-button type="text" v-if="scope.row.exportStatus==3" @click="successClick(scope.row)">下载</el-button>
          <span v-if="scope.row.exportStatus==2">导出失败,请重新导出</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-wrapper">
      <el-pagination
        @size-change="handleSizeChanges"
        @current-change="handleCurrentChanges"
        :current-page="queryData.page.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryData.page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { listSysUserByPage } from "@/request/staff";
import { PurEnsureImportPage,PurExportTaskPage } from "@/request/purchase";

export default {
  data() {
    return {
      activeName: "first",
      queryData: {
        timeChose: "1",
        timeList: [],
        importType: 1,
        buyerId: "",
        importStatus: '',
        exportType:'',
        page: {
          pageNum: 1,
          pageSize: 10
        }
      },
      exportTypeList: [
        {
          value: 1,
          label: "采购单批量导出"
        },
        {
          value: 2,
          label: "采购单批量导出（不带图)"
        }
      ],
      total: 0,
      timeChoseList: [
        {
          value: "1",
          label: "提交时间"
        },
        {
          value: "2",
          label: "任务开始时间"
        },
        {
          value: "3",
          label: "任务结束时间"
        }
      ],
      importTypeList: [
        {
          value: 1,
          label: "确认采购"
        }
      ],
      buyerList: [],
      importStatusList: [
        {
          value: 1,
          label: "导入处理中"
        },
        {
          value: 2,
          label: "导入失败"
        },
        {
          value: 3,
          label: "导入成功"
        }
      ],
      tableData: [],
      importStatus: {
        1: "导入处理中",
        2: "导入失败",
        3: "导入成功"
      }
    };
  },
  mounted() {
    this.getBuyerList();
    this.getPurEnsureImportPage();
  },
  methods: {
    /**
     * 获取采购负责人列表
     */
    getBuyerList() {
      let params = {
        page: {
          pageNum: 1,
          pageSize: 1000
        },
        groupIds: [68, 69, 70]
      };
      listSysUserByPage(params)
        .then(res => {
          if (res.ret.errcode === 1) {
            this.buyerList = res.sysUserPb;
          }
        })
        .catch(err => {
          console.log(err);
        });
      console.log(this.buyerList);
    },
    exportType(type){
      var str=''
      if(type==1){
        str='采购单批量导出'
      }else if(type==2){
        str='采购单批量导出（不带图)'
      }
      return str
    },
    exportStatus(status){
      var str=''
      if(status==1){
        str='进行中'
      }else if(status==2){
        str='失败'
      }else if(status==3){
        str='成功'
      }
      return str
    },
    timeChoseChange(val) {
      console.log(val);
      this.queryData.timeChose = val;
    },
    getPurEnsureImportPage() {
      let params = {};
      console.log(this.queryData.timeChose);
      if (this.queryData.timeChose === "1") {
        Object.assign(params, {
          beginSubmitTime:
            this.queryData.timeList.length !== 0
              ? this.queryData.timeList[0]
              : '',
          endSubmitTime:
            this.queryData.timeList.length !== 0
              ? this.queryData.timeList[1]
              : '',
          beginStartTime: '',
          endStartTime: '',
          beginEndTime: '',
          endEndTime: '',
          importType: this.queryData.importType,
          buyerId: this.queryData.buyerId,
          importStatus: this.queryData.importStatus,
          exportType:this.queryData.exportType,
          exportStatus:this.queryData.importStatus,
          page: this.queryData.page
        });
      }
      if (this.queryData.timeChose === "2") {
        Object.assign(params, {
          beginSubmitTime: '',
          endSubmitTime: '',
          beginStartTime:
            this.queryData.timeList.length !== 0
              ? this.queryData.timeList[0]
              : '',
          endStartTime:
            this.queryData.timeList.length !== 0
              ? this.queryData.timeList[1]
              : '',
          beginEndTime: '',
          endEndTime: '',
          importType: this.queryData.importType,
          buyerId: this.queryData.buyerId,
          importStatus: this.queryData.importStatus,
           exportType:this.queryData.exportType,
           exportStatus:this.queryData.importStatus,
          page: this.queryData.page
        });
      }
      if (this.queryData.timeChose === "3") {
        Object.assign(params, {
          beginSubmitTime: '',
          endSubmitTime: '',
          beginStartTime: '',
          endStartTime: '',
          beginEndTime:
            this.queryData.timeList.length !== 0
              ? this.queryData.timeList[0]
              : '',
          endEndTime:
            this.queryData.timeList.length !== 0
              ? this.queryData.timeList[1]
              : '',
          importType: this.queryData.importType,
          buyerId: this.queryData.buyerId,
          importStatus: this.queryData.importStatus,
           exportType:this.queryData.exportType,
           exportStatus:this.queryData.importStatus,
          page: this.queryData.page
        });
      }

      if(this.activeName=='first'){
        delete params.exportType
        delete params.exportStatus
         PurEnsureImportPage(this.filterData(params)).then(res => {
        if (res.ret.errcode === 1) {
          console.log(res);
          this.tableData = res.list;
          this.total = res.total;
        }
      });
      }else{
        delete params.importStatus
        delete params.importType
        PurExportTaskPage(this.filterData(params)).then(res=>{
          if (res.ret.errcode === 1) {
          console.log(res);
          this.tableData = res.list;
          this.total = res.total;
        }
        })
      }
     
    },
    handleSizeChanges(val) {
      this.queryData.page.pageSize = val;
      this.getPurEnsureImportPage();
    },
    handleCurrentChanges(val) {
      this.queryData.page.pageNum = val;
      this.getPurEnsureImportPage();
    },
    search() {
      this.getPurEnsureImportPage();
    },
    resetSearch() {
      Object.assign(this.queryData, {
        timeChose: "1",
        timeList: [],
        importType: 1,
        buyerId: "",
        importStatus: null,
        exportType:'',
        page: {
          pageNum: 1,
          pageSize: 10
        }
      }),
        this.getPurEnsureImportPage();
    },
    searchBuyer(id) {
      let item = this.buyerList.find(val => {
        return id === val.sysUserId;
      });
      // console.log(item)
      return item ? item.nickName : "-";
    },
    detailClick(importNo) {
      this.$router.push({
        name: "taskDetail",
        query: {
          importNo: importNo
        }
      });
    },
    errorClick(url) {
      window.open(this.dealShowFileSrc(url));
    },
    //成功之后的下载
    successClick(row){
      window.open(this.dealShowFileSrc(row.exportFileUrl));
    },
    handleClick(tab) {
      if(tab.name=='first'){
        this.importStatusList=[
          {
            value: 1,
            label: "导入处理中"
          },
          {
            value: 2,
            label: "导入失败"
          },
          {
            value: 3,
            label: "导入成功"
          }
        ]
      }else{
        this.importStatusList=[
          {
            value: 1,
            label: "导出处理中"
          },
          {
            value: 2,
            label: "导出失败"
          },
          {
            value: 3,
            label: "导出成功"
          }
        ]
      }
      this.queryData.page.pageNum=1
      this.getPurEnsureImportPage()
    }
  }
};
</script>
<style lang="scss" scoped>
.task-list {
  overflow: scroll;
}
</style>