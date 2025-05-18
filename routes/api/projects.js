// ... existing imports ...

// Add task to project
router.post('/:projectId/tasks', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const newTask = {
      title: req.body.title,
      description: req.body.description,
      is_completed: false
    };

    project.tasks.push(newTask);
    await project.save();

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update task status
router.patch('/:projectId/tasks/:taskId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const task = project.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    task.is_completed = req.body.is_completed;
    await project.save();

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ... existing routes ... 