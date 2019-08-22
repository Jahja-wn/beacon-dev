
(function () { 'use strict'; }());
const dataArray=[];
class LocalFile {

  async save(obj) {   //ต้องเป็น Object ที่ได้มาจากการ new Object จาก Model เท่านั้น
    return obj.save()}

  async find(findObj, model, sortOptions,limit) {
    //findObj is an obj that you want to find , create from model and sort by id order by desc
    return model.find(findObj).sort(sortOptions).limit(limit).exec()
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