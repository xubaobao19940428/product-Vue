<template>
  <div>
    <el-dialog title="异常处理" :visible="propShowDialog" width="800px" @close="close">
      <el-form label-position="right" label-width="130px">
        <el-form-item label="异常类型：">
          <span>{{ param.abnormalReason }}</span>
        </el-form-item>
        <el-form-item label="异常数量：">
          <span>{{ param.abnormalCount}}</span>
        </el-form-item>
        <el-form-item label="skuCode：">
          <span>{{ param.skuCode}}</span>
        </el-form-item>
        <el-form-item label="商品名称：">
          <span>{{ param.nameCn}}</span>
        </el-form-item>
        <el-form-item label="商品备注：">
          <span>{{ param.productContent }}</span>
        </el-form-item>
        <el-form-item label="处理备注：">
          <el-input
            size="medium"
            :disabled="dealType == 'edit' ? false : true"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            style="width: 230px"
            v-model="param.content"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="图片上传">
                    <c-upload :limit=6 ref="abnormalImg" :fileList="param.imgs" @setData="setCoverImg"></c-upload>
        </el-form-item>-->
        <el-form-item label="图片上传">
          <el-button type="primary" @click="localUpload" size="mini">本地上传</el-button>
          <el-button type="primary" @click="photoUpload" size="mini">拍照上传</el-button>
          <upload-multi-pic
            v-if="local"
            :ref="'upload'"
            :index="index"
            @update-image="handleUpdateImage"
          ></upload-multi-pic>
          <photo-upload v-if="photo" :ref="'photo'" :index='0' @imgBase="imgBaseTo"></photo-upload>
        </el-form-item>
      </el-form>
      <el-timeline>
        <el-timeline-item
          v-for="(item, i) in param.process"
          :type="i == param.process.length - 1 ? 'primary' : 'info'"
          :key="i"
          :timestamp="item.createTime | formatTime"
          placement="top"
        >
          <el-card>
            <div class="flex-between">
              <span>处理人：{{ item.userName }}</span>
              <span>{{ item.createTime | formatTime }}</span>
            </div>
            <div class="mar-t-10">{{ item.content }}</div>
            <div
              class="list-img-box"
              v-for="(url, i) in formatImg(item.imgs)"
              @click="previewImg(formatImg(item.imgs), 0)"
              v-if="i == 0"
              :key="i"
            >
              <img :src="dealShowFileSrc(url)" />
              <span>{{ formatImg(item.imgs).length }}</span>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close" size="small">取 消</el-button>
        <el-button
          type="primary"
          @click="submitSkuAbnormal"
          v-preventReClick="500"
          size="small"
          :loading="loading"
        >确 定</el-button>
      </div>
    </el-dialog>
    <image-preview
      v-show="image.show"
      :close="closePreview"
      :index="image.index"
      :list="image.list"
      class="imagePreview"
    ></image-preview>
  </div>
</template>
<script>
import cUpload from "@/components/fileUpload/";
import { purchaseDealAbnormal } from "@/request/warehouse";
import imagePreview from "@/components/imagePreview";
import UploadMultiPic from "../../components/UploadMultiPic";
import photoUpload from "../../components/photoUpload";
export default {
  props: {
    propShowDialog: Boolean,
    propParam: Object,
    dealType: String,
  },
  data() {
    return {
      image: {
        show: false,
        index: 0,
        list: [],
      },
      local: false,
      photo: false,
      param: {
        imgs: "",
        abnormalCount: "",
        abnormalNo: "",
        abnormalReason: "",
        skuCode: "",
        nameCn: "",
        productContent: "",
        content: "",
        process: [],
      },
      loading: false,
    };
  },
  watch: {
    propParam: {
      handler(val) {
        Object.assign(this.param, val);
      },
      deep: true,
    },
  },
  components: {
    cUpload,
    imagePreview,
    UploadMultiPic,
    photoUpload,
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
    closePreview() {
      this.image.index = 0;
      this.image.show = false;
    },
    previewImg(imgs, i) {
      this.image.list = imgs;
      this.image.index = i;
      this.image.show = true;
    },
    formatImg(imgStr) {
      if (imgStr) {
        return imgStr.split(",");
      }
      return [];
    },
    handleUpdateImage(imagesInfo) {
      
      this.param["imgs"] = imagesInfo.imgs;
      
    },
    imgBaseTo(imagesInfo) {
      this.param["imgs"] = imagesInfo.imgs;
    },
    close() {
      this.reset();
      this.$emit("close");
    },
    reset() {
      this.param = {
        imgs: "",
        abnormalCount: "",
        abnormalReason: "",
        skuCode: "",
        nameCn: "",
        productContent: "",
        content: "",
        process: [],
      };
      this.loading = false;
    },

    setCoverImg(res) {
      this.param.imgs = res.data;
    },
    submitSkuAbnormal() {
      if (this.dealType != "edit") {
        this.close();
        return;
      }
      this.loading = true;
      purchaseDealAbnormal(this.filterData(this.param))
        .then((res) => {
          this.loading = false;
          if (res.ret.errcode === 1) {
              this.local = false
              this.photo = false
              this.reset();
              this.$emit("confirm");
             
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
