<template>
  <div class="group_manage">
    <el-dialog
      title="分组管理"
      :visible.sync="dialogVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-button type="primary" icon="el-icon-plus" size="small" @click="addCategoryGroup">新增分组</el-button>
      <el-table
        v-loading="loading"
        :data="secondTableData"
        style="width: 100%;text-align:center;margin-top:10px"
        ref="dragTable"
        :header-cell-style="{'background':'#fafafa','color':'black','font-weight':900}"
      >
        <el-table-column prop="name" label="分组名称" align="center" width="180"></el-table-column>
        <el-table-column label="关联二级类目" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.cateNames}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text">
              <i class="el-icon-top" @click.stop="move(scope.row, scope.$index,1)"></i>
            </el-button>
            <el-button type="text">
              <i class="el-icon-bottom" @click.stop="move(scope.row, scope.$index,2)"></i>
            </el-button>
            <el-button type="text">
              <i class="el-icon-edit" @click.stop="editSecondCategory(scope.row)"></i>
            </el-button>
            <el-button type="text">
              <i class="el-icon-delete" @click.stop="delCategory(scope.row.id)"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmSort">确 定</el-button>
      </span>
    </el-dialog>

    <second-category-edit
      :propShowDialog="propShowDialog"
      :propParam="params"
      :countryCode="countryCode"
      @on-close="closeDailog"
      :type="type"
      @on-confirm="confirmCategoryGroup"
    ></second-category-edit>
  </div>
</template>

<script>
import {
  categoryListGet,
  copyFrontCategory,
  CategoryGroupListGet,
  CategoryGroupGet,
  CategoryGroupSort,
  CategoryGroupDelete
} from "@/request/product";
import secondCategoryEdit from "./secondCategoryEdit";
import Sortable from "sortablejs";
export default {
  name: "frontGroupManage",
  components: {
    secondCategoryEdit,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    countryCode:{
      type:String,
      default:'MY'
    }
  },
  data() {
    return {
      secondTableData: [],
      pid: 1,
      level: 1,
      cateType: 1,
      propShowDialog: false,
      params: {
        pName: "",
        pid: "",
      },
      loading: false,
      type: "add",
      sortable: null,
      newList: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    getSecondCategory(params) {
      this.loading = true;
      this.query = params;
      this.params.pName = params.pName;
      this.params.pid = params.pid;
      var queryData = {
        pid: params.pid,
      };
      CategoryGroupListGet(queryData)
        .then((res) => {
          if (res.ret.errcode == 1) {
            this.secondTableData = res.categoryGroup;
            this.loading = false;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.secondTableData = [];
        });
    },
    //返回子类目分组名称
    returnCategoryName(data) {
      var categoryList = [];
      _.forEach(data, (item) => {
        categoryList.push(item.cateName);
      });
      return categoryList.join(",");
    },
    move(row, index, type) {
      // 1上移，2下移
      var data = {};
       data = row;
      if (type == 1) {
        if (index == 0) {
          this.$message.warning("已经是第一个了");
        } else {
          this.$set(
            this.secondTableData,
            index,
            this.secondTableData[index - 1]
          );
          this.$set(this.secondTableData, index - 1, data);
        }
      } else {
        if (index == this.secondTableData.length - 1) {
          this.$message.warning("已经是最后一个了");
        }else{
          this.$set(
            this.secondTableData,
            index,
            this.secondTableData[index+1]
          );
          this.$set(this.secondTableData, index+1, data);
        }
      }
      var sortParams={

      }
      var cateIdList=[]
      _.forEach(this.secondTableData,item=>{
        cateIdList.push(item.id)
      })
      sortParams.id = cateIdList
      sortParams.pid = this.query.pid
      CategoryGroupSort(sortParams).then(response=>{
        if(response.ret.errcode==1){
          
        }
      }).catch(error=>{
        console.log(error)
      })
    },
    // 删除分类
    delCategory(id) {
      this.$confirm("将永久删除此分组，确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          CategoryGroupDelete({
            id: id,
          }).then((res) => {
            if (res.ret.errcode === 1) {
              this.$message.success('删除成功')
              this.getSecondCategory(this.query);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //编辑二级类目
    editSecondCategory(data) {
      var params = {
        id: data.id,
      };
      CategoryGroupGet(params)
        .then((resultes) => {
          if (resultes.ret.errcode == 1) {
            Object.assign(this.params, resultes);
            this.type = "edit";
            this.propShowDialog = true;
          }
        })
        .catch((error) => {});
    },
    addCategoryGroup() {
      this.params = {
        pName: this.params.pName,
        pid: this.params.pid,
      };
      this.type = "add";
      this.propShowDialog = true;
    },
    //关闭弹窗
    closeDailog() {
      this.propShowDialog = false;
    },
    handleClose() {
      this.$emit("on-cancel-dialog");
    },
    confirmCategoryGroup() {
      this.propShowDialog = false;
      this.getSecondCategory(this.query);
    },
    //排序
    confirmSort(){
      var sortParams={

      }
      var cateIdList=[]
      _.forEach(this.secondTableData,item=>{
        cateIdList.push(item.id)
      })
      sortParams.id = cateIdList
      sortParams.pid = this.query.pid
      CategoryGroupSort(sortParams).then(response=>{
        if(response.ret.errcode==1){
          this.$emit('on-cancel-dialog')
        }
      }).catch(error=>{
        console.log(error)
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.group_manage {
  .el-table {
    /deep/ .cell {
      padding: 20px;
      /deep/ [class^="el-icon-"] {
        font-size: 20px;
        margin-right: 10px;
        font-weight: 900;
      }
    }
  }
}
</style>
