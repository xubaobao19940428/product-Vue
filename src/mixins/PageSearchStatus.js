export default {
    methods: {
        getPageSearchStatus() {
            if (this.getStore('PageSearchStatus')) {
                let value = JSON.parse(this.getStore('PageSearchStatus'));
                // this.removeStore('PageSearchStatus');
                return value;
            } else {
                return null;
            }
        },
        setPageSearchStatus(SearchStatus) {
            this.setStore('PageSearchStatus', JSON.stringify(SearchStatus));
        },
        removePageSearchStatus() {
            this.removeStore('PageSearchStatus')
        }
    }
};
