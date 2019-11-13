// pages/spxq/spxq.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid:'',
    num:0,
    n:1,
    details:[],
    count1:1
    
  },
  add:function(event){//将商品加入购物车
  var _id=event.target.dataset.id;
  var count1=this.data.count1;
  console.log(count1)
  var pname=event.target.dataset.spmz;
  var image = event.target.dataset.ig;
  var price = event.target.dataset.jg;
    db.collection("mzgwc")
    .where({
      _id:_id
    })
    .get()
    .then(res=>{
     if(res.data.length==0){//如果数据库没有值就加入数据
       db.collection("mzgwc")
       .add({
         data:{
          _id:_id,
          count:count1,
          image:image,
          price:price,
          pname:pname
         }
       })
       .then(res=>{
         wx.showToast({
           title: '购物车添加成功',
         })
       })
       .catch(err=>{
         console.log(err);
       })
     }else{//数据库有同id的数据
       console.log(res.data[0].count)
       db.collection("mzgwc")
        .doc(res.data[0]._id)
        .update({
         data:{
         count:this.data.count1+res.data[0].count
         }
       })
       .then(res=>{
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
  onChange(event) {//商品加减
    var count=event.detail;
    //console.log(count);
    this.setData({
      count1:count
    })
  },
  gb: function () {//点击关闭商品
    this.setData({
      num: 0
    })
  },
  gm:function(event){//立即购买
    this.setData({
      num:1
    })
  },
  loadMore:function(){
   var pid1=this.data.pid;
   db.collection("mzsp1")
   .where({
     pid:pid1
     })
    .get()
   .then(res=>{
     //console.log(res.data);
     this.setData({
     details:res.data[0]
     })
   })
  .catch(err => {
    console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//将参数pid保存在data中
    var pid=options.pid;
    //console.log(pid)
    this.setData({
      pid:pid
    })
    this.loadMore()
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