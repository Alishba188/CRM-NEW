const { Lead } = require("../models");

function getWorkspaceId(req) {
  return req.workspaceId || req.body?.workspaceId || req.user?.workspaceId;
}

// Create Lead
exports.createLead = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace context is required." });
    }

    const lead = await Lead.create({
      ...req.body,
      workspaceId,
    });

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Note
exports.addNote = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace context is required." });
    }

    const lead = await Lead.findOne({
      where: { id: req.params.id, workspaceId },
    });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const note = req.body?.note?.trim();
    if (!note) {
      return res.status(400).json({ message: "Note is required." });
    }

    const nextNotes = [lead.notes, note].filter(Boolean).join("\n\n");
    await lead.update({ notes: nextNotes });

    res.json({ message: "Note added", lead });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Leads (Bounded Pagination & Strict Tenant Isolation)
exports.getLeads = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace context is required." });
    }

    // Support pagination parameters with safe caps
    const page = req.query.page ? Math.max(1, parseInt(req.query.page, 10)) : null;
    const limit = req.query.limit ? Math.min(100, Math.max(1, parseInt(req.query.limit, 10))) : null;

    const queryOptions = {
      where: { workspaceId },
      order: [["createdAt", "DESC"]],
    };

    if (page && limit) {
      queryOptions.limit = limit;
      queryOptions.offset = (page - 1) * limit;

      const { count, rows } = await Lead.findAndCountAll(queryOptions);
      return res.json({
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        leads: rows,
      });
    }

    const leads = await Lead.findAll(queryOptions);
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Lead
exports.getLead = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace context is required." });
    }

    const lead = await Lead.findOne({
      where: { id: req.params.id, workspaceId },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Lead
exports.updateLead = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace context is required." });
    }

    const lead = await Lead.findOne({
      where: { id: req.params.id, workspaceId },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    await lead.update(req.body);

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Lead
exports.deleteLead = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace context is required." });
    }

    const lead = await Lead.findOne({
      where: { id: req.params.id, workspaceId },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    await lead.destroy();

    res.json({
      message: "Lead deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};