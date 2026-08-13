const { User } = require("../models");

function getWorkspaceId(req) {
  return req.workspaceId || req.body?.workspaceId || req.user?.workspaceId;
}

// Get all users in current workspace
exports.getWorkspaceUsers = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace context is required." });
    }

    const users = await User.findAll({
      where: { workspaceId },
      attributes: ["id", "fullName", "email", "phoneNumber", "role", "createdAt"],
      order: [["createdAt", "ASC"]],
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);
    const { userId } = req.params;
    const { role } = req.body;

    if (!["admin", "manager", "member"].includes(role?.toLowerCase())) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const user = await User.findOne({
      where: { id: userId, workspaceId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found in workspace." });
    }

    await user.update({ role: role.toLowerCase() });

    res.json({ message: "User role updated successfully.", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user / Remove from workspace (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);
    const { userId } = req.params;

    if (parseInt(userId, 10) === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account from here." });
    }

    const user = await User.findOne({
      where: { id: userId, workspaceId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found in workspace." });
    }

    await user.destroy();

    res.json({ message: "User removed from workspace successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};