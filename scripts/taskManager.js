class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.filter = 'all';
        this.taskContainer = document.querySelector('.tasks-grid');
        this.taskCounter = document.querySelector('.task-counter');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.undoButton = document.querySelector('.btn-undo');
        this.redoButton = document.querySelector('.btn-redo');
        
        // Undo/Redo contenedores
        this.actionStack = [];
        this.undoStack = [];
        
        this.initializeEventListeners();
        this.renderTasks();
        this.updateTaskCounter();
        this.updateUndoRedoButtons();
    }

    initializeEventListeners() {

        // Botones de filtro
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.filter = button.dataset.filter;
                this.updateActiveFilter();
                this.renderTasks();
            });
        });

        // Undo/Redo btns
        this.undoButton.addEventListener('click', () => this.undo());
        this.redoButton.addEventListener('click', () => this.redo());

        // eventos Drag & Drop
        this.taskContainer.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.taskContainer.addEventListener('dragover', this.handleDragOver.bind(this));
        this.taskContainer.addEventListener('drop', this.handleDrop.bind(this));
    }

    updateUndoRedoButtons() {
        this.undoButton.disabled = this.actionStack.length === 0;
        this.redoButton.disabled = this.undoStack.length === 0;
    }

    handleDragStart(e) {
        if (e.target.classList.contains('task-item')) {
            e.target.classList.add('dragging');
            e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        if (!draggingItem) return;

        const afterElement = this.getDragAfterElement(e.clientY);
        if (afterElement) {
            this.taskContainer.insertBefore(draggingItem, afterElement);
        } else {
            this.taskContainer.appendChild(draggingItem);
        }
    }

    handleDrop(e) {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        if (!draggingItem) return;

        draggingItem.classList.remove('dragging');
        
        // Get new order
        const newOrder = Array.from(this.taskContainer.children)
            .map(item => parseInt(item.dataset.taskId));
        
        // Save current state for undo
        this.saveStateForUndo();
        
        // Update tasks order
        this.tasks.sort((a, b) => {
            return newOrder.indexOf(a.id) - newOrder.indexOf(b.id);
        });
        
        this.saveTasks();
    }

    getDragAfterElement(y) {
        const draggableElements = [...this.taskContainer.querySelectorAll('.task-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    saveStateForUndo() {
        this.actionStack.push(JSON.stringify(this.tasks));
        this.undoStack = []; // Clear redo stack when new action is performed
        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.actionStack.length > 0) {
            const currentState = JSON.stringify(this.tasks);
            this.undoStack.push(currentState);
            
            const previousState = this.actionStack.pop();
            this.tasks = JSON.parse(previousState);
            
            this.saveTasks();
            this.renderTasks();
            this.updateTaskCounter();
            this.updateUndoRedoButtons();
        }
    }

    redo() {
        if (this.undoStack.length > 0) {
            const currentState = JSON.stringify(this.tasks);
            this.actionStack.push(currentState);
            
            const nextState = this.undoStack.pop();
            this.tasks = JSON.parse(nextState);
            
            this.saveTasks();
            this.renderTasks();
            this.updateTaskCounter();
            this.updateUndoRedoButtons();
        }
    }

    updateActiveFilter() {
        this.filterButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.filter === this.filter);
        });
    }

    addTask(task) {
        this.saveStateForUndo();
        this.tasks.push({
            ...task,
            id: Date.now(),
            completed: false
        });
        this.saveTasks();
        this.renderTasks();
        this.updateTaskCounter();
    }

    editTask(id, updatedTask) {
        this.saveStateForUndo();
        this.tasks = this.tasks.map(task => 
            task.id === id ? { ...task, ...updatedTask } : task
        );
        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(id) {
        const taskElement = document.querySelector(`[data-task-id="${id}"]`);
        if (taskElement) {
            taskElement.classList.add('fade-out');
            setTimeout(() => {
                this.tasks = this.tasks.filter(task => task.id !== id);
                this.saveTasks();
                this.renderTasks();
                this.updateTaskCounter();
            }, 300);
        }
    }

    toggleTaskComplete(id) {
        this.tasks = this.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveTasks();
        this.renderTasks();
        this.updateTaskCounter();
    }
    
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // Obtener tareas filtradas
    getFilteredTasks() {
        switch (this.filter) {
            case 'completed':
                return this.tasks.filter(task => task.completed);
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            default:
                return this.tasks;
        }
    }

    updateTaskCounter() {
        const pendingTasks = this.tasks.filter(task => !task.completed).length;
        this.taskCounter.textContent = `${pendingTasks} tareas pendientes`;
    }

    renderTasks() {
        this.taskContainer.innerHTML = '';
        const filteredTasks = this.getFilteredTasks();
        
        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.taskContainer.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.dataset.taskId = task.id;
        taskElement.draggable = true;

        taskElement.innerHTML = `
            <div class="task-item-info">
                <div class="title-task">
                    <div class="task-checkbox">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} class="task-complete">
                    </div>
                    <h3 class="task-item-title">${task.title}</h3>
                </div> 
                <p class="task-item-date">Fecha límite: ${task.date}</p>
                <p class="task-item-priority">Prioridad: ${task.priority}</p>
            </div>
            <div class="task-item-actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Eliminar</button>
            </div>
        `;

        // Eventos "Tarea completada" y "Eliminar tarea"
        taskElement.querySelector('.task-complete').addEventListener('change', () => {
            // Se añade en el stack
            this.saveStateForUndo();
            this.toggleTaskComplete(task.id);
        });

        taskElement.querySelector('.btn-delete').addEventListener('click', () => {
            // Se añade en el stack
            this.saveStateForUndo();
            this.deleteTask(task.id);
        });

        return taskElement;
    }
}

// Gestor de tareas
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
}); 