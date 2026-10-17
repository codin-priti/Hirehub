import jwt from "jsonwebtoken";

const authmiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Check whether the Authorization header exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization token is required",
            });
        }

        // 2. Extract the token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token is missing",
            });
        }

        // 3. Verify the token's signature and expiration
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // 4. Attach decoded user information to the request
        req.user = decoded;

        // 5. Continue to the next middleware/controller
        return next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

export default authMiddleware;
