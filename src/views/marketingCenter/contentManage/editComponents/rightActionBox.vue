<template>
    <div>
        <!--  用户角色-->
        <role v-if="currentComponentIndex == -2"></role>
        <template v-else-if="currentComponentIndex != -1 && componentsData[currentComponentIndex]">
            <!--  瀑布流-->
            <waterfall-action-box v-if="pageData.contentType == 3"></waterfall-action-box>
            <!--  图文-->
            <graphic-action-box v-else></graphic-action-box>
        </template>
        <article-basic v-else :subjectList="subjectList" :columnList="columnList" :topics="topics"></article-basic>
    </div>
</template>
<script>
    import { FindAllSpecialColumn } from '@/request/manage'
    import graphicActionBox from './graphicActionBox'
    import waterfallActionBox from './waterfallActionBox'
    import articleBasic from './action/articleBasic'
    import role from './action/role'
    import { mapState } from 'vuex'
    export default {
        data () {
            return {
                columnList: {
                    specialColumnName: '',
                    specialSubjectName: ''
                },
                subjectList: [],
                topics: []
            }
        },
        computed: {
            ...mapState({
                countryList: state => state.dict.countryList,
                articleLangInfos: state => state.contentManage.articleLangInfos,
                currentLangIndex: state => state.contentManage.currentLangIndex,
                currentComponentIndex: state => state.contentManage.currentComponentIndex,
                pageData: state => state.contentManage.pageData
            }),
            componentsData () {
                if (this.currentLangIndex != -1 && this.articleLangInfos.length > 0) {
                    return this.articleLangInfos[this.currentLangIndex].contentComponents
                }
                return []
            }
        },
        components: {
            graphicActionBox,
            waterfallActionBox,
            role,
            articleBasic
        },
        mounted () {
            if (this.pageData.contentType == 3) {
                this.getTopic()
            }
            this.getAllSubjects()
        },
        methods: {
            getTopic () {
                if (this.$route.query.topicId) {
                    this.$store.dispatch('updateArticlePageData', {
                        articleTopicId: this.$route.query.topicId
                    })
                }
            },
            // 获取专栏专题信息
            getAllSubjects () {
                FindAllSpecialColumn({
                    country: this.$route.query.countryCode
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        let item = res.specialColumn.find((val) => {
                            return val.specialColumnId == this.$route.query.specialColumnId
                        })
                        if (item) {
                            this.$store.dispatch('updateArticlePageData', {
                                specialColumnId: this.$route.query.specialColumnId,
                                specialSubjectId: this.$route.query.specialSubjectId ? this.$route.query.specialSubjectId : ''
                            })
                            this.topics = item.topics
                            Object.assign(this.columnList, item)
                            if (this.$route.query.specialSubjectId) {
                                let subjectItem = item.specialSubject.find((val) => {
                                    return val.specialSubjectId == this.$route.query.specialSubjectId
                                })
                                Object.assign(this.columnList, {
                                    specialSubjectName: subjectItem.specialSubjectName
                                })
                            }
                        }
                    }
                })
            }
        }
    }
</script>
