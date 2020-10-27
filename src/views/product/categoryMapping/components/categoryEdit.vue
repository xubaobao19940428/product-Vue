<template>
    <!---编辑弹窗-->
    <el-dialog title="编辑类目映射关系" :visible.sync="dialogEdit" width="800" :before-close="cancel">
      <el-form :model="editCategoryForm" ref="editCategoryForm" :rules="editCategoryFormRules" >
        <el-form-item label="第三方平台:" :label-width="formLabelWidth" prop="platform">
          <el-select
            v-model="editCategoryForm.platform"
            placeholder="请选择第三方平台"
            style="width:100%"
            disabled
          >
          <el-option
              v-for="item in platformList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div>
          <el-form-item label="FINGO后台类目:" prop="cateId" :label-width="formLabelWidth">
            <el-cascader
              style="width:100%"
              clearable
              :disabled="editForm"
              :show-all-levels="false"
              :props="{label: 'cateName', children: 'cateList', value: 'cateId', lazy: true, lazyLoad: getBackSubCategoryEdit, checkStrictly: false,multiple: true,emitPath:false}"
              placeholder="请选择商品后台分组"
              :options="backCategoryOptionsEdit"
              @change="selectEdit"
              v-model="editCategoryForm.cateId"
              class="normalOperatorBox"
              size="medium"
            ></el-cascader>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
import { categoryListGet,GetCateMappingDetail,UpdateCategoryMapping} from "@/request/product";
export default {
  name: "categoryEdit",
  props:{
      backCategoryOptions:{
          type:Array,
          default:()=>{
              return []
          }
      },
      dialogEdit:{
          type:Boolean,
          default:false
      }
  },
  data() {
    const validateCategory = (rule, value, callback) => {
      if (this.editCategoryForm.cateId.length == 0) {
        callback(new Error("请选择后台类目"));
      } else {
        callback();
      }
    };
    return {
      dialogTitle: "编辑类目分组",
      formLabelWidth: "120px",
      platformList:[
          {
          value: 1,
          label: "LAZADA",
        },
      ],
      editCategoryForm: {
        cateId: [],
        platform:1,
        mappingId:''
      },
      editCategoryFormRules: {
        cateId: [
          { required: true, validator: validateCategory, tirgger: "change" },
        ],
      },
      editForm: false,
      backCategoryOptionsEdit: [],
      editType: 0,
      isResouceShow: 0,
    };
  },
  computed: {},
  watch: {},
  mounted() {
  },
  methods: {
      cancel(){
          this.$emit('on-cancel')
      },
    //编辑时的回显问题分开处理
    getBackSubCategoryEdit(data, resolve) {
      if (data.level == 0) {
        return;
      }
      console.log(data);
      let value = data.value
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
        }
      });
    },
    
    //编辑弹窗
    editCategory(row,type) {
      this.editCategoryForm.mappingId = row.id;
      this.editType = 1;
      if (type == "edit") {
        this.dialogTitle = "编辑类目分组";
        this.editForm = false;
      }
      var params = {
        mappingId: row.id,
      };
      GetCateMappingDetail(params)
        .then((response) => {
          if (response.ret.errcode == 1) {
            this.backCategoryOptionsEdit = JSON.parse(JSON.stringify(this.backCategoryOptions));
            _.forEach(this.backCategoryOptionsEdit, (item) => {
              _.forEach(response.cateList, (editCate) => {
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
            _.forEach(response.cateList, (item) => {
              _.forEach(item.cateList, (child) => {
                _.forEach(child.cateList, (childCate) => {
                  delete childCate.cateList;
                  childCate.leaf = true;
                });
              });
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectEdit(val) {
      this.editCategoryForm.cateId = this.uniq(this.editCategoryForm.cateId);
      this.$nextTick(() => {
        _.forEach(this.editCategoryForm.cateId, (item, index) => {
          this.$set(this.editCategoryForm.cateId, index, item);
        });
      });
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
    //更新
    confirm(){
        this.$refs['editCategoryForm'].validate((valid)=>{
            if(valid){
              console.log(this.editCategoryForm)
                let params={
                    id:this.editCategoryForm.mappingId,
                    fingoCateIdList:this.editCategoryForm.cateId
                }
                UpdateCategoryMapping(params).then(resultes=>{
                    if(resultes.ret.errcode==1){
                        this.$refs['editCategoryForm'].resetFields();
                        this.$message.success('更新成功')
                        this.$emit('on-success')
                    }
                })
            }
        })
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
