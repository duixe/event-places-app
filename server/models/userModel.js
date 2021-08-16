const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, 'first  name is required'],
    },
    last_name: {
      type: String,
      required: [true, 'first name is required'],
    },
    email: {
      type: String,
      required: [true, 'email of a user is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'sorry, the email format is not valid'],
    },
    email_confirmed: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'mcs', 'admin'],
      default: 'user',
    },
    photo: String,
    password: {
      type: String,
      required: [true, 'please provide a password'],
      minlength: 8,
      select: false,
    },
    confirm_password: {
      type: String,
      required: [true, 'please provide a password'],
      minlength: 8,
      validate: {
        // This validator object is only active when applying the .save or .create method
        // on this model
        validator: function (confirmPass) {
          return confirmPass === this.password;
        },
        message: 'passwords do not match',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.email_confirmed;
  return userObject;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirm_password = undefined;
  next();
});

userSchema.methods.PasswordchangedAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTimestamp < changedTimestamp;
    console.log(jwtTimestamp);
  }
  return false;
};

userSchema.methods.checkPassword = async function (
  currentClientPassword,
  userPassword
) {
  return await bcrypt.compare(currentClientPassword, userPassword);
};

userSchema.methods.makePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
