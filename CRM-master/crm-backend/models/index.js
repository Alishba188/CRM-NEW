const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Workspace = require("./Workspace");
const User = require("./User");
const Lead = require("./Lead");
const Task = require("./Task");
const AuditLog = require("./AuditLog");

// Workspace -> Users
Workspace.hasMany(User, {
  foreignKey: "workspaceId",
  as: "users",
});

User.belongsTo(Workspace, {
  foreignKey: {
    name: "workspaceId",
    type: DataTypes.UUID,
    allowNull: false,
  },
  as: "workspace",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Workspace -> Leads
Workspace.hasMany(Lead, {
  foreignKey: "workspaceId",
  as: "leads",
});

Lead.belongsTo(Workspace, {
  foreignKey: {
    name: "workspaceId",
    type: DataTypes.UUID,
    allowNull: false,
  },
  as: "workspace",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Workspace & Lead -> Tasks
Workspace.hasMany(Task, { foreignKey: "workspaceId", as: "tasks" });
Task.belongsTo(Workspace, { foreignKey: "workspaceId", as: "workspace", onDelete: "CASCADE" });
Lead.hasMany(Task, { foreignKey: "leadId", as: "tasks" });
Task.belongsTo(Lead, { foreignKey: "leadId", as: "lead" });
User.hasMany(Task, { foreignKey: "assignedToId", as: "assignedTasks" });
Task.belongsTo(User, { foreignKey: "assignedToId", as: "assignee" });

// Workspace & User -> AuditLogs
Workspace.hasMany(AuditLog, { foreignKey: "workspaceId", as: "auditLogs" });
AuditLog.belongsTo(Workspace, { foreignKey: "workspaceId", as: "workspace", onDelete: "CASCADE" });
User.hasMany(AuditLog, { foreignKey: "userId", as: "auditLogs" });
AuditLog.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "SET NULL" });

module.exports = {
  sequelize,
  Workspace,
  User,
  Lead,
  Task,
  AuditLog,
};