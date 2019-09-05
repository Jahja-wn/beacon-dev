
(function () { 'use strict'; }());
import { activities } from '../model';
const moment = require('moment')
const today = moment().startOf('day')

class LocalFile {

  async save(obj) {   //ต้องเป็น Object ที่ได้มาจากการ new Object จาก Model เท่านั้น
    return obj.save()
  }

  async find(findObj, model, sortOptions, limit) {

    //findObj is an obj that you want to find , create from model and sort by id order by desc
    // if (model === activities) {
    //   return model.find({
    //     findObj,
    //      createdAt: {
    //       $gte: today.toDate(),
    //       $lte: moment(today).endOf('day').toDate()
    //     }
    //   }).sort(sortOptions).limit(limit).exec()
    // }
    return model.find(findObj).sort(sortOptions).limit(limit).exec()
  }

  async update(model, findobj, replace, sortOption) {
    return model.findOneAndUpdate(findobj, replace, sortOption)
  }
}

export { LocalFile }
