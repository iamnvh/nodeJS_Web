const mutipleMongooseToObject = (datas) => {
    return datas.map((data) => {
      return data.toObject();
    })
  };
  
  const mongooseToObject = (data) => {
    return data ? data.toObject() : data;
  };
  
  module.exports = {
    mutipleMongooseToObject: mutipleMongooseToObject,
    mongooseToObject: mongooseToObject
  };