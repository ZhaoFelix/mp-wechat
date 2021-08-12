/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:58:34
 * @LastEditTime: 2021-07-05 10:10:27
 * @FilePath: /mp-wechat/src/utils/wx-request.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */

// 微信请求封装
import {
  requestUrl,
  authKey,
  authSecret,
  authExpire,
} from "../../config/options";
const host =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3000/v1.0"
    : requestUrl;
// jwt签名认证
const jwt = require("jsonwebtoken");
let token = jwt.sign({ secret: authSecret }, authKey, {
  expiresIn: authExpire,
});
function request(url, method, data, header = {}) {
  wx.showLoading({
    title: "加载中",
  });
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url,
      method: method,
      data: data,
      header: {
        "content-type": "application/json",
        // 将生成的token放入请求头中
        Authorization: "Bearer " + token,
      },
      // 请求成功调用
      success: function (res) {
        wx.hideLoading();
        resolve(res, data);
      },
      // 请求失败调用
      fail: function (res) {
        wx.hideLoading();
      },
      // 请求完成调用
      complete: function () {
        wx.hideLoading();
      },
    });
  });
}

function get(obj) {
  return request(obj.url, "GET", obj.data);
}

function post(obj) {
  return request(obj.url, "POST", obj.data);
}

export default {
  request,
  get,
  post,
  host,
};
