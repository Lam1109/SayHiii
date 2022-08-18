wx.cloud.init({
  env:'cloud1-4gzp9btcfd782c73'
})
const db = wx.cloud.database();
const mendates = db.collection('mendates');

function dbAddOrUpdate(userOpenId, year, month, date, weather) {
    mendates.where({
    _openid: userOpenId,
    year: year,
    month: month
  }).get({
    success: function(res) {
      console.log("res :" + res.data[0]._openid)
      if(res.data.length > 0) {
        dbUpdate(userOpenId,  year, month, date);
        return  "updateFlag";
      } else{
        dbAdd(userOpenId, year, month, date, weather);
        return "addFlag"
      }
    }
  })
  
}
function dbAdd (userOpenId, year, month, date, weather) {
  console.log("dbAdd")
  // 这个月是否已经有记录
  mendates.add({
    // data 字段表示需新增的 JSON 数据
    data: {
      // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
      _openid: userOpenId,
      year: year,
      month: month,
      date: date,
      weather: weather
    },
    success: function(res) {
      // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      console.log(res)
    }
  })
}

function dbInquery(userOpenId) {
    mendates.where({
    _openid: userOpenId,
  })
  .get({
    success: function(res) {
      // res.data 是包含以上定义的两条记录的数组
      console.log(res.data)
      return res.data;
    }
  })
}


function dbUpdate(userOpenId,  year, month, dateUpdate) {
  mendates.where({
    _openid: userOpenId,
    year: year,
    month: month
  }).get({
    success: function(res) {
      mendates.doc(res.data[0]._id).update({
        // data 传入需要局部更新的数据
        data: {
          // 只允许修改日
          date: dateUpdate
        },
        success: function(res) {
          console.log(res.data)
        }
      })
    }
  })

}

function dbDelete(userOpenId) {
  var res = dbInqueryByMonth(userOpenId, year, month);
  mendates.doc(id).remove({
    success: function(res) {
      console.log(res.data)
    }
  })
}

// 根据openid和日期查
function dbInqueryByDate(userOpenId, year, month, date) {
  mendates.where({
  _openid: userOpenId,
  year: year,
  month: month,
  date: date
})
.get({
  success: function(res) {
    // res.data 是包含以上定义的两条记录的数组
    console.log(res.data)
    // TODO 返回id
    return res.data.id;
  }
})
}

// 根据openid和年月查
function dbInqueryByMonth(userOpenId, year, month) {
  mendates.where({
  _openid: userOpenId,
  year: year,
  month: month
}).get({
  success: function(res) {
  }
})
}

module.exports = {
  dbAddOrUpdate: dbAddOrUpdate,
  dbAdd: dbAdd,
  dbDelete: dbDelete,
  dbUpdate: dbUpdate,
  dbInquery: dbInquery,
  dbInqueryByDate: dbInqueryByDate,
  dbInqueryByMonth: dbInqueryByMonth
}