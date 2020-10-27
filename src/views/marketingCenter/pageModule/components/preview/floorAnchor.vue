<template>
    <div>
        <floor-anchor :info="item.info" :lang="lang" :offsetTop="46" scrollEle=".preview-content" :isTest="true"></floor-anchor>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    export default {
        props: {
            data: [Object, Array],
            lang: String
        },
        data () {
            return {
                item: {
                    info: {}
                }
            }
        },
        watch: {
            data: {
                handler (val) {
                    Object.assign(this.item, JSON.parse(JSON.stringify(val)))
                },
                deep: true
            }
        },
        created () {
            Object.assign(this.item, JSON.parse(JSON.stringify(this.data)))
        }
    }
</script>
