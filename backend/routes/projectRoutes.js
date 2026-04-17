const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const User = require("../models/User");

// CREATE PROJECT
router.post("/create", async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const project = new Project({ title, description, userId, members: userId ? [userId] : [] });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL PROJECTS
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("userId", "name email")
      .populate("members", "name email");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET PROJECT BY ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("userId", "name email")
      .populate("members", "name email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD MEMBER TO PROJECT
router.post("/:id/members", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const alreadyMember = project.members.some(m => m.toString() === user._id.toString());
    if (alreadyMember) return res.status(400).json({ message: "User is already a member" });

    project.members.push(user._id);
    await project.save();

    const updated = await Project.findById(req.params.id).populate("members", "name email");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// REMOVE MEMBER FROM PROJECT
router.delete("/:id/members/:userId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.members = project.members.filter(m => m.toString() !== req.params.userId);
    await project.save();

    const updated = await Project.findById(req.params.id).populate("members", "name email");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
