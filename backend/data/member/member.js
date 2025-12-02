let mongoose = require("mongoose");
let Schema = mongoose.Schema;

// create a schema
const MemberSchema = new mongoose.Schema({
  taxNumber: { type: Number, required: true },
  cash: Number,
  paymentRegular: Boolean,
  photo: String,
  dataCreated: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // <- isto é crucial
});

// the schema is useless so far
// we need to create a model using it
let Member = mongoose.model("Member", MemberSchema);

// make this available to our users in our Node applications
module.exports = Member;
