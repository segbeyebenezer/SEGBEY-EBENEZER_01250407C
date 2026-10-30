// State management
let tasks = JSON.parse(localStorage.getItem('atu_planner_tasks')) || [];
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const courseNameInput = document.getElementById('course-name');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const errorMessage = document.getElementById('error-message');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initial Render
renderTasks();

// Event Listener: Add Task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = taskTitleInput.value.trim();
  const course = courseNameInput.value.trim() || 'General';

  if (!title) {
    errorMessage.style.display = 'block';
    return;
  }

  errorMessage.style.display = 'none';

  const newTask = {
    id: Date.now().toString(),
    title: title,
    course: course,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskTitleInput.value = '';
  courseNameInput.value = '';
});

// Save to LocalStorage
function saveTasks() {
  localStorage.setItem('atu_planner_tasks', JSON.stringify(tasks));
}

// Toggle Complete Status
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Filter Event Listeners
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Render Tasks to DOM
function renderTasks() {
  taskList.innerHTML = '';

  let filteredTasks = tasks;
  if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }

  if (filteredTasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="task-info">
        <span class="task-title">${escapeHtml(task.title)}</span>
        <span class="task-course">${escapeHtml(task.course)}</span>
      </div>
      <div class="task-actions">
        <button class="action-btn toggle-btn" onclick="toggleTask('${task.id}')">
          ${task.completed ? 'Undo' : 'Complete'}
        </button>
        <button class="action-btn delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Helper to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}
