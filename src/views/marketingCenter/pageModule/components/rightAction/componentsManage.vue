<template>
    <div class="page-components-manage">
        <div class="head">
            <h5>组件管理</h5>
        </div>
        <div class="content">
            <ul class="list-wrapper">
                <li v-for="(item, index) in componentsData" :key="item.moduleId">
                    <div class="left">
                        <i class="iconfont" style="font-size: 14px;">&#xe6b3;</i>
                        {{ basicDetail[item.basicName].title }} 一 <span style="fontWeight: 600">{{ getCn(item.name) }}</span>
                    </div>
                    <i class="el-icon-copy-document del-icon" @click="handelAdd(index, item)"></i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Sortable from 'sortablejs'
import { createRandomId } from '@/utils/index.js'
import { mapState } from 'vuex'

export default {
    data () {
        return {
            sortable: null
        }
    },
    computed: {
        ...mapState({
            componentsData: state => state.pageEdit.componentsData,
            leftNavList: state => state.pageEdit.leftNavList,
            basicDetail: state => state.pageEdit.basicDetail
        })
    },
    methods: {
        handelAdd (curIndex, data) {
            let temp = JSON.parse(JSON.stringify(data))
            if (temp.basicName === 'productList') {
                temp.selectedType = ''
                temp.selectedId = []
                temp.isChange = false
            }
            this.$store.dispatch('updatePageData', {
                type: 'add',
                index: curIndex + 1,
                data: {
                    ...temp,
                    moduleId: createRandomId()
                }
            })
        },
        getComponentSetName (item) {
            let res = item.name.find(i => i.languageCode === this.lang)
            let title = item.title

            // 接口中没有传递title名，所以需要额外判断
            if (!res && !title) {
                title = this.leftNavList.find((i) => {
                    return i.basicName == item.basicName
                }).title
            }

            return res ? res.name : title
        },
        getCn (data) {
            let res = ''
            if (data && data.length) {
                res = data.find(item => item.languageCode === 'cn')

                if (!res) {
                    res = data[0].name
                }
            }

            return res ? res.name : ''
        }
    },
    mounted () {
        let $el = this.$el.querySelector('.list-wrapper')
        this.sortable = Sortable.create($el, {
            group: {
                name: 'components-manage',
                pull: false,
                put: true
            },
            sort: true,
            ghostClass: 'components-class',
            onUpdate: (e) => {
                this.$store.dispatch('updatePageData', {
                    type: 'sort',
                    newIndex: e.newIndex,
                    oldIndex: e.oldIndex
                })
            }
        })
    }
}
</script>

<style lang="scss">
    .page-components-manage {
        .content {
            ul {
                li {
                    cursor: move;
                    margin: 12px 0 0 0;
                    border-radius: 2px;
                    background-color: #fff;
                    line-height: 40px;
                    padding: 0 10px;
                    user-select: none;
                    font-size: 14px;
                    box-shadow: 0 0 4px 0 rgba(10,42,97,.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 400;
                    color: #606266;
                    .del-icon {
                        font-size: 18px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>