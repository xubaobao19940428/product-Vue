<template>
<div>
    <el-select filterable multiple :value="value" @change="changeHandle" @remove-tag="removeHandle"
        v-bind="$attrs" placeholder="请选择" size="medium" style="width: 400px" :disabled="disabled">
        <el-option v-for="item in optionList" :key="item.attrId" :label="item.cn" :value="item.attrId" :disabled="item.disabled">
        </el-option>
        <div slot="empty" class="empty-option">
            没有你想要的属性值？
            <el-link v-if="standardInfo.customize === 1" :underline="false" type="primary" @click="addAttrValue()">新增</el-link>
            <!-- 不允许自定义属性时 -->
            <span v-else>请联系属性值管理员扩充属性模板</span>
        </div>
    </el-select>
    <add-attr-value-dialog :dialogVisible="addAttrValueVisible" @on-cancle="cancleAddAttr" @on-confirm="confirmAddAttr"></add-attr-value-dialog>
</div>
</template>

<script>
    import { productAttrGetById, addCustomizeAttrValue } from '@/request/product'
    import AddAttrValueDialog from './AddAttrValueDialog'
    export default {
        // model: {
        //     prop: 'value',
        //     event: 'input'
        // },
        props: {
            value: null,
            optionList: {
                type: Array,
                default: () => []
            },
            standardInfo: {
                type: Object,
                default: () => {}
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                selected: [],
                addAttrValueVisible: false
            }
        },
        components: {
            AddAttrValueDialog
        },
        methods: {
            changeHandle(val) {
                this.selected = val
                console.log(val)
                console.log(this.selected)
                // 延时返回数据，主要是因为element会先执行change然后在执行remove，为了恢复不可删除的栏目，所以延时返回数据
                setTimeout(() => {
                    this.$emit('change-selected', this.selected)
                }, 10)
            },
            removeHandle(val) {
                // 检查选项是否可用
                let removeItem = this.optionList.find((item) => {
                    return item.attrId === val && item.disabled === false
                })
                console.log(val, removeItem)
                // 如果找不到表示不可删除
                if (typeof removeItem === 'undefined') {
                    this.selected = this.value
                } else {
                    // 如果找到可删除，则过滤
                    this.selected = this.value.filter((item) => {
                        return item !== val
                    })
                }
            },
            addAttrValue() {
                this.addAttrValueVisible = true
            },
            cancleAddAttr() {
                this.addAttrValueVisible = false
            },
            confirmAddAttr(data) {
                this.addAttrValueVisible = false
                let nameAndCode = []
                _.forEach(data, (item, key) => {
                    let attrItem = {}
                    attrItem.languageCode = key
                    attrItem.name = item
                    nameAndCode.push(attrItem)
                })
                this.addCustomizeAttrValue(nameAndCode)
            },
            /***
             * 添加自定义属性值
             */
            addCustomizeAttrValue(nameAndCode) {
                let params = {
                    attrId: this.standardInfo.attrId,
                    valueName: nameAndCode
                }
                addCustomizeAttrValue(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('属性值添加成功！')
                        // 获取最后一条 ，构造下拉控件数据
                        let attrValue = res.attrValue
                        let newAttr = attrValue[attrValue.length - 1]
                        let optionItem = {}
                        optionItem.attrId = newAttr.valueId
                        optionItem.allowDel = true
                        optionItem.disabled = false
                        _.forEach(newAttr.valueName, item => {
                            optionItem[item.languageCode] = item.name
                        })
                        this.$emit('update-option', optionItem)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    }
</script>
