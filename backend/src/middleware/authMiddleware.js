const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Lấy token từ header

    if (!token) return res.status(401).send({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, "Meloverse_secret_key"); // Giải mã token
        req.user = decoded; // Thêm thông tin user vào request
        next();
    } catch (err) {
        res.status(403).send({ message: "Forbidden" });
    }
};

// app.get("/protected-route", authMiddleware, (req, res) => {
//     res.json({ message: "Access granted", user: req.user });
// });
