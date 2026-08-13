const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/rbac");
const {
  getWorkspaceUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

// GET /api/users/me - Return logged-in user profile
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

// GET /api/users - Get all team members in current workspace
router.get("/", protect, getWorkspaceUsers);

// PUT /api/users/:userId/role - Update user role (Admin only)
router.put("/:userId/role", protect, authorizeRoles("admin"), updateUserRole);

// DELETE /api/users/:userId - Remove team member (Admin only)
router.delete("/:userId", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;