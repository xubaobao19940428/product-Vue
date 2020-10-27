<template>
  <div class="add_category">
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
      label-width="80px"
      label-position="left"
    >
      <el-form-item label="用户搜索:">
        <el-input v-model="formInline.buyerName" placeholder="请输入真实姓名" style="width:250px"></el-input>
      </el-form-item>
      <el-form-item label="类目分组:">
        <el-input v-model="formInline.groupName" placeholder="请输入类目分组"></el-input>
      </el-form-item>
      <el-form-item label="后台类目:">
        <el-cascader
          style="width: 300px"
          clearable
          filterable
          :props="{label: 'cateName', children: 'levelValue', value: 'cateId', lazy: true, lazyLoad: getBackSubCategory, checkStrictly: true,emitPath:false}"
          placeholder="请选择商品后台分组"
          :options="backCategoryOptions"
          v-model="formInline.cateId"
          class="normalOperatorBox"
          size="medium"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="getPurCateGroupQuery(0)"
          size="medium"
        >搜索</el-button>
        <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="add_table">
      <el-table
        :data="tableData"
        highlight-current-row
        border
        v-loading="loading"
        style="width: 100%;text-align:center;"
      >
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column property="buyerName" label="用户名" align="center"></el-table-column>
        <el-table-column property="realName" label="真实姓名" align="center"></el-table-column>
        <el-table-column property="permissionGroup" label="组织部门" align="center"></el-table-column>
        <el-table-column property="date" label="角色" align="center">
          <template slot-scope="scope">{{scope.row.role.join(',')}}</template>
        </el-table-column>
        <el-table-column label="类目分组" align="center">
          <template slot-scope="scope">{{returnGroupName(scope.row.group)}}</template>
        </el-table-column>
        <el-table-column property="createTime" label="创建时间" width="200" align="center"></el-table-column>
        <el-table-column property="updateTime" label="更新时间" width="200" align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link
              @click="editCategory(scope.row,'edit')"
              type="primary"
              :underline="false"
              style="margin-right:20px;"
              v-if="hasPermission('BTN_CATE_ROLE_EDIT')"
            >编辑</el-link>
            <el-link
              @click="editCategory(scope.row,'watch')"
              type="primary"
              :underline="false"
              style="margin-right:20px;"
              v-if="hasPermission('BTN_CATE_ROLE_DETAIL')"
            >查看详情</el-link>
            
            <el-link @click="deleteCategory(scope.row)" type="primary" :underline="false" v-if="hasPermission('BTN_CATE_ROLE_DETELE')">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="add_page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="formInline.page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!--编辑和查看dialog-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @click="handleDialogClose">
      <el-form :model="editForm" ref="editForm" :rules="editFormRule">
        <el-form-item label="类目分组:" :label-width="formLabelWidth" prop="group">
          <el-select
            placeholder="请选择类目分组"
            style="width:100%"
            v-model="editForm.group"
            multiple
            :disabled="isDisabled"
          >
            <el-option
              v-for="(item,index) in groupNameList"
              :key="index"
              :label="item.groupName"
              :value="item.groupId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名:" :label-width="formLabelWidth">
              <el-input v-model="editForm.realName" autocomplete="off" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名:" :label-width="formLabelWidth">
              <el-input v-model="editForm.buyerName" autocomplete="off" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="类目权限:" :label-width="formLabelWidth">
          <el-cascader-panel
            disabled
            :key="isResouceShow"
            v-model="editForm.cateId"
            :options="options"
            :props="{label: 'cateName', children: 'cateList', value: 'cateId', checkStrictly: false,disabled:'isDisabled',emitPath:false}"
            collapse-tags
            @change="selsectData"
          ></el-cascader-panel>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="updateBursy('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { categoryListGet } from "@/request/product";
import {
  PurCateGroupQuery,
  PurCateGroupEditBuyer,
  PurCateGroupBuyerDetail,
  PurCateGroupSelect,
  DeletePurCateGroupBuyer
} from "@/request/purchase";
export default {
  name: "authCategory",
  data() {
    const validateGroup = (rule, value, callback) => {
      if (this.editForm.group.length == 0) {
        callback(new Error("请选择类目分组"));
      } else {
        callback();
      }
    };
    return {
      formInline: {
        buyerName: "",
        groupName: "",
        cateId: "",
        page: {
          pageSize: 20,
          pageNum: 1
        }
      },
      isDisabled: false,
      editForm: {
        realName: "",
        buyerName: "",
        cateId: "",
        userId: "",
        group: []
      },
      options: [],
      tableData: [],
      total: 0,
      backCategoryOptions: [],
      dialogTitle: "编辑用户类目权限",
      dialogFormVisible: false,
      formLabelWidth: "100px",
      editFormRule: {
        group: [{ required: true, validator: validateGroup, trigger: "change" }]
      },
      groupNameList: [],
      isResouceShow:0,
      loading:true
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.fetchCategory({
      level: 1,
      cateType: 2,
      resolve: data => {
        this.backCategoryOptions = data;
      }
    });
    this.getPurCateGroupQuery(0);
    this.getPurCateGroupSelect();
  },
  methods: {
    //获取全部分组信息
    getPurCateGroupSelect(type) {
     
      PurCateGroupSelect({}).then(res => {
        if (res.ret.errcode == 1) {
          this.groupNameList = res.groupList;
        }
      });
    },
    //初始化数据
    getPurCateGroupQuery(type) {
      if(type==0){
       this.formInline.page.pageNum=1
     }
       this.loading = true
      PurCateGroupQuery(this.filterData(this.formInline))
        .then(res => {
          if (res.ret.errcode == 1) {
             this.loading = false
            this.tableData = res.groupPB;
            this.total = res.total;
          }
        })
        .catch(err => {});
    },
    //返回类目分组
    returnGroupName(data) {
      var groupName = [];
      _.forEach(data, item => {
        groupName.push(item.groupName);
      });
      return groupName.join(",");
    },
    //清空搜索
    resetSearch() {
      this.formInline.buyerName = "";
      this.formInline.groupName = "";
      this.formInline.cateId = "";
    },
    editCategory(row, type) {
      if (type == "edit") {
        this.isDisabled = false;
        this.dialogTitle="编辑类目权限"
      } else {
        this.isDisabled = true;
        this.dialogTitle="查看类目权限"
      }
      this.editForm.userId = row.buyerId;
      var params = {
        userId: this.editForm.userId
      };
      var arr = [],
        cateId = [];
      
      PurCateGroupBuyerDetail(params)
        .then(response => {
          if (response.ret.errcode == 1) {
            ++this.isResouceShow
            this.dialogFormVisible = true;
            this.editForm.realName = response.realName;
            this.editForm.buyerName = response.buyerName;
            _.forEach(response.group, item => {
              arr.push(item.groupId);
            });
            this.editForm.group = arr;
            this.editForm.cateId =
              response.cateList[0].cateList[0].cateList[0].cateId;
            _.forEach(response.cateList, cate => {
              cate.leaf = false;
              cate.level = 1;
              _.forEach(cate.cateList, cateChild => {
                cateChild.leaf = false;
                cateChild.level = 2;
                _.forEach(cateChild.cateList, isChecked => {
                  isChecked.leaf = true;
                  delete isChecked.cateList;
                  isChecked.level = 3;
                });
              });
            });
            this.options = response.cateList;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteCategory(row) {
      console.log(row)
        this.$confirm('此操作将删除该用户类目权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var params={
              userId:row.buyerId
            }
            DeletePurCateGroupBuyer(params).then(response=>{
              if(response.ret.errcode==1){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
              this.getPurCateGroupQuery()
            }).catch(error=>{
              console.log(error)
            })
            
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
    },
    getBackSubCategory(data, resolve) {
      if (data.level == 0) {
        return;
      }
      let value = data.value
      console.log(data);
      this.fetchCategory({
        pid: parseInt(value),
        cateType: 2,
        level: data.level + 1,
        resolve
      });
    },
    // 获取分类
    fetchCategory({ id, cateType, level, pid, page, resolve }) {
      categoryListGet(
        this.filterData({
          pid: pid,
          id: id,
          level: level,
          cateType: cateType,
          page: page
        })
      ).then(res => {
        if (res.ret.errcode === 1) {
          for (let i = 0; i < res.categoryUnit.length; i++) {
            res.categoryUnit[i]["levelValue"] = [];
            let item = res.categoryUnit[i].cateNameValue.find(val => {
              return val.languageCode == "cn";
            });
            res.categoryUnit[i]["cateId"] = String(res.categoryUnit[i][
              "cateId"
            ])
            res.categoryUnit[i]["cateName"] = item ? item.name : "";
            if (cateType == 2) {
              res.categoryUnit[i]["leaf"] = level > 2;
            } else {
              res.categoryUnit[i]["leaf"] = level > 1;
            }
          }
          resolve && resolve(res.categoryUnit, res);
        }
      });
    },
    selsectData(value) {
      console.log(value);
    },
    updateBursy(formName) {
      if (this.isDisabled == false) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            var params = {
              userId: this.editForm.userId,
              groupId: this.editForm.group
            };
            PurCateGroupEditBuyer(params).then(resultes => {
              if (resultes.ret.errcode == 1) {
                this.$message.success("用户权限编辑成功");
                this.dialogFormVisible = false;
                this.getPurCateGroupQuery();
                this.editForm = {
                  realName: "",
                  buyerName: "",
                  cateId: "",
                  userId: "",
                  group: []
                };
              }
            });
          } else {
            console.log("error");
          }
        });
      } else {
        this.dialogFormVisible = false;
      }
    },
    handleDialogClose() {
      this.editForm.realName = "";
      this.editForm.buyerName = "";
      this.editForm.cateId = "";
      this.editForm.userId = "";
      this.editForm.group = [];
      // this.options = [];
      this.dialogFormVisible = false;
    },
    //分页
     handleSizeChange(val) {
      this.formInline.page.pageSize = val;
      this.getPurCateGroupQuery();
    },
    handleCurrentChange(val) {
      this.formInline.page.pageNum = val;
      this.getPurCateGroupQuery();
    },
  }
};
</script>

<style lang="scss" scoped>
.add_table,
.add_page {
  margin-top: 20px;
}
/deep/ .el-cascader-panel.is-bordered {
  border: none;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid #cccccc;
}
/deep/ .el-dialog__body {
  padding: 20px;
}
</style>
