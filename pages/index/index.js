wx.cloud.init({
  env:'cloud1-4gzp9btcfd782c73'
})
const db = wx.cloud.database();
const mendates = db.collection('mendates');
const _ = db.command;
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
    day:'', //记录day
    animationData:'',
    startclientY:'',
    isHidden: true,//底部遮罩
    ifStop: true, //阻止多次同方向滑动，多次动画效果
    province: '',
    city: '',
    district: '',
    todayWeather: '',
    todayIcon: '',
    userOpenId: '',
    dbInqueryRes: '',
    dbInqueryResArr: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserOpenId();
    this.dbInquery();
    this.initQQMap();
    this.getLocationWeather();
    let nowDate = new Date()
    this.setData({
      today: nowDate.getDate(),
      thisYear: nowDate.getFullYear(),
      thisMonth:  nowDate.getMonth() + 1 
    })
    this.initCalendar(nowDate)//加载日历
  },

// 天气
  getLocationWeather: function(){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        latitude = res.latitude;
        longitude = res.longitude;
        console.log('纬度' + latitude)
        console.log('经度' + longitude)
        var key = 'd3a8393e7d4241f29750a1b1735ed000';
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
               todayIcon: '../../icons/weather/' + todayWeather.icon + '.svg'
             });
           }
       })
      }
     })
  },
  // init QQmap
  initQQMap:function(){
    var that = this;
    qqmapsdk = new QQMapWX({
      key: '44JBZ-D2TRD-TQH4B-PRHD7-3NCGV-XLFI2'
    });
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
  },
  // 获取 openid 
  getUserOpenId: function () {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
      }
    })
    wx.login({
      //成功放回
      success: function(res) {
        that.setData({
          userOpenId: res.code
        })
      }
    })
  },
  // db插入/更新
  dbAddOrUpdate: function(e) {
    var userOpenId = e.currentTarget.dataset['userOpenId'];
    var menDate = {
      _id: e.currentTarget.dataset['year']+''+e.currentTarget.dataset['month']+e.currentTarget.dataset['date'],
      year: e.currentTarget.dataset['year'],
      month: e.currentTarget.dataset['month'],
      date: e.currentTarget.dataset['date']
    }
    mendates.where({
      _openid: userOpenId,
    }).get({
      success: function(res) {
        //console.log("res :" + res.data[0]._openid)
        console.log("res :" + res.data)
        console.log("res :" + res.data.length)
        if(res.data.length > 0) {
          var dateArr = res.data[0].tags;
          console.log("dbUpdate")
          console.log(dateArr)
          mendates.doc(res.data[0]._id).update({
            // data 传入需要局部更新的数据
            data: {
              // 只允许修改日
              dateArr: _.push(menDate)
            },
            success: function(res) {
              console.log(res.data)
            }
          })
        } else{
          console.log("dbAdd")
          mendates.add({
            // data 字段表示需新增的 JSON 数据
            data: {
              // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
              _openid: userOpenId,
              dateArr: [menDate],
            },
            success: function(res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              console.log(res)
            }
          })
        }
      }
    })
  },
  // db 查询
  dbInquery: function (userOpenId) {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
      }
    })
    wx.login({
      //成功放回
      success: function(res) {
        mendates.where({
          _openid: res.code
        })
        .get({
          success: function(res) {
            var resultArr = new Array();
            console.log(res.data)
            // res.data 是包含以上定义的两条记录的数组
            for (var i=0;i<res.data.length;i++){
              resultArr.push(res.data[i].year + "-" + res.data[i].month + "-" + res.data[i].date);
            }
            that.setData({
              dbInqueryRes: res.data,
              dbInqueryResArr: resultArr
            })
          }
        })
      }
    })
},
  //初始化日历
  initCalendar: function (paramDate) {
    //星期
    var days = ["日", "一", "二", "三", "四", "五", "六"]
    //日历数据的生成
    var calendars = Calendar.getCalendar(paramDate);
    var year = paramDate.getFullYear();
    var month = paramDate.getMonth() + 1;
    var date =  {
      year,
      month
    }
    this.setData({
      date: date,
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
    var date = e.currentTarget.dataset['date'];
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