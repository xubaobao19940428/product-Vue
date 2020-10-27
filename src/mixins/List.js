export default {
    data () {
        return {
            list: [],
            page: 1,
            pageSize: 20,
            total: 0
        }
    },
    methods: {
        handleSizeChange (value) {
            this.pageSize = value
            this.getList()
        },
        handleCurrentChange (value) {
            this.page = value
            this.getList()
        }
    }
}
