<template>
  <div class="upload_expection">
    <el-dialog
      title="异常包裹信息"
      :visible.sync="toggle"
      width="900px"
      @close="cancle"
      :close-on-click-modal="false"
    >
      <el-form
        label-position="right"
        label-width="100px"
        ref="abnormalDetail"
        :model="exceptionInfo"
        size="small"
        :rules="exceptionInfoRules"
      >
        <el-form-item label="包裹号：">
          <span>{{exceptionInfo.logiCode}}</span>
        </el-form-item>
        <el-form-item label="异常类型：">
          <span>{{exceptionInfo.abnormalReason}}</span>
        </el-form-item>
        <el-form-item label="异常商品上传：">
          <el-button type="primary" @click="localUpload" size="mini">本地上传</el-button>
          <el-button type="primary" @click="photoUpload" size="mini">拍照上传</el-button>
          <div class="image-upload-wrapper" v-if="local">
            <div class="image-box" v-for="(element, index) in imageList" :key="element">
              <div class="image-item-area">
                <el-image :src="dealShowFileSrc(element)" class="image-item"></el-image>
                <div class="operate-area">
                  <i class="el-icon-delete" @click.stop="delImgItem(index)"></i>
                </div>
              </div>
            </div>
            <div class="image-box upload-box">
              <el-upload
                action
                list-type="picture-card"
                multiple
                accept=".jpg, .jpeg, .png, .gif, .bmp, .JPG, .JPEG, .PBG, .GIF, .BMP"
                :http-request="uploadImage"
                :show-file-list="false"
                :before-upload="onImgBeforeUpload"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
          <photo-upload v-if="photo" :ref="'photo'" :index="0" @imgBase="imgBaseTo" :mark="'scan'"></photo-upload>
        </el-form-item>
        <el-form-item label="类目分组:" prop="groupName">
          <el-select
            v-model="exceptionInfo.groupName"
            placeholder="请录入物流单上收货人姓名后面拼接的内容"
            style="width:200px"
            clearable
          >
            <el-option
              v-for="(item,index) in groupNameList"
              :label="item.name"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle" size="small">取 消</el-button>
        <el-button type="primary" @click="confirm('abnormalDetail')" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFileRequest } from "@/request/file";
import photoUpload from "./photoUpload";
import { PurCateGroupSelect } from "@/request/purchase";
export default {
  // 上传异常信息
  name: "abnormalException",
  props: {
    logiCode: {
      type: String,
      default: "",
    },
    errMessage: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      exceptionInfo: this.exception,
      imageList: [],
      local: false,
      photo: false,
      groupNameList: [],
      exceptionInfoRules: {
        groupName: [
          {
            required: true,
            message: "请录入物流单上收货人姓名后面拼接的内容",
            trigger: "change",
          },
        ],
      },
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "",
    },
    exception: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  components: {
    photoUpload,
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
    localUpload() {
      this.local = true;
      this.photo = false;
    },
    photoUpload() {
      this.local = false;
      this.photo = true;
    },
    cancle() {
      this.reset();
      this.$emit("on-cancle");
    },
    reset() {
      //   console.log(this.$refs)
      _.forEach(this.$refs, (ref) => {
        ref[0] && ref[0].reset();
      });
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.exceptionInfo.imgs = this.imageList.join(",");
          this.$emit("on-confirm", this.exceptionInfo);
        } else {
          return false;
        }
      });
    },
    imgBaseTo(val) {
      this.imageList = val;
    },
    uploadImage(file) {
      let params = new FormData();
      let fileInfo = {
        fileName: file.file.name,
        type: "product",
      };
      params.append("file", file.file);
      params.append("param", JSON.stringify(fileInfo));
      let url = "/file/rest/uploadservices/uploadfile";
      uploadFileRequest(url, params)
        .then((res) => {
          if (res.status === "600") {
            this.imageList.push(res.original_link);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    delImgItem(index) {
      this.imageList.splice(index, 1);
    },
    getPurCateGroupSelect() {
      PurCateGroupSelect({}).then((res) => {
        if (res.ret.errcode == 1) {
          _.forEach(res.groupList, (item) => {
            item.value = item.groupName;
          });
          this.groupNameList = res.groupList;
          this.groupNameList.unshift({
            value: "无对应类目",
            groupName: "无对应类目",
          });
          console.log(this.groupNameList);
        }
      });
    },
  },
  mounted() {
    this.getPurCateGroupSelect();
  },
};
</script>

<style lang="scss">
.upload_expection {
  .upload-box {
    height: 100px;
    width: 100px;
    margin: 10px;
    line-height: 190px !important;
    .el-upload--picture-card {
      width: 100px;
      height: 100px;
      line-height: 110px;
    }
  }
}
.upload_expection {
  .el-dialog__header {
    border-bottom: 1px solid #ebeef5;
  }
  .el-dialog__footer {
    border-top: 1px solid #ebeef5;
  }
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
}
</style>
<style lang="scss" scoped>
.upload_expection {
  .image-box {
    position: relative;
    display: inline-block;
    height: 100px;
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
}
</style>