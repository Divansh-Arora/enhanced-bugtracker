const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

// GET ALL TICKETS
router.get("/all", async (req, res) => {
  try {
    const tickets = await Ticket.find({}).populate("assignedTo", "name email").sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE TICKET
router.post("/create", async (req, res) => {
  try {
    const { title, description, priority, projectId, assignedTo } = req.body;
    const ticket = new Ticket({
      title, description, priority, projectId,
      assignedTo: assignedTo || null
    });
    await ticket.save();
    const populated = await Ticket.findById(ticket._id).populate("assignedTo", "name email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET TICKETS BY PROJECT
router.get("/:projectId", async (req, res) => {
  try {
    const tickets = await Ticket.find({ projectId: req.params.projectId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE TICKET (status + assignedTo)
router.put("/:id", async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo || null;
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate("assignedTo", "name email");
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE TICKET
router.delete("/:id", async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: "Ticket deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
