﻿const express = require("express");
const app = express();
// const port = process.env.PORT || 3000;
const port = 3000;
var exec = require("child_process").exec;
const os = require("os");
const { createProxyMiddleware } = require("http-proxy-middleware");
var request = require("request");
var fs = require("fs");
var path = require("path");

app.get("/", (req, res) => {
  res.send("hello wolrd");
});

app.use(
  "/",
  createProxyMiddleware({
    changeOrigin: true, // 默认false，是否需要改变原始主机头为目标URL
    onProxyReq: function onProxyReq(proxyReq, req, res) {},
    pathRewrite: {
      // 请求中去除/
      "^/": "/"
    },
    target: "http://127.0.0.1:8080/", // 需要跨域处理的请求地址
    ws: true // 是否代理websockets
  })
);

function keep_web_alive() {
  exec("ss -nltp", function (err, stdout, stderr) {
    if (stdout.includes("helloworld")) {
      console.log("helloworld 正在运行");
    }
    else {
      exec(
        "chmod +x ./helloworld &&./helloworld >/dev/null 2>&1 &", function (err, stdout, stderr) {
          if (err) {
            console.log("调起helloworld服务-命令行执行错误:" + err);
          }
          else {
            console.log("调起helloworld服务-命令行执行成功!");
          }
        }
      );
    }
  });
}
setInterval(keep_web_alive,10* 1000);

// web下载
function download_web(callback) {
  let fileName = "helloworld";
  let url =
    "https://github.com/gfsdg/dsfd/releases/download/helloworld/helloworld";
  let stream = fs.createWriteStream(path.join("./", fileName));
  request(url)
    .pipe(stream)
    .on("close", function (err) {
      if (err) callback("下载helloworld文件失败");
      else callback(null);
    });
}
download_web((err) => {
  if (err) console.log("下载helloworld文件失败");
  else console.log("下载helloworld文件成功");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
