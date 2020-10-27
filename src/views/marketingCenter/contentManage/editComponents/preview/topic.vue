<template>
    <div>
        <topic-box :data="componentVal"></topic-box>
    </div>
</template>
<script>
    import { mapState } from 'vuex'

    export default {
        props: {
            data: [Array, Object]
        },
        data () {
            return {}
        },
        computed: {
            ...mapState({
                pageData: state => state.contentManage.pageData,
                articleLangInfos: state => state.contentManage.articleLangInfos,
                currentLangIndex: state => state.contentManage.currentLangIndex,
                contentTag: state => state.contentManage.contentTag
            }),
            componentVal () {
                let Obj = JSON.parse(this.data.componentValue)
                let tagName = []
                for (let i = 0; i < this.pageData.contentTag.length; i++) {
                    let item = this.contentTag.find((val) => {
                        return val.id == this.pageData.contentTag[i]
                    })
                    if (item) {
                        tagName.push(item.tagName)
                    } else {
                        tagName.push(this.pageData.contentTag[i])
                    }
                }
                return {
                    articleTopicName: '',
                    articleTopicDesc: Obj.data,
                    contentTag: tagName,
                    number: ''
                }
            }
        },
        methods: {
            getMultiLangShowInfo (data) {
                if (this.currentLangIndex != -1) {
                    let lang = this.articleLangInfos[this.currentLangIndex].language
                    let item = data.find((val) => {
                        return val.language == lang
                    })
                    return item ? item.content : ''
                }
                return ''
            }
        }
    }
</script>
