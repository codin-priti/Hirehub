import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        headline: {
            type: String,
            required: true
        },

        bio: {
            type: String,
        },

        skills: {
            type: [String],

        },
        location: {
            type: String,
        },
        phone: {
            type: String,
        },
        projects: {
            type: [
                {
                    name: String,
                    description: String,
                    link: String,
                    technologies: [String],
                    projectUrl: String,
                    githubUrl: String
                    
                }
            ]
        },
        experience: {
            type: [
                {
                    company: String,
                    description: String,
                    position: String,
                    startDate: Date,
                    endDate: Date,
                    currentlyWorking: Boolean
                }
            ]
        },

        education: {
            type: [
                {
                    institution: String,
                    degree: String,
                    fieldOfStudy: String,
                    startDate: Date,
                    endDate: Date,
                    currentlyStudying: Boolean
                }
            ]
        },

        certifications: {
            type: [
                {
                    name: String,
                    issuingOrganization: String,
                    issueDate: Date,
                    expirationDate: Date,
                    credentialId: String,
                    credentialUrl: String
                }
            ]
        },
resume: {
    url: {
        type: String,
        default: null
    },

    fileName: {
        type: String,
        default: null
    },

    uploadedAt: {
        type: Date,
        default: null
    }
},
timestamps: true            






    })

    export default mongoose.model("Candidate", candidateSchema);