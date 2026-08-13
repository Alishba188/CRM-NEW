const { AuditLog, User } = require("../models");

function getWorkspaceId(req) {
  return req.workspaceId || req.body?.workspaceId || req.user?.workspaceId;
}

// Get Audit Logs for the Workspace (Admin/Manager only)
exports.getAuditLogs = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace context is required." });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const { count, rows } = await AuditLog.findAndCountAll({
      where: { workspaceId },
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "email", "role"],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      logs: rows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};