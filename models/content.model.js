import mongoose from "mongoose";

export const ContentSchema = new mongoose.Schema({
    cname: {
        type: String,
        required: [true, "Cname is required"],
        unique: [true, "Cname must be unique"]
    },
    content: {
        type: String,
        required: [true, "Cname is required"],
        unique: false
    },
    props: {
        type: Object,
        required: false,
        unique: false
    }
});

export default mongoose.model.Contents || mongoose.model("Content", ContentSchema);