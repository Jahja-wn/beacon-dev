
(function () { 'use strict'; }());

class LocalFile {

  save(obj) {   //ต้องเป็น Object ที่ได้มาจากการ new Object จาก Model เท่านั้น
    obj.save(function (err) {
      if (err) return console.error(err);
      console.log(" saved to collection.");
    });
  }

  find(findObj, model, sortOptions,limit) {
    console.log(findObj)
    //findObj is an obj that you want to find , create from model and sort by id order by desc
    model.find(findObj).sort(sortOptions).limit(limit).exec((err, docs) => {
      if (err) {
        console.log('err:',err)
      }
      else {
        console.log("userInfo",docs)
      }
    })
  }

  update(model,findobj,replace,sortOption){
    model.findOneAndUpdate(findobj,replace).sort(sortOption).exec((err, docs) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(docs)
      }
    })
  }
}

export { LocalFile }