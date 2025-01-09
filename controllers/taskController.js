const { tasks } = require('../models/taskModel');

// Create a new task
const createTask = (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;

    // Validate required fields
    if (!title || !status || !due_date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, status, and due date must be provided'
      });
    }

    // Validate status
    const validStatuses = ['To-Do', 'In Progress', 'Done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid status: To-Do, In Progress, or Done'
      });
    }

    // Create new task with auto-incremented ID
    const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1,
      title,
      description,
      status,
      due_date
    };

    tasks.push(newTask);

    res.status(201).json({
      success: true,
      data: newTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create new task'
    });
  }
};

// Get all tasks
const getAllTasks = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve tasks'
    });
  }
};

// Get tasks by status
const getTaskByStatus = (req, res) => {
  try {
    const { status } = req.params;
    
    // Validate status
    const validStatuses = ['To-Do', 'In Progress', 'Done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Please select a valid status: To-Do, In Progress, or Done'
      });
    }

    const filteredTasks = tasks.filter(task => task.status === status);

    res.status(200).json({
      success: true,
      count: filteredTasks.length,
      data: filteredTasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve tasks by status'
    });
  }
};

// Update a task
const updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const taskId = parseInt(id);

    // Find task index
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Unable to locate the specified task'
      });
    }

    // Validate status if it's being updated
    if (updates.status) {
      const validStatuses = ['To-Do', 'In Progress', 'Done'];
      if (!validStatuses.includes(updates.status)) {
        return res.status(400).json({
          success: false,
          error: 'Please select a valid status: To-Do, In Progress, or Done'
        });
      }
    }

    // Update task
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      id: taskId // Ensure ID doesn't get overwritten
    };

    res.status(200).json({
      success: true,
      data: tasks[taskIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update task'
    });
  }
};

// Delete a task
const deleteTask = (req, res) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id);
    
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Unable to locate the specified task'
      });
    }

    tasks.splice(taskIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Task has been successfully removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete task'
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskByStatus,
  updateTask,
  deleteTask
};