<template>
    <div class="app-container">
        <el-input
                type="textarea"
                :rows="10"
                placeholder="请输入内容"
                v-model="textarea"
                @blur="conversion(textarea)">
        </el-input>
        <el-input
                type="textarea"
                :rows="10"
                v-model="conTextarea"
        >
        </el-input>
    </div>
</template>
<script>

  export default {
    data () {
      return {
        textarea: '',
        conTextarea: '',
        ajaxUrl: '',
        fetchMethods: 'get',
        paramList: [{
          key: '',
          val: ''
        }],
        params: '',
        resData: '',
        methodMap: {
          'get': 'get',
          'post': 'post',
          'post2': 'post拼参'
        }
      }
    },
    methods: {
      conversion (data) {
        for (let i = 0; i < data.length; i++) {
          // this.conTextarea = data.split(/[\s\n]/)
          this.conTextarea = JSON.stringify(data.split(/[\s\n]/))
        }
      }

    }
  }
</script>
<style lang="scss" scoped>
    .list-item{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        span{
            margin-left: 10px;
        }
        i{
            font-size: 20px;
            cursor: pointer;
            margin-left: 10px;
        }
    }
    .copy-content{
        margin-right: 10px;
    }
</style>
