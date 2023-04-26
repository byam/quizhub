import jwt from "jsonwebtoken";

function validateJwtToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error = new Error("No token provided");
        error.status = 401;
        next(error);
    }

    const token = authHeader.slice(7);

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.token = decoded;
        next();
    } catch (err) {
        const error = new Error("Authorization token missing or invalid");
        error.status = 401;
        next(error);
    }
}

export { validateJwtToken };
