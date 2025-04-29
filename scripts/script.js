document.addEventListener('DOMContentLoaded', () => {
    const taskContainer = document.querySelector('.task-container');
    const taskForm = document.getElementById('taskForm');

    // Agregar tarea
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Obtener valores del formulario
        const taskInput = document.getElementById('task');
        const dateInput = document.getElementById('date');
        const prioritySelect = document.getElementById('priority');
        
        const taskTitle = taskInput.value.trim();
        const taskDate = dateInput.value;
        const taskPriority = prioritySelect.value;

        // Validar los imputs
        if (!taskTitle) {
            showError(taskInput, 'Por favor, ingresa un nombre para la tarea');
            return;
        }

        if (!taskDate) {
            showError(dateInput, 'Por favor, selecciona una fecha límite');
            return;
        }

        // Añadir tarea al gestor
        window.taskManager.addTask({
            title: taskTitle,
            date: formatDate(taskDate),
            priority: taskPriority.charAt(0).toUpperCase() + taskPriority.slice(1)
        });

        // Reiniciar formulario
        taskForm.reset();
    });

    // función auxiliar para el formato de la fecha
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }
});

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    let error = formGroup.querySelector('.error-message');
    
    if (!error) {
        error = document.createElement('div');
        error.className = 'error-message';
        formGroup.appendChild(error);
    }
    
    error.textContent = message;
    input.classList.add('error');
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message');
    
    if (error) {
        error.remove();
    }
    
    input.classList.remove('error');
}
