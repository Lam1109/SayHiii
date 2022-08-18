// pages/db/db.js
const { dbInquery } = require("../../utils/dbUtils.js");
var dbUtils = require("../../utils/dbUtils.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    var openId;
    wx.getUserInfo({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        //console.log(res)
      }
    })
    wx.login({
      //成功放回
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
       //console.log(res)
        that.setData({
          openId: res.code
        })
      }
    })
    dbUtils.dbAddOrUpdate(openId, "2022", "1", "11", "晴")
    //dbUtils.dbInquery(openId)
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})