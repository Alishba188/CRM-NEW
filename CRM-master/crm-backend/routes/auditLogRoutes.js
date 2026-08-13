const express = require("express");
const router = express.Router();
const { getAuditLogs } = require("../controllers/auditLogController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/rbac");

// Protected Route - Restricted to Admin and Manager
router.get("/", protect, authorizeRoles("admin", "manager"), getAuditLogs);

module.exports = router;