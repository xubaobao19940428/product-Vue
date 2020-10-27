<template>
  <div class="confirm-sockin-dialog">
    <el-dialog
      title="上传少件异常图片"
      :visible.sync="toggle"
      width="1000px"
      @close="cancle"
      :close-on-click-modal="false"
    >
      <div style="color:red">您有少件异常SKU需要录入现场照片,请上传</div>
      <el-card v-for="(item,index) in sockInData.scokInSkuList" :key="index" class="box-card">
        <el-form label-position="right" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="商品名称：">
                <span>{{ item.skuName }}</span>
              </el-form-item>
              <el-form-item label="skuCode：">
                <span>{{ item.skuCode }}</span>
              </el-form-item>
              <el-form-item label="商品规格：">
                <span>{{ item.standardAttr }}</span>
              </el-form-item>
              <el-form-item label="标注异常类型：">
                <el-select v-model="item.abnormalType" size="medium" disabled>
                  <el-option
                    v-for="item in skuAbnormalTypeList"
                    :key="item.type"
                    :label="item.remark"
                    :value="item.type"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="异常商品上传：" required>
                <el-button type="primary" @click="localUpload(item,index)" size="mini">本地上传</el-button>
                <el-button type="primary" @click="photoUpload(item,index)" size="mini">拍照上传</el-button>
                <div class="image-upload-wrapper" v-if="item.local">
                  <div class="image-box" v-for="(element, imgIndex) in imageList[index]" :key="element">
                    <div class="image-item-area">
                      <el-image :src="dealShowFileSrc(element)" class="image-item"></el-image>
                      <div class="operate-area">
                        <i class="el-icon-delete" @click="delImgItem(index,imgIndex)"></i>
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
                <photo-upload
                  v-if="item.photo"
                  :ref="'photo'+index"
                  :index="index"
                  @imgBase="imgBaseTo"
                  :mark="'scan'"
                ></photo-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle" size="small">取 消</el-button>
        <el-button type="primary" @click="confirm" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFileRequest } from "@/request/file";
import { skuAbnormalType } from "@/request/warehouse";
import UploadMultiPic from "./UploadMultiPic";
import photoUpload from "./photoUpload";
export default {
  // 确认入口
  name: "abnormalProduct",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    sockInData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      skuAbnormalTypeList: [],
      local: false,
      photo: false,
      imageList: [],
      index:0
    };
  },
  components: {
    UploadMultiPic,
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
  watch: {
    sockInData:{
      handler(newVal,oldVal){
        newVal.scokInSkuList.map(item=>{
          this.imageList.push([])
        })
      },
      deep:true
    }
  },
  created() {
    this.getSkuAbnormalTypeList();
  },
  methods: {
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
           this.imageList[this.index].push(res.original_link)
           this.sockInData.scokInSkuList[this.index]["imgs"] = this.imageList[this.index].join(',');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    imgBaseTo(imagesInfo) {
       this.sockInData.scokInSkuList[this.index]["imgs"] = imagesInfo.join(',')
    },
    localUpload(item, index) {
        console.log(index)
      item.local = true;
      item.photo = false;
      this.index = index;
      this.$set(this.sockInData.scokInSkuList, index, item);
    },
    photoUpload(item, index) {
      item.local = false;
      item.photo = true;
      this.index = index;
      this.$set(this.sockInData.scokInSkuList, index, item);
    },
    getSkuAbnormalTypeList() {
      skuAbnormalType()
        .then((res) => {
          if (res.ret.errcode === 1) {
            this.skuAbnormalTypeList = res.type;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancle() {
      this.reset();
      this.$emit("on-cancle");
    },
    confirm() {
      let flag = 0;
      console.log(this.sockInData);
      _.forEach(this.sockInData.scokInSkuList, (item) => {
        if (!item.imgs) {
            flag = flag + 1;
        }
      });
      if (flag > 0) {
        this.$message.error("少件必须上传图片");
      } else {
        this.$emit("on-confirm", this.sockInData);
      }
    },
    delImgItem(imgindex,index){
        this.imageList[imgindex].splice(index,1)
        this.sockInData.scokInSkuList[this.index]["imgs"] = this.imageList[this.index].join(',');
    },
    reset() {
      _.forEach(this.$refs, (ref) => {
        ref[0] && ref[0].reset();
      });
    },
  },
};
</script>

<style lang="scss">
.confirm-sockin-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #ebeef5;
  }
  .el-dialog__body {
    padding: 50px 40px;
  }
  .el-dialog__footer {
    border-top: 1px solid #ebeef5;
  }
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
}
.confirm-sockin-dialog {
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

.upload-wapper {
  overflow: hidden;
}
.cover-image {
  width: 110px;
  height: 110px;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  padding: 4px;
  &:hover {
    .operate-area {
      opacity: 0.5;
      transition: opacity 0.3s;
      border-radius: 6px;
    }
  }
  .operate-area {
    position: absolute;
    opacity: 0;
    background: #000000;
    height: 110px;
    line-height: 110px;
    bottom: 0;
    left: 0px;
    width: 110px;
    box-sizing: border-box;
    color: #fff;
    font-size: 16px;
    text-align: center;
  }
}
</style>

<style lang="scss" scoped>
.confirm-sockin-dialog {
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
  /deep/ .el-form-item {
    margin-bottom: 5px;
  }
}
</style>
