
const mongoose = require("mongoose");
const Skill = require("../models/skillModel");

const allowedCategories = [
  "frontend",
  "backend",
  "database",
  "mobile",
  "devops",
  "testing",
  "tools",
  "other",
];

const allowedProficiencies = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
];

// Create a skill
const createSkill = async (req, res) => {
  try {
    const {
      name,
      category,
      proficiency,
      yearsExperience,
      evidence,
    } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required",
      });
    }

    if (
      category !== undefined &&
      !allowedCategories.includes(category)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill category",
      });
    }

    if (
      proficiency !== undefined &&
      !allowedProficiencies.includes(proficiency)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid proficiency level",
      });
    }

    if (
      yearsExperience !== undefined &&
      (
        typeof yearsExperience !== "number" ||
        !Number.isFinite(yearsExperience) ||
        yearsExperience < 0 ||
        yearsExperience > 60
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid years of experience",
      });
    }

    if (evidence !== undefined && !Array.isArray(evidence)) {
      return res.status(400).json({
        success: false,
        message: "Evidence must be an array",
      });
    }

    // Never accept candidateId or verification fields from the client.
    const skill = await Skill.create({
      candidateId: req.user.id,
      name: name.trim(),
      ...(category !== undefined && { category }),
      ...(proficiency !== undefined && { proficiency }),
      ...(yearsExperience !== undefined && { yearsExperience }),
      ...(evidence !== undefined && {
        evidence: evidence.map((item) => ({
          type: item.type,
          title: item.title,
          description: item.description,
          url: item.url,
          projectId: item.projectId,
        })),
      }),
    });

    return res.status(201).json({
      success: true,
      message: "Skill added successfully",
      data: skill,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This skill has already been added",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create skill error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add skill",
    });
  }
};

// Get the logged-in candidate's skills
const getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      candidateId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    console.error("Get my skills error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
};

// Get skills belonging to a candidate
const getCandidateSkills = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!mongoose.isValidObjectId(candidateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID",
      });
    }

    // Private skills are not exposed through this endpoint.
    // Public profile visibility should be enforced by your
    // candidate profile/visibility policy as well.
    const skills = await Skill.find({ candidateId })
      .select("name category proficiency yearsExperience evidence")
      .lean();

    return res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    console.error("Get candidate skills error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidate skills",
    });
  }
};

// Update one of the logged-in candidate's skills
const updateSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    if (!mongoose.isValidObjectId(skillId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    const allowedFields = [
      "name",
      "category",
      "proficiency",
      "yearsExperience",
      "evidence",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }

    if (
      updates.name !== undefined &&
      (
        typeof updates.name !== "string" ||
        !updates.name.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill name",
      });
    }

    if (
      updates.category !== undefined &&
      !allowedCategories.includes(updates.category)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill category",
      });
    }

    if (
      updates.proficiency !== undefined &&
      !allowedProficiencies.includes(updates.proficiency)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid proficiency level",
      });
    }

    if (
      updates.yearsExperience !== undefined &&
      (
        typeof updates.yearsExperience !== "number" ||
        !Number.isFinite(updates.yearsExperience) ||
        updates.yearsExperience < 0 ||
        updates.yearsExperience > 60
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid years of experience",
      });
    }

    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
    }

    if (updates.evidence !== undefined) {
      if (!Array.isArray(updates.evidence)) {
        return res.status(400).json({
          success: false,
          message: "Evidence must be an array",
        });
      }

      updates.evidence = updates.evidence.map((item) => ({
        type: item.type,
        title: item.title,
        description: item.description,
        url: item.url,
        projectId: item.projectId,
      }));
    }

    const skill = await Skill.findOneAndUpdate(
      {
        _id: skillId,
        candidateId: req.user.id,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found or you do not own it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This skill already exists in your profile",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update skill error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update skill",
    });
  }
};

// Delete one of the logged-in candidate's skills
const deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    if (!mongoose.isValidObjectId(skillId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    const skill = await Skill.findOneAndDelete({
      _id: skillId,
      candidateId: req.user.id,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found or you do not own it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Delete skill error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete skill",
    });
  }
};
export {
  createSkill, deleteSkill, getCandidateSkills, getMySkills, updateSkill
};
