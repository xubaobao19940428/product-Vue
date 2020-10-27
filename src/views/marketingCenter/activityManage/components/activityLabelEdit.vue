<template>
    <el-dialog title="活动商品分组" width="700px"
               append-to-body
               :visible="propShowDialog"
               @close="close">
        <div>
            <el-form ref="addDialog" label-position="right"
                     :rules="rules"
                     :model="param">
                <el-table ref="dragTable" :data="param.groupInfo" row-key="id" fit highlight-current-row style="width: 100%; margin-top:16px;" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                    <el-table-column label="分组ID" align="center"  width="70">
                        <template slot-scope="scope">
                            <span>{{ scope.row.id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="item in languageList" :key="item.code" :label="item.desc" align="center">
                        <template slot-scope="scope">
                            <el-input v-if="getIndex(scope.row.name, item) != -1" v-model="scope.row.name[getIndex(scope.row.name, item)].name" clearable size="medium" placeholder="请输入"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="90">
                        <template slot-scope="scope">
                            <el-button type="text"><i class="el-icon-s-operation"></i></el-button>
                            <el-button type="text" @click="addLabel(scope.$index)"><i class="el-icon-plus"></i></el-button>
                            <el-button type="text" @click="removeLabel(scope.$index)"><i class="el-icon-close"></i></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="text" v-if="param.groupInfo.length <= 0" @click="addLabel(-1)"><i class="el-icon-plus"></i>新增分组</el-button>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="close">取 消</el-button>
                <el-button size="small" :loading="loading" type="primary" @click="confirmAddItem">确 定</el-button>
            </span>
    </el-dialog>
</template>
<script>
    import { insertOrUpdateGroup } from '@/request/marketing.js'
    import { createRandomId } from '@/utils/index'
    import Sortable from 'sortablejs'
    export default {
        props: {
            propShowDialog: Boolean,
            propParam: {
                type: Object,
                default: () => { return {} }
            }
        },
        data () {
            return {
                param: {
                    activeId: '',
                    groupInfo: []
                },
                rules: {},
                loading: false
            }
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            },
            languageList () {
                return this.$store.state.dict.languageList
            }
        },
        watch: {
            propShowDialog (val) {
                if (val) {
                    Object.assign(this.param, this.propParam)
                    this.init()
                    this.setSort()
                }
            }
        },
        methods: {
            init () {
                for (let i = 0; i < this.param.groupInfo.length; i++) {
                    for (let j = 0; j < this.languageList.length; j++) {
                        let lang = this.languageList[j].code
                        let item = this.param.groupInfo[i].name.find((val) => {
                            return val.languageCode == lang
                        })
                        if (!item) {
                            this.param.groupInfo[i].name.push({
                                languageCode: lang,
                                name: ''
                            })
                        }
                    }
                }
            },
            setSort () {
                this.$nextTick(() => {
                    const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
                    console.log(el)
                    this.sortable = Sortable.create(el, {
                        ghostClass: 'sortable-ghost',
                        onEnd: (e) => {
                            let tempIndex = this.param.groupInfo.splice(e.oldIndex, 1)
                            this.param.groupInfo.splice(e.newIndex, 0, ...tempIndex)
                        }
                    })
                })
            },
            confirmAddItem () {
                this.loading = true
                let groupInfo = []
                for (let i = 0; i < this.param.groupInfo.length; i++) {
                    let flag = true
                    for (let item of this.param.groupInfo[i].name) {
                        if (item.languageCode == 'cn' || item.languageCode == 'en') {
                            if (!item.name) {
                                flag = false
                            }
                        }
                    }
                    if (flag) {
                        groupInfo.push(this.param.groupInfo[i])
                        if (groupInfo[groupInfo.length - 1].id && String(groupInfo[groupInfo.length - 1].id).indexOf('front_') != -1) {
                            groupInfo[groupInfo.length - 1].id = ''
                        }
                        groupInfo[groupInfo.length - 1].sort = groupInfo.length
                    }
                }
                insertOrUpdateGroup({ activeId: this.param.activeId, groupInfo: groupInfo }).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.reset()
                        this.$emit('confirm')
                        this.$message.success('操作成功')
                    }
                }).catch(() => {
                    this.loading = false
                })
            },
            removeLabel (i) {
                this.param.groupInfo.splice(i, 1)
            },
            addLabel (i) {
                let name = []
                for (let i = 0; i < this.languageList.length; i++) {
                    let lang = this.languageList[i].code
                    name.push({
                        languageCode: lang,
                        name: ''
                    })
                }
                this.param.groupInfo.splice(i + 1, 0, {
                    id: createRandomId(),
                    name: name,
                    sort: ''
                })
            },
            getIndex (data, key) {
                let itemI = data.findIndex((val) => {
                    return val.languageCode == key.code
                })
                return itemI
            },
            reset () {
                this.param = {
                    activeId: '',
                    groupInfo: []
                }
            },
            close () {
                this.reset()
                this.$emit('close')
            }
        }
    }
</script>
<style lang="scss" scoped>
    .form-tips{
        color: #666;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
    }
</style>
