import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['project', 'github', 'challenge', 'other'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
    },

    description: {
        type: String,
        trim: true,
        maxlength: 1000,
    },

    url: {
        type: String,
        trim: true,
    },

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },

    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },

    verifiedAt: {
        type: Date,
        default: null
    },
},
    { timestamps: true }
);


const skillSchema = new mongoose.Schema({
    candidateId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
    },
    category: {
        type: String,
        enum: [
            "frontend",
            "backend",
            "database",
            "mobile",
            "devops",
            "testing",
            "tools",
            "other",
        ],
        default: "other",
    },

    proficiency: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "expert"],
        default: "beginner",
    },

    yearsofExperience: {
        type: Number,
        min: 0,
        max: 50,
        default: 0,
    },

    evidance: {
        type: [evidenceSchema],
        default: []
    },

},
{timestamps:true}
)

// A candidate cannot add the same normalized skill twice.
skillSchema.index(
  { candidateId: 1, name: 1 },
  { unique: true }
);

const skill = mongoose.model("skill",skillSchema)

export default skill


