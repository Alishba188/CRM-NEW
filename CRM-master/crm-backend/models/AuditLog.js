const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Correct direct import

const AuditLog = sequelize.define("AuditLog", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING, // e.g., "MEMBER_INVITED", "LEAD_DELETED", "ROLE_CHANGED"
    allowNull: false,
  },
  entity: {
    type: DataTypes.STRING, // e.g., "User", "Lead", "Workspace"
    allowNull: false,
  },
  entityId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = AuditLog;