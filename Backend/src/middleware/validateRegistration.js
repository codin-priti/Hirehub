
const validateRegistration = (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Check required fields
    if (!name || !email || !password || !role) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    // Validate field types and non-empty values
    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof role !== "string" ||
        !name.trim() ||
        !email.trim() ||
        !password
    ) {
        return res.status(400).json({
            message: "Please provide valid registration details",
        });
    }

    // Validate password length
    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long",
        });
    }

    // Validate role
    if (!["candidate", "recruiter"].includes(role.trim().toLowerCase())) {
        return res.status(400).json({
            message: "Role must be either 'candidate' or 'recruiter'",
        });
    }

    next();
};

export default validateRegistration;

