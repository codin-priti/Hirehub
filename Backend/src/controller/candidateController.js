import Candidate from '../models/candidatemodel.js';

// Get candidate profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const student = await Candidate.findOne({ userId });

        if (!student) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        return res.status(200).json({
            message: 'Candidate profile found',
            student
        });
    } catch (error) {
        console.error('Error fetching candidate profile:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Update candidate profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const student = await Candidate.findOne({ userId });

        if (!student) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        const {
            headline,
            about,
            skills,
            location,
            phone,
            experience,
            education,
            certifications
        } = req.body;

        if (headline !== undefined) student.headline = headline;
        if (about !== undefined) student.about = about;
        if (skills !== undefined) student.skills = skills;
        if (location !== undefined) student.location = location;
        if (phone !== undefined) student.phone = phone;
        if (experience !== undefined) student.experience = experience;
        if (education !== undefined) student.education = education;
        if (certifications !== undefined) {
            student.certifications = certifications;
        }

        await student.save();

        return res.status(200).json({
            message: 'Candidate profile updated successfully',
            student
        });
    } catch (error) {
        console.error('Error updating candidate profile:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Delete candidate profile
export const deleteProfile = async (req, res) => {
    try {
        const student = await Candidate.findOne({
            userId: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        await student.deleteOne();

        return res.status(200).json({
            message: 'Candidate profile deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting candidate profile:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Add skill
export const addSkills = async (req, res) => {
    try {
        const { name } = req.body;

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                message: 'Skill name is required'
            });
        }

        const candidateProfile = await Candidate.findOne({
            userId: req.user.id
        });

        if (!candidateProfile) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        const skillName = name.trim();

        const skillExists = candidateProfile.skills.some(
            skill => skill.toLowerCase() === skillName.toLowerCase()
        );

        if (skillExists) {
            return res.status(400).json({
                message: 'Skill already exists'
            });
        }

        candidateProfile.skills.push(skillName);
        await candidateProfile.save();

        return res.status(200).json({
            message: 'Skill added successfully',
            candidateProfile
        });
    } catch (error) {
        console.error('Error adding skill:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Remove skill
export const removeSkill = async (req, res) => {
    try {
        const { name } = req.body;

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                message: 'Skill name is required'
            });
        }

        const candidateProfile = await Candidate.findOne({
            userId: req.user.id
        });

        if (!candidateProfile) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        const skillIndex = candidateProfile.skills.findIndex(
            skill => skill.toLowerCase() === name.trim().toLowerCase()
        );

        if (skillIndex === -1) {
            return res.status(404).json({
                message: 'Skill not found'
            });
        }

        candidateProfile.skills.splice(skillIndex, 1);
        await candidateProfile.save();

        return res.status(200).json({
            message: 'Skill removed successfully',
            candidateProfile
        });
    } catch (error) {
        console.error('Error removing skill:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Add project
export const addProject = async (req, res) => {
    try {
        const {
            title,
            description,
            link,
            technologies,
            projectUrl,
            githubUrl
        } = req.body;

        if (
            typeof title !== 'string' || !title.trim() ||
            typeof description !== 'string' || !description.trim()
        ) {
            return res.status(400).json({
                message: 'Title and description are required'
            });
        }

        const candidateProfile = await Candidate.findOne({
            userId: req.user.id
        });

        if (!candidateProfile) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        candidateProfile.projects.push({
            title,
            description,
            link,
            technologies,
            projectUrl,
            githubUrl
        });

        await candidateProfile.save();

        return res.status(201).json({
            message: 'Project added successfully',
            candidateProfile
        });
    } catch (error) {
        console.error('Error adding project:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Update project
export const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const candidateProfile = await Candidate.findOne({
            userId: req.user.id
        });

        if (!candidateProfile) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        const project = candidateProfile.projects.id(projectId);

        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        const {
            title,
            description,
            link,
            technologies,
            projectUrl,
            githubUrl
        } = req.body;

        if (title !== undefined) project.title = title;
        if (description !== undefined) project.description = description;
        if (link !== undefined) project.link = link;
        if (technologies !== undefined) project.technologies = technologies;
        if (projectUrl !== undefined) project.projectUrl = projectUrl;
        if (githubUrl !== undefined) project.githubUrl = githubUrl;

        await candidateProfile.save();

        return res.status(200).json({
            message: 'Project updated successfully',
            candidateProfile
        });
    } catch (error) {
        console.error('Error updating project:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Delete project
export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const candidateProfile = await Candidate.findOne({
            userId: req.user.id
        });

        if (!candidateProfile) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        const project = candidateProfile.projects.id(projectId);

        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        project.deleteOne();
        await candidateProfile.save();

        return res.status(200).json({
            message: 'Project deleted successfully',
            projects: candidateProfile.projects
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Add education
export const addEducation = async (req, res) => {
    try {
        const candidateProfile = await Candidate.findOne({
            userId: req.user.id
        });

        if (!candidateProfile) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        candidateProfile.education.push(req.body);
        await candidateProfile.save();

        return res.status(201).json({
            message: 'Education added successfully',
            education: candidateProfile.education
        });
    } catch (error) {
        console.error('Error adding education:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Update education
export const updateEducation = async (req, res) => {
    try {
        const { educationId } = req.params;

        const candidateProfile = await Candidate.findOne({
            userId: req.user.id
        });

        if (!candidateProfile) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        const education = candidateProfile.education.id(educationId);

        if (!education) {
            return res.status(404).json({
                message: 'Education not found'
            });
        }

        Object.assign(education, req.body);
        await candidateProfile.save();

        return res.status(200).json({
            message: 'Education updated successfully',
            education: candidateProfile.education
        });
    } catch (error) {
        console.error('Error updating education:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Delete education
export const deleteEducation = async (req, res) => {
    try {
        const { educationId } = req.params;

        const candidateProfile = await Candidate.findOne({
            userId: req.user.id
        });

        if (!candidateProfile) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        const education = candidateProfile.education.id(educationId);

        if (!education) {
            return res.status(404).json({
                message: 'Education not found'
            });
        }

        education.deleteOne();
        await candidateProfile.save();

        return res.status(200).json({
            message: 'Education deleted successfully',
            education: candidateProfile.education
        });
    } catch (error) {
        console.error('Error deleting education:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Add experience
export const addExperience = async (req, res) => {
    try {
        const candidateProfile = await Candidate.findOne({
            userId: req.user.id
        });

        if (!candidateProfile) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        candidateProfile.experience.push(req.body);
        await candidateProfile.save();

        return res.status(201).json({
            message: 'Experience added successfully',
            experience: candidateProfile.experience
        });
    } catch (error) {
        console.error('Error adding experience:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Update experience
export const updateExperience = async (req, res) => {
    try {
        const { experienceId } = req.params;

        const candidateProfile = await Candidate.findOne({
            userId: req.user.id
        });

        if (!candidateProfile) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        const experience = candidateProfile.experience.id(experienceId);

        if (!experience) {
            return res.status(404).json({
                message: 'Experience not found'
            });
        }

        Object.assign(experience, req.body);
        await candidateProfile.save();

        return res.status(200).json({
            message: 'Experience updated successfully',
            experience: candidateProfile.experience
        });
    } catch (error) {
        console.error('Error updating experience:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Delete experience
export const deleteExperience = async (req, res) => {
    try {
        const { experienceId } = req.params;

        const candidateProfile = await Candidate.findOne({
            userId: req.user.id
        });

        if (!candidateProfile) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        const experience = candidateProfile.experience.id(experienceId);

        if (!experience) {
            return res.status(404).json({
                message: 'Experience not found'
            });
        }

        experience.deleteOne();
        await candidateProfile.save();

        return res.status(200).json({
            message: 'Experience deleted successfully',
            experience: candidateProfile.experience
        });
    } catch (error) {
        console.error('Error deleting experience:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Add certification
export const addCertification = async (req, res) => {
    try {
        const candidateProfile = await Candidate.findOne({
            userId: req.user.id
        });

        if (!candidateProfile) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        candidateProfile.certifications.push(req.body);
        await candidateProfile.save();

        return res.status(201).json({
            message: 'Certification added successfully',
            certifications: candidateProfile.certifications
        });
    } catch (error) {
        console.error('Error adding certification:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Delete certification
export const deleteCertification = async (req, res) => {
    try {
        const { certificationId } = req.params;

        const candidateProfile = await Candidate.findOne({
            userId: req.user.id
        });

        if (!candidateProfile) {
            return res.status(404).json({
                message: 'Candidate profile not found'
            });
        }

        const certification = candidateProfile.certifications.id(certificationId);

        if (!certification) {
            return res.status(404).json({
                message: 'Certification not found'
            });
        }

        certification.deleteOne();
        await candidateProfile.save();

        return res.status(200).json({
            message: 'Certification deleted successfully',
            certifications: candidateProfile.certifications
        });
    } catch (error) {
        console.error('Error deleting certification:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};
