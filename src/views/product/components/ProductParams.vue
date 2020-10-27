<template>
    <div class="product-params-wrapper">
        <el-form
            :inline="true"
            ref="productBaseInfoForm"
            :model="productParamsForm"
            label-width="150px"
        >
            <el-form-item label="品牌：" style="width: 500px">{{brandInfo.nameCn}}/{{brandInfo.nameEn}}</el-form-item>
            <el-form-item
                v-for="(item, index) in paramAttrs"
                :key="index"
                :label="item.cn + '：'"
                style="width: 500px"
            >
                <el-select
                    v-model="productParamsForm.productType[item.attrId]"
                    multiple
                    filterable
                    clearable
                    :multiple-limit="30"
                    placeholder="请选择或搜索"
                    style="width: 260px"
                    :disabled="!(type != 'edit' || (type == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                >
                    <el-option
                        v-for="(element, index) in paramAttrOption[item.attrId]"
                        :key="index"
                        :label="element.label"
                        :value="element.value"
                        style="width: 260px"
                    ></el-option>
                    <div slot="empty" class="empty-option">
                        没有你想要的属性值？
                        <el-link
                            v-if="item.customize === 1"
                            :underline="false"
                            type="primary"
                            @click="addAttrValue(item.attrId)"
                        >新增</el-link>
                        <!-- 不允许自定义属性时 -->
                        <span v-else>请联系属性值管理员扩充属性模板</span>
                    </div>
                </el-select>
                <el-button
                    v-if="type === 'check'"
                    type="text"
                    @click="delParams(item)"
                    style="margin-left: 6px"
                >删除</el-button>
            </el-form-item>
        </el-form>
        <add-attr-value-dialog
            :dialogVisible="addAttrValueVisible"
            @on-cancle="cancleAddAttr"
            @on-confirm="confirmAddAttr"
        ></add-attr-value-dialog>
        <!-- <el-button type="success" size="mini" @click="getParamsData">当前模块数据</el-button> -->
    </div>
</template>

<script>
import _ from "lodash";
import AddAttrValueDialog from "./AddAttrValueDialog";
import {
    productAttrGetById,
    productAttrGetByIdBatch,
    addCustomizeAttrValue
} from "@/request/product";
export default {
    // 商品参数
    name: "ProductParams",
    props: {
        type: {
            type: String,
            default: "add"
        },
        productId: {
            type: String,
            default: ""
        },
        draftId: {
            type: String,
            default: ""
        },
        brandInfo: {
            type: Object,
            default: () => {}
        },
        paramAttrs: {
            type: Array,
            default: () => []
        },
        standardAttrs: {
            type: Array,
            default: () => []
        },
        productParams: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            addAttrValueVisible: false,
            productTypeList: [],
            paramAttrOption: {},
            attrValueInfo: [],
            attrId: null,
            firstAddTime: "",
            isDel: false
        };
    },
    computed: {
        productParamsForm() {
            return this.productParams;
        }
    },
    components: {
        AddAttrValueDialog
    },
    watch: {
        paramAttrs: function(newValue, oldValue) {
            if (!this.isDel) {
                this.getAllAttrOpions(newValue);
            }
        }
    },
    created() {
        this.firstAddTime = Date.parse(new Date()).toString();
    },
    mounted() {
        console.log(this.productId);
    },
    methods: {
        addAttrValue(attrId) {
            this.attrId = attrId;
            this.addAttrValueVisible = true;
        },
        cancleAddAttr() {
            this.addAttrValueVisible = false;
        },
        getProductAttrById(attrId) {
            let params = {
                attrId: attrId
            };
            if (this.productId) {
                params.productId = this.productId;
            }
            if (this.draftId) {
                params.draftId = this.draftId;
            }
            //1 参数属性, 2 规格属性
            params.attrType = 1;
            productAttrGetById(params)
                .then(response => {
                    if (response.ret.errcode === 1) {
                        let optionList = [];
                        _.forEach(response.attrValue, item => {
                            let optionItem = {
                                label: "",
                                value: ""
                            };
                            optionItem.label = item.valueName[0]
                                ? item.valueName[0].name
                                : "";
                            optionItem.value = item.valueId;
                            optionList.push(optionItem);
                            
                            this.$set(
                                this.paramAttrOption,
                                response.attrId,
                                optionList
                            );
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        },
        getAllAttrOpions(paramAttrs) {
            const paramAttrId = [];
            const standardAttrId = [];
            _.forEach(paramAttrs, item => {
                paramAttrId.push(item.attrId);
            });
            _.forEach(this.standardAttrs, item => {
                standardAttrId.push(item.attrId);
            });
            
            let params = {};
            if (this.productId) {
                params.productId = this.productId;
            }
            if (this.draftId) {
                params.draftId = this.draftId;
            }
            //批量请求属性
            productAttrGetByIdBatch({
                paramAttrId,
                standardAttrId,
                ...params
            })
                .then(response => {
                    if (response.ret.errcode === 1) {
                        _.forEach(response.paramAttr, paramAttrs => {
                            let optionList = [];
                            _.forEach(paramAttrs.attrValue, item => {
                                let optionItem = {
                                    label: "",
                                    value: ""
                                };
                                optionItem.label = item.valueName[0]
                                    ? item.valueName[0].name
                                    : "";
                                optionItem.value = item.valueId;
                                optionList.push(optionItem);
                                this.$set(
                                    this.paramAttrOption,
                                    paramAttrs.attrId,
                                    optionList
                                );
                            });
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                });
            // _.forEach(paramAttrs, (item) => {
            //     this.getProductAttrById(item.attrId)
            // })
        },
        getParamsData() {
            if (this.productParamsForm.productType) {
                // 构造商品参数
                let attrValueInfo = [];
                _.forEach(this.productParamsForm.productType, (value, key) => {
                    _.forEach(value, item => {
                        let attrValueItem = {};
                        attrValueItem.attrId = key;
                        attrValueItem.valueId = item;
                        attrValueInfo.push(attrValueItem);
                    });
                });
                this.attrValueInfo = attrValueInfo;
            }
        },
        confirmAddAttr(data) {
            this.addAttrValueVisible = false;
            let nameAndCode = [];
            _.forEach(data, (item, key) => {
                let attrItem = {};
                attrItem.languageCode = key;
                attrItem.name = item;
                nameAndCode.push(attrItem);
            });
            this.addCustomizeAttrValue(nameAndCode);
        },
        /***
         * 添加自定义属性值
         */
        addCustomizeAttrValue(nameAndCode) {
            let params = {
                attrId: this.attrId,
                valueName: nameAndCode,
                firstAddTime: this.firstAddTime
            };
            addCustomizeAttrValue(params)
                .then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success("属性值添加成功！");
                        let attrValue = res.attrValue;
                        let newAttrValue = [];
                        _.forEach(attrValue, value => {
                            let item = {};
                            item.label = value.valueName[0].name;
                            item.value = value.valueId;
                            newAttrValue.push(item);
                        });
                        // 更换当前属性的属性下拉选项值
                        this.paramAttrOption[this.attrId] = newAttrValue;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        delParams(item) {
            this.isDel = true;
            let index = _.findIndex(this.paramAttrs, paramAttr => {
                return paramAttr.attrId === item.attrId;
            });
            this.paramAttrs.splice(index, 1);
            this.$delete(
                this.productParamsForm.productType,
                parseInt(item.attrId)
            );
        }
    }
};
</script>

<style lang="scss">
.empty-option {
    padding: 6px 10px;
    font-size: 14px;
    height: 30px;
}
</style>
<style lang="scss" scoped>
.product-params-wrapper {
    width: 1200px;
    padding: 10px 30px;
}
</style>
