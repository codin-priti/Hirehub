import Company from "../models/companymodel";


//crea a  company profile

export const createCompanyProfile = async (req, res) => {
  try {
    const { name, description, industry, website, location, size, logo } = req.body;

            if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof description !== "string" ||
            !description.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Company name and description are required.",
            });
        }


        if(req.user.role!=="recruiter"){
          return res.status(403).json({
            success: false,
            message: "Only recruiters can create a company profile.",
          });

          
        }

        //check weathere the user already has a company profile

        const existingCompany = await Company.findOne({ owner: req.user.id });

    if(existingCompany) {
        return res.status(409).json({
            success: false,
            message: 'Company profile already exists for this user.'
        });
    }

    const newCompany = await Company.create({
      name: name.trim(),
      description: description.trim(),
      industry,
      website,
      location,
      size,
      logo,
      owner: req.user.id
    });

    await newCompany.save();

    res.status(201).json({
      success: true,
      message: 'Company profile created successfully.',
      company: newCompany
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating company profile.',
      error: error.message
    });
  }
};

export const  ViewCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user.id });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found.'
      });
    }

    res.status(200).json({
      success: true,
      company
    });
  }
    catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving company profile.',
      error: error.message
    });
  }
};

export const updateCompanyProfile = async (req, res) => {
  try{
    const company = await Company.findOne({ owner: req.user.id });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found.'
      });
    }

    const { name, description, industry, website, location, size, logo } = req.body;

    const updatedFields = {};

    if(name!==undefined) updatedFields.name = name.trim();
    if(description!==undefined) updatedFields.description = description.trim();
    if(industry!==undefined) updatedFields.industry = industry;
    if(website!==undefined) updatedFields.website = website;
    if(location!==undefined) updatedFields.location = location;
    if(size!==undefined) updatedFields.size = size;
    if(logo!==undefined) updatedFields.logo = logo;

    const updatedCompany = await Company.findOneAndUpdate(
      { owner: req.user.id },
      { $set: updatedFields },
      { new: true ,
      runValidators: true 
      }
    );

    res.status(200).json({
      success: true,
      message: 'Company profile updated successfully.',
      company: updatedCompany
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating company profile.',
      error: error.message
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId)
      .select("-owner -__v");

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found"
      });
    }

    return res.status(200).json({
      message: "Company profile fetched successfully",
      company
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid company ID"
      });
    }

    return res.status(500).json({
      message: "Failed to fetch company profile"
    });
  }
};


export const getCompanyPublicJobs = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found"
      });
    }

    const jobs = await Job.find({ company: companyId, isPublic: true })

      .select("title description location jobType salary createdAt")
      .sort({ createdAt: -1 });
  
    return res.status(200).json({
      message: "Public jobs fetched successfully",
      Count: jobs.length,
      jobs
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid company ID"
      });
    }
  }
};

