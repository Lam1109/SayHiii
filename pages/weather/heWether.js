// pages/weather/heWether.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    today: '',
    todyIcon: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var key = 'd3a8393e7d4241f29750a1b1735ed000';
    var _this = this;
    var latitude = 121.54409;
    var longitude = 31.22114;
    var url = 'https://devapi.qweather.com/v7/weather/now?location=' + latitude + ',' + longitude + '&key='+key;
    console.log(url)
       wx.request({
         url: url, 
         data: {},
         method: 'GET',
         success: function (res) {
           console.log(res);
            var daily_forecast_today = res.data.now;//今天天气
            console.log(daily_forecast_today)
            _this.setData({
              today: daily_forecast_today,
              todyIcon: '../../pic/weather/' + daily_forecast_today.icon+'.png', //在和风天气中下载天气的icon图标，根据cond_code_d显示相应的图标
            });
          }
        })
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