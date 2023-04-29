import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, "Type is required"],
        unique: false
    },
    image: {
        type: String,
        required: false,
        unique: false
    },
    username: {
        type: String,
        required: [true, "Type is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Type is required"],
        unique: false,
        select: false
    },
    status: {
        type: Boolean,
        required: false,
        unique: false
    },
    extra: {
        type: Object,
        required: false,
        unique: false
    }
});

export default mongoose.model.Users || mongoose.model("User", UserSchema);