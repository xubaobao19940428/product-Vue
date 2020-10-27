export const paramValid = {
    /* regList */
    regName: /^[a-zA-Z\d_]{1,100}$/,
    regPassword: /^[a-zA-Z\d`~!@#$%^&*()-=_+\[\]{}\|\\;:\'\",.\/<>?]{6,100}$/,
    regAppkey: /^[0-9]{6}[a-z]{2}$/,
    regAppkeyPassword: /^([0-9a-z]{32})|(123456)$/,
    regPhone: /^(1[0-9]{10})$/,
    regNick: /^[a-zA-Z\d_\u4E00-\u9FFF\s\S]{1,100}$/,
    regFriendDisplay: /^[a-zA-Z\d_\u4E00-\u9FFF\s\S]+$/,
    regGroupNick: /^[a-zA-Z\d_\u4E00-\u9FFF\s\S]{1,50}$/,
    regGuid: /(^[1-9][0-9]*$)/,
    regGroupID: /(^[1-9][0-9]*$)/,
    regInitGuid: /^0$|^[1-9][0-9]*$/,
    regStart: /^[1-9]\d*|0$/,
    regLimit: /^[1-9]\d*$/,
    regDuration: /^([1-9]\d*){1,3}$/,
    regSilent: /^0|1$/,
    regGroupName: /^[\s\S]{1,50}$/,
    regCustomEntity: /^[\s\S]+$/,
    regReason: /^[\s\S]{1,20}$/,
    regEmojiReason: /^[\s\S]+$/,
    regRemark: /^[\s\S]{1,20}$/,
    regGroupDesc: /^[\s\S]{1,200}$/,
    regMsgType: /^0|1$/,
    regDirection: /^0|1$/,
    regFloat: /^\d+(\.\d+)?$/,
    regModified: /^0$|^[1-9][0-9]{12}$/,
    regRequireApprove: /^0|1$/,
    regBoolean: /^0|1$/,
    regRelayType: /^0|1$/,
    regFileName: /^\S+\.{1}[a-zA-Z0-9]+$/,
    // regPicFileLink: /^((http):\/\/[A-Za-z0-9\/\.]*){1}\S+_(\d+)x(\d+){1}\.{1}[a-zA-Z0-9]+$/,
    regPicFileLink: /^(\/upload){1}\S+_(\d+)x(\d+){1}\.{1}[a-zA-Z0-9]+$/,
    // regAudFileLink: /^((http):\/\/[A-Za-z0-9\/\.]*){1}\S+\.{1}[a-zA-Z0-9]+$/,
    regAudFileLink: /^(\/upload){1}\S+\.{1}[a-zA-Z0-9]+$/,
    // regVdoFileLink: /^((http):\/\/[A-Za-z0-9\/\.]*){1}\S+\.{1}[a-zA-Z0-9]+$/,
    regVdoFileLink: /^(\/upload){1}\S+\.{1}[a-zA-Z0-9]+$/,
    // regFileLink: /^((http):\/\/[A-Za-z0-9\/\.]*){1}\S+\.{1}[a-zA-Z0-9]+$/,
    regFileLink: /^(\/upload){1}\S+\.{1}[a-zA-Z0-9]+$/,
    // regText://,

    /* method */
    validUserName: function (key, value) {
        return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regName.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validPassword: function (key, value) {
        return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regPassword.test(value)) ? '' : key + '不合法;'
    },
    validAppkey: function (key, value) {
        return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regAppkey.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validAppkeyPassword: function (key, value) {
        return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regAppkeyPassword.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validPhone: function (key, value) {
        if ((typeof value === 'undefined' || value == null) || (typeof value === 'string' && value.toString().trim() == '')) {
            return ''
        } else {
            return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regPhone.test(value.toString().trim())) ? '' : key + '不合法;'
        }
    },
    validUpdatePhone: function (key, value) {
        return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regPhone.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validNick: function (key, value) {
        if (typeof value === 'undefined' || value == null || value.toString().trim() == '') {
            return ''
        } else {
            return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regNick.test(value.toString().trim())) ? '' : key + '不合法;'
        }
    },
    validGroupNick: function (key, value) {
        if (typeof value === 'undefined' || value.toString().trim() != '') {
            return ''
        } else {
            return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regGroupNick.test(value.toString().trim())) ? '' : key + '不合法;'
        }
    },
    validUpdateNick: function (key, value) {
        return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regNick.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validStart: function (key, value) {
        return (typeof value !== 'undefined' && value != null && paramValid.regStart.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validLimit: function (key, value) {
        return (typeof value !== 'undefined' && value != null && paramValid.regLimit.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validDuration: function (key, value) {
        return (typeof value !== 'undefined' && value != null && paramValid.regDuration.test(value.toString().trim()) && value.toString().trim() < 181) ? '' : key + '不合法;'
    },
    validSilent: function (key, value) {
        return (typeof value !== 'undefined' && value != null && paramValid.regSilent.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validGuid: function (key, value) {
        if (key == 'initGuid') {
            return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regInitGuid.test(value.toString().trim())) ? '' : key + '不合法;'
        } else {
            return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regGuid.test(value.toString().trim())) ? '' : key + '不合法;'
        }
    },
    validGroupID: function (key, value) {
        return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regGroupID.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validText: function (key, value) {
        return (typeof value !== 'undefined' && value != null && typeof value === 'string' && value.toString().trim().length != 0) ? '' : key + '不合法;'
    },
    validNotification: function (key, value) {
        if (typeof value === 'undefined' || value == null || value.toString().trim() == '') {
            return ''
        } else {
            return (typeof value !== 'undefined' && value != null && typeof value === 'string' && value.toString().trim().length != 0) ? '' : key + '不合法;'
        }
    },
    validFile: function (key, value) {
        if (value && value instanceof File) {
            if (key == 'file') {
                if (!/\.(bmp|gif|jpeg|jpeg2000|tiff|psd|png|svg|pcx|dxf|wmf|emf|lic|fli|flc|eps|tga|jpg|wma|mp3|wav|mid|mp1|mp2|amr|m4a|aac|rmvb|avi|rm|mpg|mpeg|mov|wmv|asf|dat|asx|wvx|mpe|mpa|mp4|3gp|apk|ipa|doc|docx|ppt|pptx|xls|xlsx|txt|plist|vcf)$/.test(value.name.toLowerCase())) {
                    return '文件类型必须是bmp,gif,jpeg,jpeg2000,tiff,psd,png,svg,pcx,dxf,wmf,emf,lic,fli,flc,eps,tga,jpg,wma,mp3,wav,mid,mp1,mp2,amr,m4a,aac,rmvb,avi,rm,mpg,mpeg,mov,wmv,asf,dat,asx,wvx,mpe,mpa,mp4,3gp,apk,ipa,doc,docx,ppt,pptx,xls,xlsx,txt,plist,vcf中的一种'
                }
                if (parseFloat(value.size) == 0 || parseFloat(value.size / (1024 * 1024)) > 10) {
                    return '大小需大于0b,最大为10MB'
                }
            }
            if (key == 'picFile') {
                if (!/\.(gif|jpg|jpeg|png|bmp)$/.test(value.name.toLowerCase())) {
                    return '图片类型必须是gif,jpg,jpeg,png,bmp中的一种'
                }
                if (parseFloat(value.size) == 0 || parseFloat(value.size / (1024 * 1024)) > 10) {
                    return '图片大小需大于0b,最大为10MB'
                }
            }
            if (key == 'audFile') {
                if (!/\.(mp3|amr)$/.test(value.name.toLowerCase())) {
                    return '语音类型必须是mp3,amr中的一种'
                }
                if (parseFloat(value.size) == 0 || parseFloat(value.size / (1024 * 1024)) > 10) {
                    return '语音大小需大于0b,最大为10MB'
                }
            }
            if (key == 'vdoFile') {
                if (!/\.(rmvb|avi|rm|mpg|mpeg|mov|wmv|asf|mp4|3gp)$/.test(value.name.toLowerCase())) {
                    return '视频类型必须是rmvb,avi,rm,mpg,mpeg,mov,wmv,asf,mp4,3gp中的一种'
                }
                if (parseFloat(value.size) == 0 || parseFloat(value.size / (1024 * 1024)) > 10) {
                    return '视频大小需大于0b,最大为10MB'
                }
            }
            if (key == 'locFile') {
                if (!/\.(jpg|jpeg|png|bmp)$/.test(value.name.toLowerCase())) {
                    return '位置图片类型必须是jpg,jpeg,png,bmp中的一种'
                }
                if (parseFloat(value.size) == 0 || parseFloat(value.size / (1024 * 1024)) > 10) {
                    return '位置图片大小需大于0b,最大为10MB'
                }
            }
            return ''
        } else {
            return key + '不合法;'
        }
    },
    validGroupName: function (key, value) {
        return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regGroupName.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validUserNameList: function (key, value, required) {
        if (required) {
            if (typeof value !== 'undefined' && value != null && value instanceof Array && value.length) {
                for (var i = 0; i < value.length; i++) {
                    if (paramValid.validUserName('key', value[i])) {
                        return key + '不合法;'
                    }
                }
            } else {
                return key + '不合法;'
            }
        } else {
            if (value) {
                if (value instanceof Array && value.length) {
                    for (var i = 0; i < value.length; i++) {
                        if (paramValid.validUserName('key', value[i])) {
                            return key + '不合法;'
                        }
                    }
                } else {
                    return key + '不合法;'
                }
            }
        }
        return ''
    },
    validGuidList: function (key, value) {
        if (typeof value !== 'undefined' && value != null && value instanceof Array && value.length) {
            for (var i = 0; i < value.length; i++) {
                if (paramValid.validGuid('guid', value[i])) {
                    return key + '不合法;'
                }
            }
        } else {
            return key + '不合法;'
        }
        return ''
    },
    validCustomKV: function (key, value) {
        return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regCustomEntity.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validCustomEntityList: function (key, value) {
        if (typeof value !== 'undefined' && value instanceof Array && value.length) {
            for (var i = 0; i < value.length; i++) {
                if (paramValid.validCustomEntity('customEntity', value[i])) {
                    return key + '不合法;'
                }
            }
        } else {
            return key + '不合法;'
        }
        return ''
    },
    validCustomEntity: function (key, customEntity) {
        if (typeof customEntity !== 'undefined' && customEntity != null && eval(customEntity).hasOwnProperty('key') && eval(customEntity).hasOwnProperty('value')) {
            if (paramValid.validCustomKV('key', customEntity.key)) {
                return key + '不合法;'
            }
            if (paramValid.validCustomKV('value', customEntity.value)) {
                return key + '不合法;'
            }
        } else {
            return key + '不合法;'
        }
        return ''
    },
    validReason: function (key, value) {
        if (typeof value === 'undefined' || value == null || value.toString().trim() == '') {
            return ''
        } else {
            return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regReason.test(value.toString().trim())) ? '' : key + '不合法;'
        }
    },
    validEmojiReason: function (key, value) {
        if (typeof value === 'undefined' || value == null || value.toString().trim() == '') {
            return ''
        } else {
            return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regEmojiReason.test(value.toString().trim()) && Array.from(value.toString().trim()).length <= 20 && Array.from(value.toString().trim()).length > 0) ? '' : key + '不合法;'
        }
    },
    validRemark: function (key, value) {
        if (typeof value === 'undefined' || value == null || value.toString().trim() == '') {
            return ''
        } else {
            return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regRemark.test(value.toString().trim())) ? '' : key + '不合法;'
        }
    },
    validFriendDisplay: function (key, value) {
        if (typeof value === 'undefined' || value == null || value.toString().trim() == '') {
            return ''
        } else {
            return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regFriendDisplay.test(value.toString().trim()) && Array.from(value.toString().trim()).length <= 100 && Array.from(value.toString().trim()).length > 0) ? '' : key + '不合法;'
        }
    },
    validAtText: function (key, value) {
        if (typeof value === 'undefined' || value == null || value.toString().trim() == '') {
            return ''
        } else {
            return (typeof value !== 'undefined' && value != null && typeof value === 'string' && value.toString().trim().length != 0) ? '' : key + '不合法;'
        }
    },
    validGroupDesc: function (key, value) {
        if (typeof value === 'undefined' || value == null || value.toString().trim() == '') {
            return ''
        } else {
            return (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regGroupDesc.test(value.toString().trim())) ? '' : key + '不合法;'
        }
    },
    validMsgType: function (key, value) {
        return (typeof value !== 'undefined' && value != null && paramValid.regMsgType.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validDirection: function (key, value) {
        return (typeof value !== 'undefined' && value != null && paramValid.regDirection.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validFloat: function (key, value) {
        return (typeof value !== 'undefined' && value != null && paramValid.regFloat.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validModified: function (key, value) {
        return (typeof value !== 'undefined' && value != null && paramValid.regModified.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validBoolean: function (key, value) {
        return ((typeof value !== 'undefined' && value != null && typeof value === 'boolean') || (typeof value !== 'undefined' && value != null && paramValid.regBoolean.test(value))) ? '' : key + '不合法;'
    },
    validRelay: function (key, value) {
        return (typeof value !== 'undefined' && value != null && paramValid.regRelayType.test(value.toString().trim())) ? '' : key + '不合法;'
    },
    validFileName: function (key, value) {
        if (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regFileName.test(value.toString().trim())) {
            if (key == 'picFileName') {
                if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|JPEG|PNG|BMP)$/.test(value.toString().trim().toLowerCase().substr(value.toString().trim().lastIndexOf('.')))) {
                    return '图片类型必须是gif,jpg,jpeg,png,bmp中的一种'
                }
            }
            if (key == 'audFileName') {
                if (!/\.(mp3|amr|MP3|AMR)$/.test(value.toString().trim().toLowerCase().substr(value.toString().trim().lastIndexOf('.')))) {
                    return '语音类型必须是mp3,amr中的一种'
                }
            }
            if (key == 'vdoFileName') {
                if (!/\.(rmvb|avi|rm|mpg|mpeg|mov|wmv|asf|mp4|3gp|RMVB|AVI|RM|MPG|MPEG|MOV|WMV|ASF|MP4|3GP)$/.test(value.toString().trim().toLowerCase().substr(value.toString().trim().lastIndexOf('.')))) {
                    return '视频类型必须是rmvb,avi,rm,mpg,mpeg,mov,wmv,asf,mp4,3gp中的一种'
                }
            }
            if (key == 'locFileName') {
                if (!/\.(jpg|jpeg|png|bmp|JPG|JPEG|PNG|BMP)$/.test(value.toString().trim().toLowerCase().substr(value.toString().trim().lastIndexOf('.')))) {
                    return '位置图片类型必须是jpg,jpeg,png,bmp中的一种'
                }
            }
            return ''
        } else {
            return key + '不合法;'
        }
    },
    validPicFileLink: function (key, value) {
        if (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regPicFileLink.test(value.toString().trim())) {
            if (key == 'bigLink' || key == 'middleLink' || key == 'smallLink' || key == 'locOriginLink') {
                if (!/\.(jpg|jpeg|png|bmp|GIF|JPG|JPEG|PNG|BMP)$/.test(value.toString().trim().toLowerCase().substr(value.toString().trim().lastIndexOf('.')))) {
                    return '图片类型必须是jpg,jpeg,png,bmp中的一种'
                }
            } else {
                if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|JPEG|PNG|BMP)$/.test(value.toString().trim().toLowerCase().substr(value.toString().trim().lastIndexOf('.')))) {
                    return '图片类型必须是gif,jpg,jpeg,png,bmp中的一种'
                }
            }
            return ''
        } else {
            return key + '不合法;'
        }
    },
    validAudFileLink: function (key, value) {
        if (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regAudFileLink.test(value.toString().trim())) {
            if (!/\.(mp3|amr|MP3|AMR)$/.test(value.toString().trim().toLowerCase().substr(value.toString().trim().lastIndexOf('.')))) {
                return '语音类型必须是mp3,amr中的一种'
            }
            return ''
        } else {
            return key + '不合法;'
        }
    },
    validVdoFileLink: function (key, value) {
        if (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regVdoFileLink.test(value.toString().trim())) {
            if (!/\.(rmvb|avi|rm|mpg|mpeg|mov|wmv|asf|mp4|3gp|RMVB|AVI|RM|MPG|MPEG|MOV|WMV|ASF|MP4|3GP)$/.test(value.toString().trim().toLowerCase().substr(value.toString().trim().lastIndexOf('.')))) {
                return '视频类型必须是rmvb,avi,rm,mpg,mpeg,mov,wmv,asf,mp4,3gp中的一种'
            }
            return ''
        } else {
            return key + '不合法;'
        }
    },
    validFileLink: function (key, value) {
        if (typeof value !== 'undefined' && value != null && typeof value === 'string' && paramValid.regFileLink.test(value.toString().trim())) {
            return ''
        } else {
            return key + '不合法;'
        }
    },
    // 去掉字符串前后端空格
    strTrim: function (str) {
        if (!str || str.length == 0) {
            return ''
        }
        str = str.toString()
        str = str.replace(/^(\s|\u00A0)+/, '')
        for (var i = str.length - 1; i >= 0; i--) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1)
                break
            }
        }
        return str
    }
}
