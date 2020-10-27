<template>
    <div class="content-holder"> 
        <!-- {{canvasList}} -->
        <div class="image-box" v-for="(element, index) in canvasList" :key="index">
            <div class="btn-box">
                <el-button type="primary" @click="readyPhoto(index)" size="mini" class="btn">开始拍照</el-button>      
                <el-button type="primary" @click="startPhoto(index)" size="mini" class="btn">拍照</el-button>  
            </div>   
            <div class="image-item-area">
                <canvas :ref="'canvas' + index" width="1280" height="720" class="image-item"></canvas> 
                <!-- <div class="operate-area">
                    <i class="el-icon-delete" @click.stop="delImgItem(index)"></i>
                </div> -->
            </div>
        </div>
        <div v-if="show">
            <video id="video" width="300" height="300" autoplay></video>         
        </div> 
        <!-- <el-dialog
        title="拍照"
        :visible.sync="dialogVisible"
        width="70%"
        :before-close="cancle"
        append-to-body>
        <div v-show="show">
            <video id="video" width="1280" height="720" autoplay></video>         
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancle">取 消</el-button>
            <el-button type="primary" @click="confirm">拍 照</el-button>
        </span>
        </el-dialog> -->
    </div>
</template>   
<script>
    import { uploadFileRequest } from '@/request/file'

    export default {
        data() {
            return {
                show:false,
                track: null,
                canvasList:[0],
                imageList: [],
                dialogVisible:false,
                choseIndex: 0
            }
        },
        props: {
            index: {
                type: Number
            },
            mark: String
        },
        
        methods: {
            cancle () {
                this.dialogVisible = false

            },
            confirm () {
                this.dialogVisible = false
                this.startPhoto()
            },
            readyPhoto(index){
                this.show = true
                let that = this
                this.choseIndex = index
                this.dialogVisible = true
                navigator.getUserMedia = navigator.getUserMedia ||	navigator.webkitGetUserMedia ||	navigator.mozGetUserMedia;
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({video:true},
                        function(stream) {
                            that.track = stream.getTracks()[0]  // 通过这个关闭摄像头
                            video.srcObject = stream
                            video.onloadedmetadata = function(e) {
                                video.play()
                            }
                        },
                        function(err) {
                            console.log(err.name)
                        }
                    )
                }	
                if (this.canvasList.indexOf(index) !== -1 && this.canvasList.length>1 ){
                    this.canvasList.pop()
                }
            },
            startPhoto (index) {
                this.show = false
                let imgSrc = ''
                let img = ''
                console.log(video)
                let context2D = this.$refs[`canvas${index}`][0].getContext("2d");
                context2D.fillStyle = "#ffffff";
                context2D.fillRect(0, 0, 1280, 720);
                context2D.drawImage(video, 0, 0, 1280, 720);
                imgSrc = this.$refs[`canvas${index}`][0].toDataURL("image/png");//要传给后台的base64
                img = this.dataURLtoFile(imgSrc,index)
                console.log(img)
                this.$nextTick(()=>{
                    this.canvasList.push(index)

                })
                console.log(this.canvasList)
                this.track.stop() 
                this.uploadImage(img,this.choseIndex)
            },
            uploadImage(file,index) {
                console.log(file)
                let params = new FormData();
                let fileInfo = {
                    fileName: file.name,
                    type: 'other'
                }
                params.append('file',file);
                params.append('param', JSON.stringify(fileInfo));
                let url = '/file/rest/uploadservices/uploadfile'
                uploadFileRequest(url, params).then(res => {
                    if (res.status === '600') {
                        console.log(res)
                        console.log(this.dealShowFileSrc(res.original_link))
                        if (this.mark === 'scan'){
                            this.imageList.push(res.original_link)
                            this.$emit('imgBase', this.imageList)
                        }else {
                            this.imageList.push(res.original_link)
                            let imageObj = {
                                index: this.index,
                                imgs: this.imageList.join(',')
                            }
                            console.log(imageObj)
                            this.$emit('imgBase', imageObj)
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            dataURLtoFile(dataurl, index, filename = 'file') {
                let arr = dataurl.split(',')
                let mime = arr[0].match(/:(.*?);/)[1]
                let suffix = mime.split('/')[1]
                let bstr = atob(arr[1])
                let n = bstr.length
                let u8arr = new Uint8Array(n)
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n)
                }
                return new File([u8arr], `${filename}${index}.${suffix}`, {
                    type: mime
                })
            },
            delImgItem(index) {
                this.imageList.splice(index, 1)
                this.canvasList.splice(index, 1)
            },
            reset() {
                this.imageList = []
                this.canvasList = [0]
            }
        },
    }
</script>
<style lang="scss" scoped>
    .content-holder{
        .image-box {
            display:flex;
            justify-content:space-around;
            position: relative;
            height: 95px;
            text-align: center;
            color: #fff;
            transition: transform .3s;
            .image-item {
                width: 90px;
                height: 90px;
                border: 1px dashed #c0ccda;
                border-radius: 6px;
                padding: 4px;
            }
            &:hover {
            .operate-area {
                opacity: .5;
                transition: opacity .3s;
                border-bottom-left-radius: 6px;
                border-bottom-right-radius: 6px;
            }
        }
        .operate-area {
            position: absolute;
            opacity: 0;
            background: #000000;
            height: 40px;
            line-height: 40px;
            bottom: 9px;
            left: 98px;
            width: 78px;
            padding: 0 10px;
            box-sizing: border-box;
            color: #fff;
            font-size: 14px;
            span {
                cursor: pointer;
            }
        }
            
        }
        .btn-box{
            margin-left:115px;
            margin-right:10px;
            display:flex;
            flex-direction:column;
            justify-content:space-around;
            align-items:center;
        }
    }
</style>