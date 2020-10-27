<template>
    <el-dialog
        title="设置热区"
        width="600px"
        :visible="dialogVisible"
        :close-on-click-modal="false"
        @close="handleClose"
        class="img-hot-dialog"
    >
        <div class="img-hot-box">
            <img :src="dealShowFileSrc(imgUrl)" class="ad-img-tag"/>
            <ul>
                <li
                    v-for="(item, index) in tempLinkList"
                    :key="index"
                    @mousedown.stop="(e) => dragEagle(e, index)"
                    :style="getStyle(item)"
                    :class="['drag-item' + index]">
                    <i class="el-icon-error icon" @click="handleDel(index)" v-show="curIndex === index"></i>
                    <div class="right cn-position"
                        v-show="curIndex === index"
                        :style="{'cursor': tempLinkList[index].cursor}"
                        @mouseover="tempLinkList[index].cursor='crosshair'"
                        @mouseout="tempLinkList[index].cursor='move'"
                    ></div>
                    <div class="bottom cn-position"
                        v-show="curIndex === index"
                        :style="{'cursor': tempLinkList[index].cursor}"
                        @mouseover="tempLinkList[index].cursor='crosshair'"
                        @mouseout="tempLinkList[index].cursor='move'"
                    ></div>
                    <div class="right-bottom cn-position"
                        v-show="curIndex === index"
                        :style="{'cursor': tempLinkList[index].cursor}"
                        @mouseover="tempLinkList[index].cursor='crosshair'"
                        @mouseout="tempLinkList[index].cursor='move'"
                    ></div>
                </li>
            </ul>
        </div>
        <ul class="url-box">
            <li v-for="(item, index) in tempLinkList"
                :key="index"
                v-show="curIndex === index"
            >
                <el-radio-group v-model="item.linkType">
                    <el-radio label="link">
                        跳转链接 <el-input v-model="item.url" style="width: 60%" size="medium"/>
                    </el-radio>
                    <el-radio label="detail">
                        商品详情页 <el-input v-model="item.detailId" style="width: 60%" size="medium" placeholder="输入1个商品ID"/>
                    </el-radio>
                    <el-radio label="share">
                        唤起分享 <span class="tip">分享本页面</span>
                    </el-radio>
                </el-radio-group>
                <p>备注说明 <el-input v-model="item.desc" style="width: 60%" size="medium"/></p>
            </li>
        </ul>

        <span slot="footer" class="dialog-footer">
            <el-button @click="handleAdd" type="primary">添加热区</el-button>
            <el-button @click="handleConfirm">保存</el-button>
        </span>
    </el-dialog>
</template>

<script>
// import Vue from 'vue';

export default {
    props: {
        imgUrl: String,
        pos: Number,
        linkList: {
            type: Array,
            default: []
        },
        dialogVisible: Boolean
    },
    data () {
        return {
            tempLinkList: [],
            pressed: false,
            pressData: [],
            curIndex: 0,
            imgHeight: 0,
            imgWidth: 0
        }
    },
    methods: {
        reset () {
            this.tempLinkList = []
        },
        handleClose () {
            this.reset()
            this.$emit('cancel')
        },
        move () {
            if (!this.pressed) return

            this.pressData.push()
        },
        getStyle (urlItem) {
            return {
                top: urlItem.top * this.imgHeight + 'px',
                left: urlItem.left * this.imgWidth + 'px',
                width: urlItem.width * this.imgWidth + 'px',
                height: urlItem.height * this.imgHeight + 'px'
            }
        },
        handleAdd () {
            this.tempLinkList.push({
                url: '',
                cursor: 'move',
                desc: '',
                linkType: 'link',
                detailId: ''
            })
        },
        dragEagle (e, index) {
            let $el = this.$el.querySelector('.drag-item' + index)
            this.curIndex = index
            let offWidth = $el.offsetWidth
            let offHeight = $el.offsetHeight
            let cursorStyle = this.tempLinkList[index].cursor // 获取鼠标样式

            let startX = e.clientX
            let startY = e.clientY

            let left = startX - $el.offsetLeft
            let top = startY - $el.offsetTop

            document.onmousemove = (ev) => {
                ev.preventDefault()

                // 得到鼠标拖动的宽高距离，取绝对值
                let distX = Math.abs(ev.clientX - startX)
                let distY = Math.abs(ev.clientY - startY)
                if (cursorStyle === 'crosshair') {
                    if (ev.clientX > startX) {
                        $el.style.width = offWidth + distX + 'px'
                    }
                    if (ev.clientY > startY) {
                        $el.style.height = offHeight + distY + 'px'
                    }

                    if (ev.clientX < startX) {
                        $el.style.width =  (offWidth - distX) + 'px'
                    }

                    if (ev.clientY < startY) {
                        $el.style.height = (offHeight - distY) + 'px'
                    }
                } else {
                    $el.style.left = (ev.clientX - left) + 'px'
                    $el.style.top = (ev.clientY - top) + 'px'
                }
            }
        },
        handleDelMove () {
            document.onmousemove = null
        },
        handleDel (index) {
            this.tempLinkList.splice(index, 1)
            this.curIndex--
        },
        handleConfirm () {
            let temp = [ ...this.tempLinkList ]
            let existShare = false
            temp = temp.map((item, index) => {
                let $el = this.$el.querySelector('.drag-item' + index)
                let style = $el.style
                // 取百分比的left和right值widht height则是排除框选区域的边框部分。
                item.left = (style.left.replace('px', '') || 0) / this.imgWidth
                item.top = (style.top.replace('px', '') || 0) / this.imgHeight
                item.width = (style.width.replace('px', '') || 88) / this.imgWidth
                item.height = (style.height.replace('px', '') || 58) / this.imgHeight
                if (item.detailId == 'detail') {
                    item.detailId = item.detailId.trim()
                }

                if (item.linkType === 'share') {
                    existShare = true
                }

                return item
            })

            this.$emit('saveUrl', {linkList: temp, pos: this.pos, existShare})
            this.reset()
        }
    },
    created () {
        if (!this.linkList.length) {
            this.tempLinkList.push({
                url: '',
                cursor: 'move',
                desc: '',
                linkType: 'link',
                detailId: ''
            })
        } else {
            this.tempLinkList = [].concat(this.linkList)
        }
    },
    mounted () {
        document.documentElement.addEventListener('mouseup', this.handleDelMove)
        this.$nextTick(() => {
            let imgEl = this.$el.querySelector('.ad-img-tag')
            imgEl.onload = () => {
                this.imgHeight = imgEl.offsetHeight
                this.imgWidth = imgEl.offsetWidth
            }
        })
    },
    beforeDestroy () {
        document.onmouseup = null
        document.onmousemove = null
    }
}
</script>

<style lang="scss">
    .img-hot-dialog {
        .url-box {
            text-align: left;
            margin-left: 24px;
            p {
                margin: 4px 0;
            }
            .tip {
                margin-left: 8px;
                color: #999;
            }
        }
        .el-radio {
            width: 100%;
            margin-top: 10px;
        }
        .img-hot-box {
            background-color: #f1f2f3;
            width: 375px;
            height: 200px;
            overflow: auto;
            position: relative;
            margin: 0 auto;
            &.active {
                border-color: #409eff;
            }
            img {
                width: 100%;
            }
            ul {
                position: absolute;
                top: 0;
                right: 0;
                left: 0;
                bottom: 0;
                li {
                    border: 1px solid #606262;
                    background: rgba(179, 216, 255, .4);
                    position: absolute;
                    top: 4px;
                    left: 2px;
                    width: 90px;
                    height: 60px;
                    cursor: move;
                    .icon {
                        position: absolute;
                        right: -6px;
                        top: -6px;
                        cursor: pointer;
                    }
                    .cn-position {
                        position: absolute;
                        height: 7px;
                        width: 7px;
                        border: 1px solid #333;
                        border-radius: 50%;
                        background-color: #f1f2f3;
                    }
                    .right {
                        top: 45%;
                        right: -6px;
                    }
                    .bottom {
                        bottom: -6px;
                        left: 45%;
                    }
                    .right-bottom {
                        bottom: -6px;
                        right: -6px;
                    }
                }
            }
        }
    }
</style>
