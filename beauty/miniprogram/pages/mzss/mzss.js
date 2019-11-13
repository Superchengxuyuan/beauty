// pages/mzss/mzss.js
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    value:'',
    xs:1,
    count1:1,
    num:0
  }, 
  //模糊查询
  onSearch: function (event) {
    var value = event.detail;
    if (value.length == 0) {
      this.setData({
        xs: 1
      })
    } else {
      this.setData({
        xs: 0
      })
      db.collection("mzsp1")
        .where({
          pname: db.RegExp({
            regexp: value,//从搜索栏获取值进行匹配
            options: 'i',//大小写不区分
          })
        })
        .get()
        .then(res => {
          console.log(res)
          if (res.data.length == 0) {
            this.setData({
              xs: 1
            })
          } else {
            this.setData({
              list: res.data
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  xq: function (event) {//点击跳转商品详情
    var pid = event.currentTarget.dataset.id;
    console.log(pid)
    var url = `/pages/spxq/spxq?pid=${pid}`;
    wx.navigateTo({
      url: url,
    })
  },
  div_b: function (event) {//点击显示商品加入购物车
    var i = event.target.dataset.img;
    console.log(i)
    this.setData({
      index1: i,
      num: 1
    })
  },
  onChange(event) {//商品加减
    var count = event.detail;
    //console.log(count);
    this.setData({
      count1: count
    })
  },
  gb: function () {//点击关闭商品
    this.setData({
      num: 0
    })
  },
  add: function (event) {//将商品加入购物车
    var _id = event.target.dataset.id;
    var count1 = this.data.count1;
    console.log(count1)
    var pname = event.target.dataset.spmz;
    var image = event.target.dataset.ig;
    var price = event.target.dataset.jg;
    db.collection("mzgwc")
      .where({
        _id: _id
      })
      .get()
      .then(res => {
        if (res.data.length == 0) {//如果数据库没有值就加入数据
          db.collection("mzgwc")
            .add({
              data: {
                _id: _id,
                count: count1,
                image: image,
                price: price,
                pname: pname
              }
            })
            .then(res => {
              wx.showToast({
                title: '购物车添加成功',
              })
            })
            .catch(err => {
              console.log(err);
            })
        } else {//数据库有同id的数据
          console.log(res.data[0].count)
          db.collection("mzgwc")
            .doc(res.data[0]._id)
            .update({
              data: {
                count: this.data.count1 + res.data[0].count
              }
            })
            .then(res => {
              console.log(res)
              wx.showToast({
                title: '购物车添加成功',
              })
            })
            .catch(err => {
              console.log(err);
            })
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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