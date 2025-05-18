const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  is_completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  // ... existing fields ...
  tasks: [taskSchema]
});

// Add a virtual for calculating progress
projectSchema.virtual('progress').get(function() {
  if (this.tasks.length === 0) return 0;
  const completedTasks = this.tasks.filter(task => task.is_completed).length;
  return Math.round((completedTasks / this.tasks.length) * 100);
});

// Make sure virtuals are included in JSON
projectSchema.set('toJSON', { virtuals: true });

// ... existing code ... 