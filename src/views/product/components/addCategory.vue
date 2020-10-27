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
          @click="getPurCateGroupList(0)"
          size="medium"
        >搜索</el-button>
        <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button
        type="primary"
        icon="el-icon-edit"
        @click="addCategory"
        v-if="hasPermission('BTN_CATE_GROUP_ADD')"
      >新增类目分组</el-button>
    </div>
    <div class="add_table">
      <el-table
        :data="tableData"
        highlight-current-row
        border
        v-loading="loading"
        style="width: 100%;text-align:center;"
      >
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column property="groupName" label="类目分组名" align="center" width="120"></el-table-column>
        <el-table-column label="后台类目" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="returnName(scope.row.cateList)"
              placement="top"
            >
              <span
                class="block-right"
                style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical;text-align:center;margin:5px 0"
              >{{returnName(scope.row.cateList)}}</span>
            </el-tooltip>
            <!-- <span>{{returnName(scope.row.cateList)}}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="用户" width="200" align="center">
          <template slot-scope="scope">
            <el-tag
              style="margin:5px"
              v-for="(item,index) in scope.row.buyerList"
              :key="index"
              type="info"
            >{{item.buyerName}}</el-tag>
            <!-- <span>{{returnUser(scope.row.buyerList)}}</span> -->
          </template>
        </el-table-column>
        <el-table-column property="createTime" label="创建时间" width="200" align="center"></el-table-column>
        <el-table-column property="updateTime" label="更新时间" width="200" align="center"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-link
              @click="editCategory(scope.row,'edit')"
              type="primary"
              :underline="false"
              style="margin-right:20px;"
              v-if="hasPermission('BTN_CATE_GROUP_EDIT')"
            >编辑</el-link>
            <el-link
              @click="editCategory(scope.row,'watch')"
              type="primary"
              :underline="false"
              v-if="hasPermission('BTN_CATE_GROUP_DETAIL')"
            >查看详情</el-link>
            <!-- <el-link @click="editCategory(scope.row,'watch')" type="primary" :underline="false">测试查看</el-link> -->
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
    <!--新增弹窗-->
    <el-dialog
      title="新增类目分组"
      :visible.sync="dialogFormVisible"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="dialog_title">
        <p>1、类目分组名保存后不支持变更</p>
        <p>2、类目分组保存后不支持删除</p>
        <p>3、若有后台类目未被分组，后续产生的采购单将进入采购单列表‘未分组’标签页，须建立对应类目分组后才可操作</p>
      </div>
      <div class="dialog_form">
        <div class="dialog_left">
          <el-form :model="categoryForm" label-width="100px" ref="categoryForm">
            <div
              v-for="(item,index) in categoryForm.categoryUser"
              :key="index"
              style="display:flex"
            >
              <el-form-item
                label="类目分组名:"
                :prop="'categoryUser.'+index+'.groupName'"
                :rules="{
                      required: true, message: '类目分组名不能为空', trigger: 'blur'
                      }"
              >
                <el-input v-model="item.groupName"></el-input>
              </el-form-item>
              <el-form-item
                label="后台类目:"
                :prop="'categoryUser.'+index+'.cateId'"
                :rules="{
                 required: true, message: '后台类目不能为空', trigger: 'blur'
              }"
              >
                <el-cascader
                  style="width:250px"
                  clearable
                  filterable
                  :show-all-levels="false"
                  :props="{label: 'cateName', children: 'cateList', value: 'cateId', lazy: true, lazyLoad: getBackSubCategory, checkStrictly: false,multiple: true,disabled:'isDisabled',emitPath:false}"
                  placeholder="请选择商品后台分组"
                  :options="backCategoryOptions"
                  v-model="item.cateId"
                  @change="setBackCateId"
                  class="normalOperatorBox"
                  size="medium"
                ></el-cascader>
              </el-form-item>
              <el-form-item
                label-width="60px"
                label="用户:"
                :prop="'categoryUser.'+index+'.userId'"
                :rules="{
                      required: true, message: '用户不能为空', trigger: 'change'
                      }"
              >
                <el-select v-model="item.userId" multiple clearable>
                  <el-option
                    v-for="(item, index) in buyerList"
                    :key="index"
                    :label="item.realName"
                    :value="item.sysUserId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-link
                @click.prevent="removeCatgory(index)"
                type="primary"
                :underline="false"
                style="margin-bottom: 15px;margin-left: 10px;width:60px"
              >删除</el-link>
            </div>
          </el-form>
        </div>
        <div class="dialog_right">
          <el-button type="primary" icon="el-icon-plus" @click="addNewCategory">新增分组</el-button>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddCategoryForm('categoryForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!---编辑和查看的弹窗-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogEdit" width="60%">
      <div class="dialog_title">
        <p>1、类目分组名保存后不支持变更</p>
        <p>2、类目分组保存后不支持删除</p>
        <p>3、若有后台类目未被分组，后续产生的采购单将进入采购单列表‘未分组’标签页，须建立对应类目分组后才可操作</p>
      </div>
      <el-form :model="editCategoryForm" ref="editCategoryForm" :rules="editCategoryFormRules">
        <el-form-item label="类目分组名" :label-width="formLabelWidth" prop="groupName">
          <el-input v-model="editCategoryForm.groupName" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户" :label-width="formLabelWidth" prop="userId">
          <el-select
            v-model="editCategoryForm.userId"
            placeholder="请选择用户"
            multiple
            style="width:100%"
            :disabled="editForm==true"
          >
            <el-option
              v-for="(item, index) in buyerList"
              :key="index"
              :label="item.realName"
              :value="item.sysUserId"
            ></el-option>
          </el-select>
        </el-form-item>
        <div>
          <el-form-item label="后台类目" prop="cateId" v-if="!editForm" :label-width="formLabelWidth">
            <el-cascader
              style="width:100%"
              clearable
              :key="isResouceShow"
              :disabled="editForm"
              :show-all-levels="false"
              :props="{label: 'cateName', children: 'cateList', value: 'cateId', lazy: true, lazyLoad: getBackSubCategoryEdit, checkStrictly: false,multiple: true,disabled:'isDisabled',emitPath:false}"
              placeholder="请选择商品后台分组"
              :options="backCategoryOptionsEdit"
              @change="selectEdit"
              v-model="editCategoryForm.cateId"
              class="normalOperatorBox"
              size="medium"
            ></el-cascader>
          </el-form-item>
        </div>
        <div>
          <el-form-item v-if="editForm" label="后台类目" prop="cateId" :label-width="formLabelWidth">
            <el-cascader-panel
              disabled
              :key="isResouceShow"
              v-model="editCategoryForm.cateIdone"
              :options="backCategoryOptionsWatch"
              :props="{label: 'cateName', children: 'cateList', value: 'cateId', checkStrictly: false,emitPath:false}"
              collapse-tags
              @change="selsectData"
            ></el-cascader-panel>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit = false">取 消</el-button>
        <el-button type="primary" @click="updateCateGroup('editCategoryForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看弹窗-->
    <!-- <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="800"
      :before-close="handleClose">
      <el-row>
        <el-col :span="12">
          <span>类目分组名：<el-tag>{{watchForm.groupName}}</el-tag></span>
        </el-col>
        <el-col :span="12">
          <span>用户:<el-tag v-for="(item,index) in watchForm.buyerIds" :key="index">{{item.buyerName}}</el-tag></span>
        </el-col>
      </el-row>
      <el-row style="display:flex;justify-content: space-around;">
        <el-col :span="7">
          <CategoryForCard :categoryList="backCategoryOptionsWatch" :level="1" @on-select="selectEditCategory"></CategoryForCard>
        </el-col>
        <el-col :span="7">
          <CategoryForCard :categoryList="backCategoryOptionsWatchSecond" :level="2" @on-select="selectEditCategory"></CategoryForCard>
        </el-col>
        <el-col :span="7">
          <CategoryForCard :categoryList="backCategoryOptionsWatchThree" :level="3" @on-select="selectEditCategory"></CategoryForCard>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
import { categoryListGet } from "@/request/product";
import { listSysUserByPage } from "@/request/staff";
import CategoryForCard from "./categoryForCate";
import {
  PurCateGroupAdd,
  PurCateGroupList,
  PurCateGroupDetail,
  PurCateGroupUpdate,
} from "@/request/purchase";
export default {
  name: "addCategory",
  components: {
    CategoryForCard,
  },
  data() {
    const validateUser = (rule, value, callback) => {
      if (this.editCategoryForm.userId.length == 0) {
        callback(new Error("请选择用户"));
      } else {
        callback();
      }
    };
    const validateCategory = (rule, value, callback) => {
      if (this.editCategoryForm.cateId.length == 0) {
        callback(new Error("请选择后台类目"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      formInline: {
        buyerName: "",
        groupName: "",
        cateId: [],
        page: {
          pageSize: 20,
          pageNum: 1,
        },
      },
      tableData: [],
      backCategoryOptionsWatch: [],
      total: 0,
      categoryForm: {
        categoryUser: [
          {
            groupName: "",
            cateId: [],
            userId: [],
          },
        ],
      },
      dialogFormVisible: false,
      //后台类目列表
      backCategoryOptions: [],
      backCategoryOptionsWatchSecond: [],
      backCategoryOptionsWatchThree: [],
      //采购人员列表
      buyerList: [],
      dialogTitle: "编辑类目分组",
      dialogEdit: false,
      formLabelWidth: "100px",
      editCategoryForm: {
        groupName: "",
        cateId: [],
        userId: [],
        groupId: "",
        cateIdone: "",
      },
      editCategoryFormRules: {
        groupName: [
          { required: true, message: "请输入类目名称", tirgger: "blur" },
        ],
        cateId: [
          { required: true, validator: validateCategory, tirgger: "change" },
        ],
        userId: [
          { required: true, validator: validateUser, tirgger: "change" },
        ],
      },
      editForm: false,
      loading: true,
      backCategoryOptionsEdit: [],
      editType: 0,
      isResouceShow: 0,
      watchForm: {
        groupName: "",
        buyerIds: [],
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.fetchCategory({
      level: 1,
      cateType: 2,
      resolve: (data) => {
        this.backCategoryOptions = data;
      },
    });
    this.getPurCateGroupList(0);
  },
  methods: {
    watchCategory(row) {
      this.dialogVisible = true;
    },
    removeCate(val) {},
    selectEditCategory(data) {
      console.log(data);
      if (data.level == 1) {
        _.forEach(this.backCategoryOptionsWatch, (item) => {
          if (item.cateId == data.cateId) {
            this.backCategoryOptionsWatchSecond = item.cateList;
            this.backCategoryOptionsWatchThree = item.cateList[0].cateList;
          }
        });
      } else if (data.level == 2) {
        _.forEach(this.backCategoryOptionsWatch, (item) => {
          _.forEach(item.cateList, (child) => {
            if (data.cateId == child.cateId) {
              this.backCategoryOptionsWatchThree = child.cateList;
            }
          });
        });
      }
    },
    returnName(data) {
      var arr = [];
      _.forEach(data, (item) => {
        arr.push(item.cateName);
      });
      return arr.join(",");
    },
    returnUser(data) {
      var arr = [];
      _.forEach(data, (item) => {
        arr.push(item.buyerName);
      });
      return arr.join(",");
    },
    //清空搜索条件
    resetSearch() {
      this.formInline.buyerName = "";
      this.formInline.groupName = "";
      this.formInline.cateId = [];
    },
    getPurCateGroupList(type) {
      if (type == 0) {
        this.formInline.page.pageNum = 1;
      }
      this.loading = true;
      PurCateGroupList(this.filterData(this.formInline))
        .then((response) => {
          if (response.ret.errcode == 1) {
            this.tableData = response.groupPB;
            this.total = response.total;
            this.loading = false;
          }
        })
        .catch((error) => {});
    },
    handleSizeChange(val) {
      this.formInline.page.pageSize = val;
      this.getPurCateGroupList();
    },
    handleCurrentChange(val) {
      this.formInline.page.pageNum = val;
      this.getPurCateGroupList();
    },
    addCategory() {
      this.dialogFormVisible = true;
      this.editType = 0;
    },
    //新增类目
    addNewCategory() {
      this.categoryForm.categoryUser.push({
        groupName: "",
        cateId: [],
        userId: [],
      });
    },
    removeCatgory(index) {
      if (index == 0) {
      } else {
        this.categoryForm.categoryUser.splice(index, 1);
      }
    },
    /* 提交之前的检验*/
    AddCategoryForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var params = {
            pbList: [],
          };
          var cateId = [];
          _.forEach(this.categoryForm.categoryUser, (item) => {
            params.pbList.push(item);
          });
          PurCateGroupAdd(params)
            .then((response) => {
              if (response.ret.errcode == 1) {
                this.dialogFormVisible = false;
                this.categoryForm.categoryUser = [
                  {
                    groupName: "",
                    cateId: [],
                    userId: [],
                  },
                ];
                this.getPurCateGroupList();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 类目获取 */
    getBackSubCategory(data, resolve) {
      if (data.level == 0) {
        return;
      }
      console.log(data);
      let value = JSON.parse(data.value);
      this.fetchCategory({
        pid: parseInt(value),
        cateType: 2,
        level: data.level + 1,
        resolve,
      });
    },
    //编辑时的回显问题分开处理
    getBackSubCategoryEdit(data, resolve) {
      if (data.level == 0) {
        return;
      }
      console.log(data);
      let value = JSON.parse(data.value);
      this.fetchCategoryEdit({
        pid: parseInt(value),
        cateType: 2,
        level: data.level + 1,
        resolve,
      });
    },
    fetchCategoryEdit({ id, cateType, level, pid, page, resolve }) {
      categoryListGet(
        this.filterData({
          pid: pid,
          id: id,
          level: level,
          cateType: cateType,
          page: page,
        })
      ).then((res) => {
        if (res.ret.errcode === 1) {
          _.forEach(res.categoryUnit, (item, index) => {
            item["cateId"] = item["cateId"].toString();
            if (level == 3) {
              item["leaf"] = true;
            }
          });
          for (let i = 0; i < res.categoryUnit.length; i++) {
            res.categoryUnit[i]["cateList"] = [];
            let item = res.categoryUnit[i].cateNameValue.find((val) => {
              return val.languageCode == "cn";
            });
            res.categoryUnit[i]["cateName"] = item ? item.name : "";
            if (cateType == 2) {
              res.categoryUnit[i]["leaf"] = level > 2;
            } else {
              res.categoryUnit[i]["leaf"] = level > 1;
            }
            //筛选
            if (level == 2) {
              _.forEach(this.backCategoryOptionsEdit, (child) => {
                _.forEach(child.cateList, (childCate) => {
                  _.forEach(res.categoryUnit, (item, index) => {
                    if (item) {
                      if (item.cateId == childCate.cateId) {
                        res.categoryUnit.splice(index, 1);
                      }
                    }
                  });
                });
              });
              _.forEach(this.editCategoryForm.cateId, (item, index) => {
                this.$set(this.editCategoryForm.cateId, index, item);
              });
            } else if (level == 3) {
              delete res.categoryUnit[i].cateList;
              res.categoryUnit[i]["leaf"] = true;
              //做remove-tag时的重复问题
              _.forEach(this.backCategoryOptionsEdit, (child) => {
                _.forEach(child.cateList, (childCate) => {
                  _.forEach(childCate.cateList, (level3Cate) => {
                    _.forEach(res.categoryUnit, (item, index) => {
                      if (item) {
                        if (item.cateId == level3Cate.cateId) {
                          res.categoryUnit.splice(index, 1);
                        }
                      }else{
                        res.categoryUnit[i].cateId=res.categoryUnit[i].cateId.toString()
                      }
                    });
                  });
                });
              });
              _.forEach(this.editCategoryForm.cateId, (item, index) => {
                this.$set(this.editCategoryForm.cateId, index, item);
              });
            }
          }
          resolve && resolve(res.categoryUnit, res);
          console.log(res.categoryUnit);
        }
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
          page: page,
        })
      ).then((res) => {
        if (res.ret.errcode === 1) {
          for (let i = 0; i < res.categoryUnit.length; i++) {
            res.categoryUnit[i]["cateList"] = [];
            let item = res.categoryUnit[i].cateNameValue.find((val) => {
              return val.languageCode == "cn";
            });
            res.categoryUnit[i]["cateName"] = item ? item.name : "";
            res.categoryUnit[i]["cateId"] = String(
              res.categoryUnit[i]["cateId"]
            );
            if (cateType == 2) {
              res.categoryUnit[i]["leaf"] = level > 2;
            } else {
              res.categoryUnit[i]["leaf"] = level > 1;
            }
            //设置不可选中
            if (level == 2) {
            } else if (level == 3) {
              _.forEach(this.categoryForm.categoryUser, (item) => {
                if (item.length == 0) {
                } else {
                  _.forEach(item.cateId, (child) => {
                    if (child == res.categoryUnit[i].cateId) {
                      res.categoryUnit[i].isDisabled = true;
                    }
                  });
                }
              });
            }
          }
          resolve && resolve(res.categoryUnit, res);
        }
        console.log(this.backCategoryOptions);
      });
    },
    //一级类目设置不可选中
    setBackCateId(value) {
      // _.forEach(this.backCategoryOptions, oneLevel => {
      //   _.forEach(this.categoryForm.categoryUser, item => {
      //       _.forEach(item.cateId, child => {
      //         _.forEach(child, itemChild => {
      //           if (itemChild == oneLevel.cateId) {
      //             oneLevel.isDisabled = true;
      //           }
      //         });
      //       });
      //   });
      // });
    },
    //采购人员获取
    getBuyerList() {
      let params = {
        page: {
          pageNum: 1,
          pageSize: 1000,
        },
        groupIds: [68, 69, 70],
      };
      listSysUserByPage(params)
        .then((res) => {
          if (res.ret.errcode === 1) {
            console.log("人员信息", res);
            this.buyerList = res.sysUserPb;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //编辑弹窗，只能编辑人员
    editCategory(row, type) {
      this.editCategoryForm.groupId = row.groupId;
      this.editType = 1;
      if (type == "edit") {
        this.dialogTitle = "编辑类目分组";
        this.editForm = false;
      } else {
        this.dialogTitle = "查看类目分组";
        this.editForm = true;
        this.dialogVisible = true;
      }
      this.dialogEdit = true;
      var params = {
        groupId: row.groupId,
      };
      PurCateGroupDetail(params)
        .then((response) => {
          if (response.ret.errcode == 1) {
            // if(type=='watch'){
            //   _.forEach(response.cateIds,child=>{
            //     _.forEach(child.cateList,childCate=>{
            //       _.forEach(childCate.cateList,item=>{
            //         delete item.cateList
            //         item.leaf=true
            //         // item.isDisabled = true
            //       })
            //     })
            //   })
            //   this.backCategoryOptionsWatch = response.cateIds
            //   this.backCategoryOptionsWatchSecond=response.cateIds[0].cateList
            //   this.backCategoryOptionsWatchThree=response.cateIds[0].cateList[0].cateList
            //   this.watchForm.groupName = response.groupName
            //   this.watchForm.buyerIds = response.buyerIds
            // }
            ++this.isResouceShow;
            var buyerList = [];
            _.forEach(response.buyerIds, (item) => {
              buyerList.push(item.buyerId);
            });
            this.editCategoryForm.userId = buyerList;
            this.editCategoryForm.groupName = response.groupName;
            this.backCategoryOptionsEdit = JSON.parse(
              JSON.stringify(this.backCategoryOptions)
            );
            _.forEach(this.backCategoryOptionsEdit, (item) => {
              _.forEach(response.cateIds, (editCate) => {
                if (editCate.cateId == item.cateId) {
                  item.cateList = editCate.cateList;
                }
                _.forEach(editCate.cateList, (checked) => {
                  _.forEach(checked.cateList, (isChecked) => {
                    isChecked.leaf = true;
                  });
                });
              });
            });
            this.editCategoryForm.cateId = response.cateIdList;
            this.editCategoryForm.cateIdone = response.cateIdList[0];
            _.forEach(response.cateIds, (item) => {
              _.forEach(item.cateList, (child) => {
                _.forEach(child.cateList, (childCate) => {
                  delete childCate.cateList;
                  childCate.leaf = true;
                });
              });
            });
            this.backCategoryOptionsWatch = response.cateIds;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /* 
    编辑group
    */
    updateCateGroup(formName) {
      if (this.editForm == false) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = {
              pbList: [this.editCategoryForm],
            };

            PurCateGroupAdd(params)
              .then((response) => {
                if (response.ret.errcode == 1) {
                  this.dialogEdit = false;
                  this.getPurCateGroupList();
                  this.$message.success("类目分组修改成功");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.$message.error("请检查必填项");
          }
        });
      } else {
        this.dialogEdit = false;
      }
    },
    selectEdit(val) {
      this.editCategoryForm.cateId = this.uniq(this.editCategoryForm.cateId);
      this.$nextTick(() => {
        _.forEach(this.editCategoryForm.cateId, (item, index) => {
          this.$set(this.editCategoryForm.cateId, index, item);
        });
      });

      console.log(this.editCategoryForm.cateId);
    },
    uniq(array) {
      var temp = {},
        r = [],
        len = array.length,
        val,
        type;
      for (var i = 0; i < len; i++) {
        val = array[i];
        type = typeof val;
        if (!temp[val]) {
          temp[val] = [type];
          r.push(val);
        } else if (temp[val].indexOf(type) < 0) {
          temp[val].push(type);
          r.push(val);
        }
      }
      return r;
    },
  },
};
</script>

<style lang="scss" scoped>
.add_table,
.add_page {
  margin-top: 20px;
}
/deep/ .dialog_form {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  .dialog_left {
    flex: 1;
  }
  .dialog_right {
    width: 200px;
    text-align: right;
  }
}
/deep/ .el-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #cccccc;
  }
  .el-dialog__body {
    .dialog_title {
      p {
        font-size: 16px;
        margin: 10px;
      }
    }
  }
  /deep/ .el-cascader-panel.is-bordered {
    border: none;
  }
}
</style>
