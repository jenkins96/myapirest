const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let adminSchema = new Schema({

  user: {
    type: String,
    required: [true, "The user is mandatory"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "The password is mandatory"]
  }
});

adminSchema.methods.toJSON = function(){
  let admin = this;
  let adminObj = admin.toObject();
  delete adminObj.password;

  return adminObj;
}

module.exports = mongoose.model("admins", adminSchema);