import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["candidate", "recruiter"],
            required: true
        },

        resetPasswordToken: {
            type: String
        },

        resetPasswordExpires: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Create the Mongoose model
const User = mongoose.model("User", userSchema);

// Export the model
export default User;