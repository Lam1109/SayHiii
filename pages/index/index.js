var Calendar = require("../../service/Calendar.js");
var QQMapWX = require("../../libs/qqmap-wx-jssdk.min.js")
var qqmapsdk;
var latitude, longitude;
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    animationData:'',
    startclientY:'',
    isHidden: true,//底部遮罩
    ifStop: true, //阻止多次同方向滑动，多次动画效果
    province: '',
    city: '',
    district: '',
    todayWeather: '',
    todayIcon: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: '44JBZ-D2TRD-TQH4B-PRHD7-3NCGV-XLFI2'
    });
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        latitude = res.latitude;
        longitude = res.longitude;
        console.log('纬度' + latitude)
        console.log('经度' + longitude)
      }
     })
    let nowDate = new Date()
    this.initCalendar(nowDate)//加载日历
  },
  /**
   * 初始化日历
   * */
  initCalendar: function (paramDate) {
    //星期
    var days = ["日", "一", "二", "三", "四", "五", "六"]
    //日历数据的生成
    var calendars = Calendar.getCalendar(paramDate);
    this.setData({
      year: paramDate.getFullYear(),
      month: paramDate.getMonth() + 1,
      calendars: calendars,
      days: days,
      preMonth: "<",   //大于、小于号不可以直接写在wxml中
      nextMonth: ">"
    });
  },
  //上个月
  preMonth: function () {
    var dataYear = this.data.year;
    var dataMonth = this.data.month - 2;//月是从0开始的
    var paramDate = Calendar.parseDate(dataYear, dataMonth);
    this.initCalendar(paramDate);
  },
  //下个月
  nextMonth: function () {
    var dataYear = this.data.year;
    var dataMonth = this.data.month;
    var paramDate = Calendar.parseDate(dataYear, dataMonth);
    this.initCalendar(paramDate);
  },
  // 点击日期弹出划出层
  clickFun: function (e) {
    var key = 'd3a8393e7d4241f29750a1b1735ed000';
    var that = this;
    var date = e.currentTarget.dataset['date'];
    qqmapsdk.reverseGeocoder({
      success: function(res) {
        console.log(res);
        that.setData({
          province: res.result.address_component.province,
          city: res.result.address_component.city,
          district: res.result.address_component.district  
        })
      }
     })
     var url = 'https://devapi.qweather.com/v7/weather/now?location=' + longitude + ',' + latitude  + '&key='+key;
     console.log(url)
      wx.request({
        url: url, 
        data: {},
        method: 'GET',
        success: function (res) {
          console.log(res);
          var todayWeather = res.data.now;//今天天气
          console.log(todayWeather)
          that.setData({
            todayWeather: todayWeather,
            todayIcon: '../../icons/' + todayWeather.icon + '.svg'
          });
        }
    })
    this.setData({
      day: date
    })
    //console.log(this.data.ifStop,'显示');
    if(!this.data.ifStop || date == "" ){
      return;
    }
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: "linear",
      delay: 0
    })
    animation.translateY(600).step()
    this.setData({
      animationData: animation.export(),
      ifStop: false
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        isHidden: false
      })
    }.bind(this), 500)
  },
  // bindtouchstart
  startFun: function(e){
    console.log(e,'start')
    this.setData({
      startclientY:e.touches[0].clientY   //起始点的clientY
    })
  },
  // 下滑取消弹出层
  showFun: function (e) {
    if (e.touches[0].clientY > this.data.startclientY){
      //console.log(this.data.ifStop,'隐藏')
      if(this.data.ifStop){
        return;
      }
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: "linear",
        delay: 0
      })
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        ifStop: true
      })
      setTimeout(function () {
        animation.translateY(600).step()
        this.setData({
          animationData: animation.export(),
          isHidden: true
        })
      }.bind(this), 500)
    }
  },
  // bindtouchend
  hideFun: function (e) {
    console.log(e,'end')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})