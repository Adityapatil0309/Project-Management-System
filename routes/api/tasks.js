const express = require('express');
const router = express.Router();
const Task = require('../../models/Task');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   POST api/tasks
// @desc    Create a new task for a project
// @access  Private (Admin only)
router.post('/', [auth, [
    check('projectId', 'Project ID is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('dueDate', 'Due date is required').not().isEmpty()
]], async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ msg: 'Not authorized to create tasks' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { projectId, title, description, dueDate } = req.body;

        const task = new Task({
            project: projectId,
            title,
            description,
            dueDate
        });

        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/tasks/project/:projectId
// @desc    Get all tasks for a project
// @access  Private
router.get('/project/:projectId', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/tasks/:id
// @desc    Update task status and progress
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ msg: 'Not authorized to update tasks' });
        }

        const { status, progress } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        if (status) task.status = status;
        if (progress !== undefined) task.progress = progress;

        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 