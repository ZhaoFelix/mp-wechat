/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:58:34
 * @LastEditTime: 2021-03-18 14:05:21
 * @FilePath: /mp-wechat/src/utils/wx-request.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
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
        Authorization: "Bearer " + token,
      },
      success: function (res) {
        wx.hideLoading();
        resolve(res, data);
      },
      fail: function (res) {
        wx.hideLoading();
      },
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
