import mongoose from "mongoose";

export const DocsSchema = mongoose.Schema({
    did: {
        type: String,
        required: [true, "Did cannot be empty"],
        unique: true
    },
    dname: {
        type: String,
        required: [true, "Dname is required"],
        unique: false
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        unique: false
    },
    image: {
        type: String,
        required: false,
        unique: false
    },
    date: {
        type: String,
        required: false,
        unique: false
    },
    privacy: {
        type: String,
        required: [true, "Privacy is required"],
        unique: false
    },
    document: {
        type: String,
        required: [true, "Contents is required"],
        unique: false
    }
});

export default mongoose.model.Documents || mongoose.model("Document",DocsSchema);