var COS=require('cos-wx-sdk-v5.js')
function  startUploadFile(mediaType, fileName,filePath, callback) {
      wx.showLoading({
        title: '上传中...',
      })
      var Bucket = '7ixia-1305778170';
      var Region = 'ap-beijing'
      console.log(Bucket, Region);
      var that = this;
      var cos = new COS({
        getAuthorization:function(options,callback){
          wx.request({
            url: 'https://service-f69sbzdx-1303022844.cd.apigw.tencentcs.com/release/helloworld-1620014951', // 步骤二提供的签名接口
            data: {
                Method: 'GET',
                Key: options.Key
            },
            dataType: 'text',
            success: function (result) {
                var data = JSON.parse(JSON.parse(result.data));
                callback({
                    TmpSecretId: data.credentials && data.credentials.tmpSecretId,
                    TmpSecretKey: data.credentials && data.credentials.tmpSecretKey,
                    XCosSecurityToken: data.credentials && data.credentials.sessionToken,
                    StartTime: data.startTime,
                    ExpiredTime: data.expiredTime,
                });
            }
          });
        }
      })
  //     var cos = new COS({
  //       getAuthorization: function (options, callback) {
  //         // 调试方式
  //         var authorization = COS.getAuthorization({
  //             Method: options.Method,
  //             Key: options.Key
  //           });
  //           callback(authorization);
  //       }
  //     });
      // 生成上传文件名
      var Key = fileName.digest+fileName.size+'.png'; // 这里指定上传的文件名       
      var dateObj = new Date();       
      var timestamp = dateObj.getTime();       
      var nowDate = dateObj.toLocaleDateString();       
      var formatDate = nowDate.replace(/\//g,"-");  // 格式斜杠日期       
      console.log(formatDate);       
      var filename = formatDate + '/' + timestamp+Key; 
      // 上传方法
      cos.postObject({
        Bucket: Bucket,
        Region: Region,
        Key: filename,
        FilePath: filePath,
        onProgress: function (info) {
          console.log(JSON.stringify(info));
        }
      }, function (err, data) {
        wx.hideLoading();
        console.log("err:"+err);
        if (err) {
          callback(false,err); // 上传失败的callback
        }
        if (data) {
          console.log(data)
          callback(true, data); // 上传成功的callback
        }
      });
    }
module.exports={
  startUploadFile
}