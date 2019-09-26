
(function () { 'use strict'; }());
class LocalFile {

  async save(obj) {   //obj must be the object derived from new object from model only
    return obj.save()
  }

  async find(filter, model, sortOption, limit) { 

    return model.find(filter).sort(sortOption).limit(limit).exec()
  }

  async update(model, condition, replace, sortOption) {
    return model.findOneAndUpdate(condition, replace, sortOption)
  }
}

export { LocalFile }
