var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var queryString = require("querystring");
var crypto = require('crypto'); //MD5加密库
var app = express();
var urlParser = bodyParser.urlencoded({
    extended: false
});
app.use(express.static(__dirname));
app.listen(9999);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/client.html");
})

app.post("/login", urlParser, function (req, res) {
    var sms = req.body.NECaptchaValidate;
    var obj = {
        captchaId: "21d8a843db134a51bca2b0b5602e8d6b",
        validate: sms,
        user: "",
        secretId: "b63e482dceb39837eb76cbb53be5aac8",
        version: "v1",
        timestamp: Date.now(),
        nonce: Math.ceil(Math.random() * 100)
    }
    var sign = genSignature("aaa8af64a539ddf4e926a0d2e76a979c", obj);
    obj.signature = sign;
    console.log(obj);
    var options = {
        url: "http://c.dun.163yun.com/api/v1/verify",
        body: queryString.stringify(obj)
    }
    request.post(options,function(err, res, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('successful!Server responded with:', body);
    });
    res.sendFile(__dirname + "/client.html");
})


//获取签名信息
var genSignature = function (secretKey, paramsJson) {
    var sorter = function (paramsJson) {
        var sortedJson = {};
        var sortedKeys = Object.keys(paramsJson).sort();
        for (var i = 0; i < sortedKeys.length; i++) {
            sortedJson[sortedKeys[i]] = paramsJson[sortedKeys[i]]
        }
        return sortedJson;
    }
    var sortedParam = sorter(paramsJson);
    var needSignatureStr = "";
    for (var key in sortedParam) {
        var value = sortedParam[key];
        needSignatureStr = needSignatureStr + key + value;
    }
    needSignatureStr += secretKey;
    var md5er = crypto.createHash('md5'); //MD5加密工具
    md5er.update(needSignatureStr, "UTF-8");
    return md5er.digest('hex');
};