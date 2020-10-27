<template>
  <div class="tag-wrapper">
    <el-tag
        style="margin:0 5px 5px 0"
        class="tag-item"
        v-for="(tag, index) in tagList"
        :key="index"
        closable
        :disable-transitions="false"
        @dblclick.native="tagAction('edit', index, tag)"
        @close="tagAction('del', index)">
      {{tag.nameCn}}/{{tag.nameEn}}
    </el-tag>
    <div v-if="tagInputVisible">
      <value-input :inputValueCn="specFrom.tagInputValueCn"
                   :inputValueEn="specFrom.tagInputValueEn"
                   :showCancelButton="true"
                   @saveValue="saveValue"
                   @cancelValue="tagInputVisible = false"
      ></value-input>
    </div>
    <el-button v-else class="button-new-tag" size="small"
               @click="tagAction('showInput')">+ 新增属性
    </el-button>
  </div>
</template>

<script>
import valueInput from './valueInput.vue'
export default {
    props: {
        tagList: {
            type: Array,
            default: []
        },
        tagParentI: {
            type: Number,
            default: 1
        },
        source: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            tagInputVisible: false,
            currentTag: null,
            specFrom: {
                tagInputValueCn: '',
                tagInputValueEn: ''
            },
            tagEditFlag: false
        }
    },
    components: {
        valueInput
    },
    methods: {
        saveValue ({ data }) {
            this.specFrom.tagInputValueCn = data.valueCn
            this.specFrom.tagInputValueEn = data.valueEn
            this.tagAction('save')
        },
        tagAction (type, tagI, tag) {
            switch (type) {
                case 'del':
                    // 删除
                    this.$emit('attrAction', {
                        type: type,
                        source: this.source,
                        parentIndex: this.tagParentI,
                        tagI: tagI
                    })
                    break
                case 'edit':
                    this.currentTag = tagI
                    this.tagInputVisible = true
                    this.specFrom.tagInputValueCn = tag.nameCn
                    this.specFrom.tagInputValueEn = tag.nameEn
                    this.tagEditFlag = true
                    // 编辑
                    break
                case 'save':
                    // 保存
                    if (this.tagEditFlag) {
                        this.$emit('attrAction', {
                            type: 'edit',
                            source: this.source,
                            parentIndex: this.tagParentI,
                            tagI: this.currentTag,
                            nameCn: this.specFrom.tagInputValueCn,
                            nameEn: this.specFrom.tagInputValueEn
                        })
                    } else {
                        this.$emit('attrAction', {
                            type: 'add',
                            source: this.source,
                            parentIndex: this.tagParentI,
                            nameCn: this.specFrom.tagInputValueCn,
                            nameEn: this.specFrom.tagInputValueEn
                        })
                    }
                    this.tagEditFlag = false
                    this.tagInputVisible = false
                    this.specFrom.tagInputValueCn = ''
                    this.specFrom.tagInputValueEn = ''
                    break
                case 'showInput':
                    // 显示输入框
                    this.tagInputVisible = true
                    break
            }
        }
    }
}
</script>
<style lang="scss">
  .tag-wrapper{
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    .tag-item{
      width: 92px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
      .el-icon-close{
        position: absolute;
        top: 7px;
        right: 5px;
      }
    }
  }
</style>
