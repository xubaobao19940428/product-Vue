<template>
  <el-dialog
    title="分组管理"
    width="900px"
    append-to-body
    :visible="propShowDialog"
    @close="close"
    class="media-form-wrapper"
    top="5vh"
  >
    <div>
      <el-form
        ref="addDialog"
        label-position="right"
        label-width="110px"
        label-suffix="："
        :rules="rules"
        :model="param"
      >
        <el-form-item label="父类目" required>
          <span>{{param.pName}}</span>
        </el-form-item>

        <el-form-item label="分组名称" prop="nameValue" required>
          <table class="table table-bordered table-info">
            <tbody>
              <tr v-for="(item, index) in param.nameValue" :key="index">
                <th>
                  <span
                    class="required"
                    v-if="item.languageCode === 'cn' || item.languageCode === 'en'"
                  >*</span>
                  {{getLangName(item.languageCode)}}{{item.languageCode}}
                </th>
                <td>
                  <el-form-item
                    ref="categoryForm"
                    :rules="{ required: item.languageCode == 'cn' || item.languageCode == 'en' ? true : false, message: '请输入', trigger: 'change' }"
                    :prop="`nameValue[${index}].name`"
                  >
                    <el-input v-model="item.name" clearable size="medium" placeholder="请输入"></el-input>
                  </el-form-item>
                </td>
              </tr>
            </tbody>
          </table>
        </el-form-item>
        <template>
          <el-form-item label="前台二级类目" prop="secondCategory">
            <el-cascader
              style="width: 45%"
              filterable
              clearable
              remote
              :key="cascaderKey"
              @visible-change="clearSelectCategory"
              @change="addCategory"
              :props="{label: 'cateName',multiple: true, checkStrictly: false, children: 'levelValue', value: 'prop', lazy: true, lazyLoad: getSubCategory}"
              placeholder="请选择商品后台分组"
              :options="categoryOptions"
              v-model="selectedOptions"
              class="normalOperatorBox"
              size="medium"
            ></el-cascader>
            <div style="display:flex;flex-wrap:wrap">
              <draggable
                :list="param.secondCategory"
                class="list-group image-show"
                ghost-class="ghost"
                :move="checkMove"
                @start="dragging = true"
                @end="dragging = false"
                v-bind="getOptions()"
              >
                <div
                  class="list-group-item image-box"
                  v-for="(element, index) in param.secondCategory"
                  :key="index"
                >
                  <div class="darg-item">
                    <el-image :src="dealShowFileSrc(element.cover)" class="image-item"></el-image>
                    <span class="img_category" style>{{element.name}}</span>
                    <div class="operate-area">
                      <i class="el-icon-delete" @click.stop="removeCategory(element, index)"></i>
                    </div>
                  </div>
                </div>
              </draggable>
            </div>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button size="small" type="primary" @click="confirm()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import draggable from "vuedraggable";
import {
  categoryAdd,
  categoryUpdate,
  categoryQueryByName,
  categoryListGet,
  CategoryGroupAddOrUpdate,
} from "@/request/product";
export default {
  name: "secondCategoryEdit",
  props: {
    propShowDialog: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 1,
    },
    type: {
      type: String,
      default: "add",
    },
    propParam: {
      type: Object,
      default: () => {
        return {};
      },
    },
    countryCode: {
      type: String,
      default: "MY",
    },
  },
  components: {
    draggable,
  },
  data() {
    const secondCategoryValid=(rule,value,callback)=>{
      if(this.param.secondCategory.length==0){
        callback(new Error('请挑选前台二级类目'))
      }else{
        callback()
      }
    }
    return {
      param: {
        nameValue: [],
        secondCategory: [],
        pid: 0,
        cateType: 1,
        pName: "",
      },
      dragging: false,
      categoryOptions: [],
      selectedOptions: [],
      cascaderKey:1,
      rules:{
        secondCategory:[
          {required:true,validator:secondCategoryValid,trigger:'change'}
        ]
      }
    };
  },
  computed: {
    languageList() {
      return this.$store.state.dict.languageList;
    },
  },
  watch: {
    propParam: {
      handler(newVal, oldval) {
        if (newVal) {
          Object.assign(this.param, JSON.parse(JSON.stringify(newVal)));
          this.init();
        }
      },
      deep: true,
    },
    propShowDialog(val) {
      if (val) {
        this.$nextTick(() => {
            ++this.cascaderKey   
          this.categoryOptions = [];
          this.fetchCategory({
            cateType: 1,
            level: 1,
            countryCode: this.countryCode,
            resolve: (data) => {
              this.categoryOptions = data;
            },
          });
          this.selectedOptions = [];
        });
        
        Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)));
        this.init();
      }
    },
  },
  methods: {
    checkMove: function (e) {
      window.console.log("index: " + e.draggedContext.futureIndex);
    },
    getOptions() {
      return { animation: 150, handle: ".darg-item", ghostClass: "ghostClass" };
    },
    init() {
      for (let i = 0; i < this.languageList.length; i++) {
        let lang = this.languageList[i].code;
        let item = this.param.nameValue.find((val) => {
          return val.languageCode == lang;
        });
        if (!item) {
          this.param.nameValue.push({
            languageCode: lang,
            name: "",
          });
        }
      }
    },
    reset() {
      this.param = {
        nameValue: [],
        secondCategory: [],
        bindId: "",
        cover: "",
        pid: 0,
        cateType: 1,
        pName: "",
      };
    },
    close() {
      this.reset();
      this.$emit("on-close");
    },
    getLangName(code) {
      let item = this.languageList.find((val) => {
        return val.code == code;
      });
      return item ? item.desc : "";
    },
    //移出类目
    removeCategory(tag, i) {
      this.param.secondCategory.splice(i, 1);
    },
    addCategory() {
      for (let i = 0; i < this.selectedOptions.length; i++) {
        let data = JSON.parse(this.selectedOptions[i][1]);
        let item = this.param.secondCategory.find((val) => {
          return val.id == data.id;
        });
        if (!item) {
          this.param.secondCategory.push(data);
        }
      }
    },
    //确认
    confirm() {
      this.$refs["addDialog"].validate((valid) => {
        if (valid) {
          var params = {};
          var categoryIdList = [];
          _.forEach(this.param.secondCategory, (item) => {
            categoryIdList.push(Number(item.id));
          });
          if (this.param.id) {
            params = {
              pid: this.param.pid,
              name: this.param.nameValue[0].name,
              nameValue: this.param.nameValue,
              sort: 1,
              categoryId: categoryIdList,
              id: this.param.id,
            };
          } else {
            params = {
              pid: this.param.pid,
              name: this.param.nameValue[0].name,
              nameValue: this.param.nameValue,
              sort: 1,
              categoryId: categoryIdList,
            };
          }

          CategoryGroupAddOrUpdate(params)
            .then((res) => {
              if (res.ret.errcode == 1) {
                this.$message({
                  type: "success",
                  message: this.type == "edit" ? "编辑成功" : "添加成功",
                });
                this.$emit("on-confirm");
              }
            })
            .catch((error) => {});
        }
      });
    },
    // 获取下一级分类
    getSubCategory(data, resolve) {
      if (data.level == 0) {
        return;
      }
      let value = JSON.parse(data.value);
      if (data.level < 2) {
        this.fetchCategory({
          pid: parseInt(value.id),
          cateType: 1,
          level: data.level + 1,
          countryCode: this.countryCode,
          resolve,
        });
      } else {
        resolve([]);
      }
    },
    // 获取分类
    fetchCategory({ id, cateType, level, pid, page, countryCode, resolve }) {
      categoryListGet(
        this.filterData({
          pid: pid,
          id: id,
          level: level,
          cateType: cateType,
          page: page,
          countryCode: countryCode,
        })
      ).then((res) => {
        if (res.ret.errcode === 1) {
          for (let i = 0; i < res.categoryUnit.length; i++) {
            if (level < 2) {
              res.categoryUnit[i]["levelValue"] = [];
            }
            let item = res.categoryUnit[i].cateNameValue.find((val) => {
              return val.languageCode == "cn";
            });
            res.categoryUnit[i]["cateName"] = item ? item.name : "";
            res.categoryUnit[i]["prop"] = JSON.stringify({
              id: String(res.categoryUnit[i].cateId),
              name: item ? item.name : "",
              cover: res.categoryUnit[i].cover,
            });
            if (level == 2) {
              res.categoryUnit[i]["leaf"] = true;
            }
          }
          resolve && resolve(res.categoryUnit, res);
        }
      });
    },
  },
  mounted() {
    this.fetchCategory({
      cateType: 1,
      level: 1,
      countryCode: this.countryCode,
      resolve: (data) => {
        this.categoryOptions = data;
      },
    });
  },
};
</script>
<style lang="scss" scoped>
.upload-box {
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
}
</style>
<style lang="scss" scoped>
.media-form-wrapper {
  // width:1000px;
  .image-show {
    display: flex;
    flex-wrap: wrap;
    width: 800px;
    .darg-item {
      height: 120px;
      width: 100px;
      display: flex;
      flex-direction: column;
    }
    .img_category {
      color: black;
      position: absolute;
      line-height: 1;
      bottom: 0;
      text-align: center;
      width: 100%;
      height: 20px;
    }
    .nodrag {
      user-select: none;
      user-drag: none;
    }
    .image-box {
      position: relative;
      height: 120px;
      width: 100px;
      margin: 10px;
      line-height: 170px;
      text-align: center;
      color: #fff;
      transition: transform 0.3s;
      .image-item {
        width: 100px;
        height: 100px;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        padding: 4px;
      }
      .media-img {
        width: 100%;
      }
      &:hover {
        .operate-area {
          opacity: 0.5;
          transition: opacity 0.3s;
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
        }
        cursor: move;
      }
      .operate-area {
        position: absolute;
        opacity: 0;
        background: #000000;
        height: 40px;
        line-height: 40px;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        color: #fff;
        font-size: 14px;
        span {
          cursor: pointer;
        }
      }
    }
    .upload-box {
      height: 100px;
      width: 100px;
      margin: 10px;
    }
  }
  .product-video {
    display: flex;
    flex-wrap: wrap;
    .video-wrap {
      width: 150px;
      height: 120px;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      padding: 4px;
      &:hover {
        .operate-area {
          opacity: 0.5;
          transition: opacity 0.3s;
        }
      }
      .operate-area {
        height: 120px;
        width: 150px;
        line-height: 120px;
        position: absolute;
        opacity: 0;
        background: #000000;
        bottom: 0;
        left: 0;
        box-sizing: border-box;
        color: #fff;
        font-size: 14px;
        text-align: center;
        font-size: 24px;
        i {
          padding: 8px;
        }
      }
    }
    .upload-box {
      padding-top: 10px;
      margin-left: 10px;
    }
  }

  .table {
    width: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    th {
      background: #f2f2f2;
      width: 120px;
      border: 1px solid #dcdfe6;
    }
    tr td {
      border: 1px solid #dcdfe6;
    }
    td {
      padding: 0 10px;
    }
    .limit {
      width: 120px;
      text-align: center;
    }
    .required {
      font-size: 16px;
      color: red;
      vertical-align: middle;
    }
  }
}
</style>
