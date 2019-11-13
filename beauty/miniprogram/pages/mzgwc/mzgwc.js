// pages/mzgwc/mzgwc.js
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    num:0,
    details:[],
    checked:[],
    checkeds:false,
    pid:0,
    price:0
  },
  //点击跳转到商品列表
  click:function(){
    wx.navigateTo({
      url: '/pages/splb/splb',
    })
  },
  loadMore:function(){//加载购物车列表商品
    db.collection("mzgwc")
    .get()
    .then(res=>{
      var result=res.data;
      var num;
      if(result.length>0){
         num=1
      }else{
         num=0
      }
      //console.log(result.length)
      this.setData({
        list: result,
        num:num
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },
  sysj:function(){//从购物车请求回来的所有数据 计算价格
    db.collection("mzgwc")
      .get()
      .then(res => {
        var result = res.data;
        console.log(result)
        var price=0;
        for (var p = 0; p < result.length; p++) {
          price+= (result[p].count) * (Number(result[p].price))
        }
        console.log(price)
        this.setData({
          price: price
        })
      })
  },
  onChanges(event){
    this.setData({
      checkeds: event.detail
    });
    
    var a = []
    for(var i=0,b=[];i<this.data.list.length;i++){
      b.push(this.data.list[i]._id)
    }
    if(this.data.checkeds==true){
      this.setData({
        checked:b,
      })
      this.sysj()

    }else{
      this.setData({
        checked:a
      });
      this.setData({
        checkeds:false
      });      
      this.setData({
        price:0
      })
    } 
  },
  onChange(event){
    this.setData({
      checked: event.detail
    });
    if(this.data.checked.length==this.data.list.length){//如果选中商品数量和购物车列表数量一致则为全选
      this.setData({
        checkeds:true
      })
      this.sysj()//调用sysj函数获取价格
    } else if (this.data.checked.length==0){
      this.setData({
        price: 0
      })
    } else {
      this.setData({
        checkeds: false
      });//如果选中商品数量和购物车列表数量不一致则不能全选
      var price = 0;
      for (var i = 0, d = []; i < this.data.checked.length; i++) {
        this.data.checked[i]
        db.collection("mzgwc")
          .where({ _id: this.data.checked[i] })
          .get()
          .then(res => {
            console.log(res.data[0].count)
            console.log(Number(res.data[0].price))
            price += res.data[0].count * (res.data[0].price)
            console.log(price)
            this.setData({
              price: price
            })
          })
        }
    } 
  },
  onChangeSum(event) {//购物车加减商品数量
    console.log(event.detail);

  },
  xq: function (event) {//点击跳转商品详情
    var pid = event.currentTarget.dataset.id;
    console.log(pid)
    var url = `/pages/spxq/spxq?pid=${pid}`;
    wx.navigateTo({
      url: url,
    })
  },
  sc:function(event){//删除商品
    var id=event.target.dataset.spid;
    var list=this.data.list;
    for(var a=0;a<list.length;a++){
      if(id==list[a]._id){
       list.splice(a,1) 
      }
    }
   this.setData({
     list:list
   })
    db.collection("mzgwc")
    .doc(id)
    .remove({
      success:res=>{
        wx.showToast({
          title: '删除成功',
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMore()
    if(this.data.list.lenght>0){//当购物车有商品时
      this.setData({
        num:1
      })
    }else{
      this.setData({
        num: 0
      })
    }
    db.collection("mzsp1")//加载购物车页面促销商品
    .get()
    .then(res=>{
      this.setData({
        details:res.data
      })
    })
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
    this.loadMore()
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