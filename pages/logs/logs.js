Page({
  data: {
    animationData:'',
    startclientY:'',
    isShow: true,//底部遮罩
    ifStop: true //阻止多次同方向滑动，多次动画效果
  },
  onLoad: function () {

  },
  clickFun: function () {
    console.log('内容1')
  },
  // bindtouchstart
  startFun: function(e){
    console.log(e,'start')
    this.setData({
      startclientY:e.touches[0].clientY   //起始点的clientY
    })
  },
  // bindtouchmove
  showFun: function (e) {
    if (e.touches[0].clientY > this.data.startclientY){
      console.log(this.data.ifStop,'隐藏')
      if(this.data.ifStop){
        return;
      }
      console.log('move')
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
          isShow: true
        })
      }.bind(this), 500)
    }else{
      console.log(this.data.ifStop,'显示')
      if(!this.data.ifStop){
        return;
      }
      console.log('move')
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 500,
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
          isShow: false
        })
      }.bind(this), 500)
    }

  },
  // bindtouchend
  hideFun: function (e) {
    console.log(e,'end')
  },
})