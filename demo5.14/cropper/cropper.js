var tup=require('../utils/tecentUp.js')
//获取应用实例
const app = getApp()
Page({
    data: {
        src: '',
        width: 250, //宽度
        height: 250, //高度
        max_width: 300,
        max_height: 300,
        disable_rotate: true, //是否禁用旋转
        disable_ratio: true, //锁定比例
        limit_move: true, //是否限制移动
    },
    onLoad: function (options) {
            this.cropper = this.selectComponent("#image-cropper");
            this.setData({
                src: options.imgSrc
            });
            if(!options.imgSrc){
                this.cropper.upload(); //上传图片
            }
        },
        cropperload(e) {
            console.log('cropper加载完成');
        },
        loadimage(e) {
            wx.hideLoading();
            //console.log('图片');
            this.cropper.imgReset();
        },
        clickcut(e) {
            console.log(e.detail);
            //图片预览
            wx.previewImage({
                current: e.detail.url, // 当前显示图片的http链接
                urls: [e.detail.url] // 需要预览的图片http链接列表
            })
        },
        upload() {
            let that = this;
            
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success(res) {
                    wx.showLoading({
                        title: '加载中',
                    })
                    const tempFilePaths = res.tempFilePaths[0];
                    //重置图片角度、缩放、位置
                    that.cropper.imgReset();
                    that.setData({
                        src: tempFilePaths
                    })    
                }
            })
        },
        setWidth(e) {
            this.setData({
                width: e.detail.value < 10 ? 10 : e.detail.value
            });
            this.setData({
                cut_left: this.cropper.data.cut_left
            });
        },
        setHeight(e) {
            this.setData({
                height: e.detail.value < 10 ? 10 : e.detail.value
            });
            this.setData({
                cut_top: this.cropper.data.cut_top
            });
        },
        switchChangeDisableRatio(e) {
            //设置宽度之后使剪裁框居中
            this.setData({
                disable_ratio: e.detail.value
            });
        },
        setCutTop(e) {
            this.setData({
                cut_top: e.detail.value
            });
            this.setData({
                cut_top: this.cropper.data.cut_top
            });
        },
        setCutLeft(e) {
            this.setData({
                cut_left: e.detail.value
            });
            this.setData({
                cut_left: this.cropper.data.cut_left
            });
        },
        switchChangeDisableRotate(e) {
            //开启旋转的同时不限制移动
            if (!e.detail.value) {
                this.setData({
                    limit_move: false,
                    disable_rotate: e.detail.value
                });
            } else {
                this.setData({
                    disable_rotate: e.detail.value
                });
            }
        },
        switchChangeLimitMove(e) {
            //限制移动的同时锁定旋转
            if (e.detail.value) {
                this.setData({
                    disable_rotate: true
                });
            }
            this.cropper.setLimitMove(e.detail.value);
        },
        switchChangeDisableWidth(e) {
            this.setData({
                disable_width: e.detail.value
            });
        },
        switchChangeDisableHeight(e) {
            this.setData({
                disable_height: e.detail.value
            });
        },
        submit() {
            this.cropper.getImg((obj) => {
                app.globalData.imgSrc = obj.url;
                let that=this;
                let tmpFilePaths=obj.url;
                var tmpsize=128;
                wx.getFileInfo({
                    filePath: tmpFilePaths,
                    success(res) {
                        console.log("压缩前图片大小:", res.size / 1024, 'kb'); 
                        tmpsize=res.size/1024;
                        //console.log(tmpsize);
                        getLessLimitSizeImage('attendCanvasId', tmpFilePaths, 512, that.data.max_width, function(img){    
                            app.globalData.imgSrc=img;
                            let imgMd5;
                            //console.log("压缩后图片："+img);
                            that.setData({
                                src:img
                            })
                            wx.getFileInfo({
                                filePath:img,
                                success:function(res){
                                    // console.log('压缩后：'+res.size/1024+'kb')
                                    // console.log(res);
                                    // console.log("digest:"+res.digest)
                                    imgMd5=res.digest;
                                    tup.startUploadFile('image',res,img,function(info1,info2){
                                        // console.log("1:"+info1);
                                        // console.log("2:"+info2.Location);
                                        // console.log("MD5:"+imgMd5)
                                        wx.request({
                                            url:'https://service-f69sbzdx-1303022844.cd.apigw.tencentcs.com/release/UploadGoods',
                                            data:{
                                                'OwnerName':'老王',
                                                'Bigcategory': 0,
                                                'GoodsName':'商品名称',
                                                'Info':'商品信息',
                                                'picurl':'https://'+info2.Location,
                                                'md5':imgMd5,
                                                'Price':100

                                            },
                                            success:res=>{
                                                console.log(res)
                                            },
                                            fail:res =>{
                                                console.log("Fail")
                                                console.log(res)
                                            }
                                        })   
                                    }); 
                                }
                            });
                            wx.navigateBack({
                                delta: -1
                            })
                        })
                    }
                })

            })
        },
        rotate() {
            //在用户旋转的基础上旋转90°
            this.cropper.setAngle(this.cropper.data.angle += 90);
        },
        top() {
            this.data.top = setInterval(() => {
                this.cropper.setTransform({
                    y: -3
                });
            }, 1000 / 60)
        },
        bottom() {
            this.data.bottom = setInterval(() => {
                this.cropper.setTransform({
                    y: 3
                });
            }, 1000 / 60)
        },
        left() {
            this.data.left = setInterval(() => {
                this.cropper.setTransform({
                    x: -3
                });
            }, 1000 / 60)
        },
        right() {
            this.data.right = setInterval(() => {
                this.cropper.setTransform({
                    x: 3
                });
            }, 1000 / 60)
        },
        narrow() {
            this.data.narrow = setInterval(() => {
                this.cropper.setTransform({
                    scale: -0.02
                });
            }, 1000 / 60)
        },
        enlarge() {
            this.data.enlarge = setInterval(() => {
                this.cropper.setTransform({
                    scale: 0.02
                });
            }, 1000 / 60)
        },
        end(e) {
            clearInterval(this.data[e.currentTarget.dataset.type]);
        },
});
//*************** 图片压缩 ***********
// 判断图片大小是否满足需求
function imageSizeIsLessLimitSize(imagePath, limitSize, lessCallBack, moreCallBack) {
    wx.getFileInfo({
        filePath: imagePath,
        success(res) {
            //console.log("压缩前图片大小:", res.size / 1024, 'kb');
            if (res.size > 1024 * limitSize) {
                moreCallBack();
            } else {
                lessCallBack();
            }
        }
    })
  };
  /**
  * 获取画布图片 
  */
  // 利用cavas进行压缩  每次压缩都需要ctx.draw()  wx.canvasToTempFilePath()连用
  function getCanvasImage(canvasId, imagePath, imageW, imageH, getImgsuccess) {
    const ctx = wx.createCanvasContext(canvasId);
    ctx.drawImage(imagePath, 0, 0, imageW, imageH);
    ctx.draw(false, setTimeout(function() { // 一定要加定时器，因为ctx.draw()应用到canvas是有个时间的
        wx.canvasToTempFilePath({
            canvasId: canvasId,
            x: 0,
            y: 0,
            width: imageW,
            height: imageH,
            quality: 0.85,
            success: function(res) {
                getImgsuccess(res.tempFilePath);
            },
        });
    }, 200));
  };
  
  // 主调用方法
  
  /**
  * 获取小于限制大小的Image, limitSize默认为100KB，递归调用。
  */
  function getLessLimitSizeImage(canvasId, imagePath, limitSize = 100, drawWidth, callBack) {
    imageSizeIsLessLimitSize(imagePath, limitSize,
        (lessRes) => {
            callBack(imagePath);
        },
        (moreRes) => {
            wx.getImageInfo({
                src: imagePath,
                success: function(imageInfo) {
                    var maxSide = Math.max(imageInfo.width, imageInfo.height);
                    //画板的宽高默认是windowWidth
                    var windowW = drawWidth;
                    var scale = 1;
                    if (maxSide > windowW) {
                        scale = windowW / maxSide;
                    }
                    var imageW = Math.trunc(imageInfo.width * scale);
                    //imageW=imageW>200?imageW:200;
                    var imageH = Math.trunc(imageInfo.height * scale);
                    //imageH=imageH>200?imageH:200;
                    //console.log('调用压缩', imageW, imageH);
                    getCanvasImage(canvasId, imagePath, imageW, imageH,
                        (pressImgPath) => {
                            getLessLimitSizeImage(canvasId, pressImgPath, limitSize, drawWidth * 0.95, callBack);
                        }
                    );
                }
            })
        }
    )
  };
  // 图片转basee64    io操作 使用异步方式
  function getBase64(img) {
    return new Promise(function(resolve, reject) {
        const FSM = wx.getFileSystemManager();
        FSM.readFile({
            filePath: img,
            encoding: 'base64',
            success(data) {
                resolve(data)
            }
        })
    })
  }
  
