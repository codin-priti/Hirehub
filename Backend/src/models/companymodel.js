import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Company description is required'],
      trim: true,
    },

    industry: {
      type: String,
      required: [true, 'Industry is required'],
      trim: true,
    },

    website: {
      type: String,
      trim: true,
      default: '',
    },

    location: {
      type: String,
      required: [true, 'Company location is required'],
      trim: true,
    },

    size: {
      type: String,
      enum: [
        '1-10',
        '11-50',
        '51-200',
        '201-500',
        '501-1000',
        '1000+',
      ],
      default: '1-10',
    },

    logo: {
      type: String,
      default: '',
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model('Company', companySchema);

export default Company;
