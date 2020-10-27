<template>
  <div class="category-card">
    <el-card class="box-card" :style="{ height: cardHeight + 'px'}" shadow="never">
      <div slot="header" class="clearfix"></div>
      <div class="category-list">
        <div
          class="list-group-item"
          v-for="item in categoryList"
          :key="item.cateId"
          :class="{active : active === item.cateName}"
          @click="selectItem(item)"
        >
          <p class="category-name">{{ item.cateId }} {{ item.cateName }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  // 类目卡片
  name: "CategoryForCard",
  inject: ["page"],
  props: {
    level: {
      type: Number,
      default: 1
    },
    categoryList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      active: "",
      cardHeight: 300,
      item: null,
     
    };
  },
  computed: {
    levelText() {
      let textArr = ["一级", "二级", "三级"];
      return textArr[this.level - 1];
    }
  },
  watch: {
    categoryList: function(newValue, oldValue) {
      if (newValue.length > 0) {
        this.active = newValue[0].cateName;
        this.selectItem(newValue[0]);
        // this.loading = false
      }
    }
  },
  created() {
    if (this.page === "product") {
      this.enableSort = false;
    } else {
      if (this.hasPermission("BTN_BACK_CATE_SORT")) {
        this.enableSort = true;
      } else {
        this.enableSort = false;
      }
    }
  },
  mounted() {
    if (this.page === "product") {
      this.cardHeight = 300;
    }
  },
  methods: {
    selectItem(item) {
      this.active = item.cateName;

      this.$emit("on-select", {cateId:item.cateId,level:this.level});
    },
    cancleConfirm() {
      this.confirmVisible = false;
    },
    
   
  }
};
</script>

<style lang="scss" scoped>
.category-card {
  .box-card {
    height: 320px;
    .parent-name {
      max-width: 160px;
      color: #409eff;
      font-weight: bold;
      padding-right: 4px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .category-list {
      height: 260px;
      padding: 20px;
      .list-group {
        height: 220px;
        overflow: auto;
      }
      .list-group-item {
        display: flex;
        height: 36px;
        line-height: 36px;
        cursor: pointer;
      }
      .active {
        background-color: #c6e5ff;
        color: #3a97ff;
      }
      .category-name {
        padding: 0 10px;
        display: inline-block;
        width: 82%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .category-name:hover {
        color: #3a97ff;
      }
      .operate {
        display: inline-block;
      }
      .empty {
        text-align: center;
        line-height: 320px;
        color: #999;
      }
    }
  }
  .add-category {
    text-align: center;
    border-top: 1px solid #ebeef5;
    .el-button {
      padding: 16px;
    }
  }
  /deep/ .el-card__body{
      overflow-y:scroll;
  }
}

</style>
