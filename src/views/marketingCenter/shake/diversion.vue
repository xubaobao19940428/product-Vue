<template>
  <div class="diversion" v-if="propShow">
    <el-form :model="diversionForm" label-width="120px" :rules="divisionRules" ref="diversionForm">
      <el-form-item label="开关" prop="switch">
        <el-switch
          v-model="diversionForm.switch"
          active-color="#13ce66"
          style="margin-left:25px;"
          inactive-color="#ff4949"
        ></el-switch>
      </el-form-item>
      <el-form-item label="标题" required>
        <el-form-item label="中文:" label-width="50px" prop="title.cn">
          <el-input v-model="diversionForm.title.cn" class="title"></el-input>
        </el-form-item>
        <el-form-item label="英文:" label-width="50px" prop="title.en">
          <el-input v-model="diversionForm.title.en" class="title"></el-input>
        </el-form-item>
        <el-form-item label="马来:" label-width="50px">
          <el-input v-model="diversionForm.title.ms" class="title"></el-input>
        </el-form-item>
        <el-form-item label="泰国:" label-width="50px">
          <el-input v-model="diversionForm.title.th" class="title"></el-input>
        </el-form-item>
        <el-form-item label="印尼:" label-width="50px">
          <el-input v-model="diversionForm.title.id" class="title"></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="　">
        <el-form-item label="图片:" label-width="50px" prop="imgSrc">
          <!-- <c-upload
            :limit="1"
            ref="cooperationImg"
            :fileList="diversionForm.imgSrc"
            @setData="setCoverImg"
          ></c-upload>-->
          <multi-lang-file-upload
            v-if="propShow"
            :propFileList="diversionForm.imgSrc"
            @setData="setActiveBaseCover"
            accept="image/jpeg, image/jpg, image/png, image/gif"
          ></multi-lang-file-upload>
        </el-form-item>
      </el-form-item>
      <el-form-item label="链接">
        <el-form-item
          :label="countryCode=='MY'?'马来:':(countryCode=='TH')?'泰国:':'新加坡:'"
          label-width="60px"
          prop="link"
        >
          <el-input v-model="diversionForm.link" class="title"></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitDevision('diversionForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import multiLangFileUpload from "@/components/multiLangFileUpload/";
import cUpload from "@/components/fileUpload/";
import { addTriggerUrl, fetchTriggerUrl } from "@/api/shake.js";
export default {
  name: "",
  props: {
    propShow: {
      type: Boolean,
      default: false
    },
    countryCode: {
      type: String,
      default: "MY"
    }
  },
  data() {
    var valiImg = (rule, value, callback) => {
      // 图片验证
      if (!this.hasImg) {
        callback(new Error("导流图片不能为空"));
      } else {
        callback();
      }
    };

    return {
      diversionForm: {
        switch: true,
        title: {
          cn: "", //中文
          en: "", //英文
          ms: "", //马来
          th: "", //泰国
          id: "" //印尼
        },
        imgSrc: [],
        link: ""
      },

      hasImg: false,
      divisionRules: {
        switch: [
          { required: true, message: "请挑选导流开关设置", trigger: "change" }
        ],

        "title.cn": [
          {
            required: true,
            message: "中文标题不能为空",
            trigger: "blur"
          }
        ],
        "title.en": [
          {
            required: true,
            message: "英文标题不能为空",
            trigger: "blur"
          }
        ],
        link: [
          {
            required: true,
            message: "导流链接不能为空",
            trigger: "blur"
          }
        ],
        imgSrc: [
          {
            required: true,
            validator: valiImg,
            trigger: "change"
          }
        ]
      }
    };
  },
  components: {
    cUpload,
    multiLangFileUpload
  },
  computed: {},
  watch: {
    countryCode: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.diversionForm.title.th=''
          this.diversionForm.title.ms=''
          this.diversionForm.title.id=''
          this.$refs.diversionForm.resetFields();
        }
      },
      deep: true
    }
  },
  methods: {
    setActiveBaseCover(data) {
      if (data.length != 0) {
        this.hasImg = true;
        this.$refs["diversionForm"].validateField("imgSrc");
      }
      this.diversionForm.imgSrc = data;
    },
    submitDevision(formName) {
      if (this.diversionForm.imgSrc != "") {
        this.hasImg = true;
      } else {
        this.hasImg = false;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let imgSrc = {};
          this.diversionForm.link = this.diversionForm.link.trim();
          let data = JSON.parse(JSON.stringify(this.diversionForm));
          data.title = this.filterData(this.diversionForm.title);
          _.forEach(data.imgSrc, item => {
            imgSrc[item.languageCode] = item.name;
          });
          data.imgSrc = imgSrc;
          var params = {
            keyword: "advertising_" + this.countryCode,
            value: JSON.stringify(data)
          };
          addTriggerUrl(params).then(res => {
            if (res.ret.errCode === 0) {
              this.$message.success("保存成功");
              // this.getData()
            }
          });
        } else {
          this.$message.error("有必填项未填写");
          return false;
        }
      });
    },
    getData() {
      this.pointsUrl = "";
      fetchTriggerUrl({
        keyword: "advertising_" + this.countryCode
      }).then(res => {
        if (res.ret.errCode === 0) {
          if (res.data) {
            var dataForm = JSON.parse(res.data.value);
            this.diversionForm.switch = dataForm.switch;
            this.diversionForm.title = Object.assign(
              this.diversionForm.title,
              dataForm.title
            );
            this.diversionForm.link = dataForm.link;
            let imgSrc = [];
            _.forEach(dataForm.imgSrc, (value, key) => {
              imgSrc.push({
                languageCode: key,
                name: value
              });
            });
            this.diversionForm.imgSrc = imgSrc;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.diversion {
  .el-form {
    /deep/ .title {
      width: 300px;
    }
    .el-form-item {
      .el-form-item {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
