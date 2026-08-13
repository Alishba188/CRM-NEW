const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

// GET /api/users/me - Return logged-in user profile
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;