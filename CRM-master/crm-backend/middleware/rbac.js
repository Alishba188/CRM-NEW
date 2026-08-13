/**
 * Role-Based Access Control Middleware
 * Usage: router.delete("/:id", protect, authorizeRoles("Admin", "Manager"), deleteHandler)
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Access restricted to roles [${allowedRoles.join(", ")}].`
      });
    }
    next();
  };
};

module.exports = authorizeRoles;