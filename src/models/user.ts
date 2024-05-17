import mongoose from "mongoose";
import bcrypt from "bcryptjs";


export type UserType = {
    _id: string;
    name: string;
    email: string;
    password: string;
    json: () => Object;
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Password Hash Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.json = function () {
  const plainObject = this.toObject({ transform: (doc: any, ret: any, options: any) => {
    // Customize the resulting object here
    ret.id = ret._id;
    delete ret._id; // Explicitly remove internal data
    delete ret.password; 
    delete ret.__v;
    return ret;
  }});
  return plainObject;
}

const UserModel = mongoose.model<UserType>("User", userSchema);

export { UserModel };
