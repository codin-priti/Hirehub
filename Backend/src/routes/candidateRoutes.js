const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    getProfile,
    updateProfile,
    deleteProfile,
    addSkills,
    removeSkill,
    addProject,
    updateProject,
    deleteProject,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    addCertification,
    deleteCertification
} = require('../controllers/candidateController');

// All routes below require authentication
router.use(authMiddleware);

// Candidate profile
router.get('/me', getProfile);
router.put('/me', updateProfile);
router.delete('/me', deleteProfile);

// Skills
router.post('/skills', addSkills);
router.delete('/skills', removeSkill);

// Projects
router.post('/projects', addProject);
router.put('/projects/:projectId', updateProject);
router.delete('/projects/:projectId', deleteProject);

// Education
router.post('/education', addEducation);
router.put('/education/:educationId', updateEducation);
router.delete('/education/:educationId', deleteEducation);

// Experience
router.post('/experience', addExperience);
router.put('/experience/:experienceId', updateExperience);
router.delete('/experience/:experienceId', deleteExperience);

// Certifications
router.post('/certifications', addCertification);
router.delete('/certifications/:certificationId', deleteCertification);

module.exports = router;