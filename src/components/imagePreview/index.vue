<template>
  <div class="image-preview-wrapper">
    <div class="close-box" @click="closePreview()">
      <i class="el-icon-close"></i>
    </div>
    <div class="image-list-wrapper" v-if="fileType == 'image'">
      <div @click="slideImg('pre')"><i class="el-icon-arrow-left"></i></div>
      <ul>
        <li v-for="(url, i) in imgList" :key="i" v-show="i == imgI">
            {{ notDealUrl }}
            <img v-if="notDealUrl" :src="url">
            <img v-if="url.indexOf('http') === -1" :src="dealShowFileSrc(url)">
            <img v-else :src="url">
        </li>
      </ul>
      <div @click="slideImg('next')"><i class="el-icon-arrow-right"></i></div>
    </div>
    <div v-else-if="fileType=='video'" class="video-wrapper">
      <video class="videoEl" controls autoplay :src="imgList[0]"></video>
    </div>
    <div v-else-if="fileType=='audio'" class="audio-wrapper">
      <audio class="audioEl" controls autoplay :src="imgList[0]"></audio>
    </div>
  </div>
</template>
<script>
    export default {
        props: {
            notDealUrl: Boolean,
            index: {
                default: 0,
                type: Number
            },
            fileType: {
                default: 'image',
                type: String
            },
            list: {
                type: Array,
                default: []
            },
            close: {
                type: Function,
                default: () => {}
            }
        },
        data () {
            return {
                imgI: 0,
                imgList: []
            }
        },
        watch: {
            index (newI, oldI) {
                if (newI !== this.imgI) {
                    this.imgI = newI
                }
            },
            list (newList, oldList) {
                if (newList !== this.imgList) {
                    this.imgList = newList
                }
            }
        },
        created () {
            this.imgI = this.index
            this.imgList = this.list
        },
        mounted() {
          console.log(this.fileType)
        },
        methods: {
            closePreview () {
                if (this.fileType == 'video') {
                    let $el = document.querySelector('.videoEl')
                    $el && $el.pause()
                }else if(this.fileType == 'audio'){
                    let $el = document.querySelector('.audioEl')
                    $el && $el.pause()
                }
                this.close()
                this.imgI = 0
            },
            slideImg (type) {
                if (type == 'pre') {
                    this.imgI -= 1
                } else {
                    this.imgI += 1
                }
                if (this.imgI < 0) {
                    this.imgI = this.imgList.length - 1
                }
                if (this.imgI > this.imgList.length - 1) {
                    this.imgI = 0
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.image-preview-wrapper{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,.8);
  z-index: 999999;
  display: flex;
  flex-direction: column;
  .close-box{
    color: #fff;
    font-size: 40px;
    text-align: right;
    cursor: pointer;
    box-sizing: border-box;
    padding: 30px 40px 0 0;
  }
  .image-list-wrapper{
    display: flex;
    align-items: center;
    position: relative;
    flex: 1;
    .el-icon-arrow-left, .el-icon-arrow-right{
      font-size: 40px;
      color: #fff;
      box-sizing: border-box;
      padding: 40px;
      cursor: pointer;
    }
    ul {
      flex: 1;
      height: 100%;
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      li {
        width: 100%;
        height: 100%;
        display: inline-block;
        position: relative;
        img{
          max-width: 100%;
          max-height: 100%;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          margin: auto;

        }
      }
    }
  }
  .video-wrapper{
    width: 400px;
    margin: 0 auto;
    video{
      width: 100%;
    }
  }
  .audio-wrapper{
    width: 400px;
    margin: 0 auto;
    text-align: center;
    audio{
      width: 100%;
    }
  }
}
</style>
