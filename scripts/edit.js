document.addEventListener('DOMContentLoaded', () => {
    const taskContainer = document.querySelector('.task-container');
    
    taskContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-edit')) {
            const taskItem = e.target.closest('.task-item');
            const taskTitle = taskItem.querySelector('.task-item-title');
            const taskDate = taskItem.querySelector('.task-item-date');
            const taskPriority = taskItem.querySelector('.task-item-priority');
            const taskActions = taskItem.querySelector('.task-item-actions');
            
            // Crear edit form
            const editForm = document.createElement('form');
            editForm.className = 'edit-form';
            
            // nombre
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.value = taskTitle.textContent;
            titleInput.className = 'edit-input';
            titleInput.required= true;
            
            // fecha
            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            const currentDate = taskDate.textContent.split(': ')[1];
            dateInput.value = formatDateForInput(currentDate);
            dateInput.className = 'edit-input';
            dateInput.required = true;
            
            // prioridad
            const prioritySelect = document.createElement('select');
            prioritySelect.className = 'edit-input';
            const priorities = ['alta', 'media', 'baja'];
            priorities.forEach(priority => {
                const option = document.createElement('option');
                option.value = priority;
                option.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
                if (taskPriority.textContent.includes(option.textContent)) {
                    option.selected = true;
                }
                prioritySelect.appendChild(option);
            });
            
            // guardar
            const saveButton = document.createElement('button');
            saveButton.type = 'submit';
            saveButton.textContent = 'Guardar';
            saveButton.className = 'btn-save';
            
            // cancelar
            const cancelButton = document.createElement('button');
            cancelButton.type = 'button';
            cancelButton.textContent = 'Cancelar';
            cancelButton.className = 'btn-cancel';
            
            // armado
            editForm.appendChild(titleInput);
            editForm.appendChild(dateInput);
            editForm.appendChild(prioritySelect);
            editForm.appendChild(saveButton);
            editForm.appendChild(cancelButton);
            
            // reemplazar la tarea con el edit form
            const taskInfo = taskItem.querySelector('.task-item-info');
            taskInfo.style.display = 'none';
            taskItem.insertBefore(editForm, taskInfo);
            
            taskActions.classList.add("hidden")

            // Guardaar cambios
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // actualizar contenido de la tarea
                taskTitle.textContent = titleInput.value;
                taskDate.textContent = `Fecha límite: ${formatDate(dateInput.value)}`;
                taskPriority.textContent = `Prioridad: ${prioritySelect.value.charAt(0).toUpperCase() + prioritySelect.value.slice(1)}`;
                
                // remover formulario y mostrar el contenido actualizado
                editForm.remove();
                taskInfo.style.display = 'flex';
                taskActions.classList.remove("hidden")
            });
            
            // Cancelar
            cancelButton.addEventListener('click', () => {
                editForm.remove();
                taskInfo.style.display = 'flex';
                taskActions.classList.remove("hidden")
            });
        }
    });
    
    function formatDateForInput(dateString) {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }
}); 