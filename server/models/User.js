// server/models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type     : String,
      required : [true, 'Name is required'],
      trim     : true
    },

    email: {
      type      : String,
      required  : [true, 'Email is required'],
      unique    : true,
      lowercase : true,
      trim      : true
    },

    password: {
      type     : String,
      required : [true, 'Password is required'],
      minlength: 6,
      select   : false  // Never return password in queries
    },

    role: {
      type    : String,
      enum    : ['admin', 'supplier', 'transporter', 'customer'],
      default : 'customer'
    },

    isActive: {
      type    : Boolean,
      default : true
    }
  },
  {
    timestamps: true  // Auto adds createdAt & updatedAt
  }
);

// ─── HASH PASSWORD BEFORE SAVING ──────────────────────
// ✅ NEW - Works with Mongoose v9
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt    = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── METHOD TO CHECK PASSWORD ─────────────────────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);