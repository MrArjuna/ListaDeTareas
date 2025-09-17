
document.addEventListener('DOMContentLoaded', () => {
    const showFormBtn = document.getElementById('showFormBtn');
    const taskForm = document.getElementById('taskForm');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const cancelAddTaskBtn = document.getElementById('cancelAddTaskBtn');
    const searchInput = document.getElementById('searchInput');
    const pendingTasksList = document.getElementById('pendingTasks');
    const completedTasksList = document.getElementById('completedTasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let editingTaskId = null;

    showFormBtn.addEventListener('click', showAddTaskForm);
    cancelAddTaskBtn.addEventListener('click', hideAddTaskForm);
    addTaskBtn.addEventListener('click', handleAddTask);
    searchInput.addEventListener('input', renderTasks);

    function showAddTaskForm() {
        if (editingTaskId !== null) {
            editingTaskId = null;
            renderTasks();
        }
        taskForm.style.display = 'block';
        showFormBtn.style.display = 'none';
    }

    function hideAddTaskForm() {
        taskForm.style.display = 'none';
        showFormBtn.style.display = 'block';
        clearAddTaskForm();
    }

    function clearAddTaskForm() {
        document.getElementById('taskInput').value = '';
        document.getElementById('responsibleInput').value = '';
        document.getElementById('dueDateInput').value = '';
        document.getElementById('observationsInput').value = '';
        document.getElementById('priorityInput').value = 'Baja';
        document.getElementById('statusSelect').value = 'No iniciado';
    }

    function handleAddTask() {
        console.log("Botón confirmar presionado");
        const description = document.getElementById('taskInput').value.trim();
        const responsible = document.getElementById('responsibleInput').value.trim();
        const dueDate = document.getElementById('dueDateInput').value;

        if (!description || !responsible || !dueDate) {
            alert('Por favor, completa la descripción, el responsable y la fecha de vencimiento.');
            return;
        }

        const newTask = {
            id: Date.now(),
            description, responsible, dueDate,
            creationDate: new Date().toISOString().split('T')[0],
            priority: document.getElementById('priorityInput').value,
            status: document.getElementById('statusSelect').value,
            observations: document.getElementById('observationsInput').value.trim(),
        };

        tasks.push(newTask);
        saveAndRender();
        hideAddTaskForm();
    }

    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        pendingTasksList.innerHTML = '';
        completedTasksList.innerHTML = '';

        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task =>
            task.description.toLowerCase().includes(searchTerm) ||
            task.responsible.toLowerCase().includes(searchTerm)
        );

        const pending = filteredTasks.filter(task => task.status !== 'Finalizado').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        const completed = filteredTasks.filter(task => task.status === 'Finalizado').sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

        pending.forEach(task => pendingTasksList.appendChild(createTaskElement(task)));
        completed.forEach(task => completedTasksList.appendChild(createTaskElement(task)));
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item card priority-${task.priority}`;
        li.dataset.id = task.id;

        if (task.id === editingTaskId) {
            li.innerHTML = `
                <div class="task-edit-form">
                    <label>Descripción:</label>
                    <input type="text" value="${task.description}" class="edit-description" placeholder="Descripción">
                    <label>Responsable:</label>
                    <input type="text" value="${task.responsible}" class="edit-responsible" placeholder="Responsable">
                    <label>Fecha de vencimiento:</label>
                    <input type="date" value="${task.dueDate}" class="edit-dueDate">
                    <label>Prioridad:</label>
                    <select class="edit-priority">
                        <option value="Baja" ${task.priority === 'Baja' ? 'selected' : ''}>Baja</option>
                        <option value="Media" ${task.priority === 'Media' ? 'selected' : ''}>Media</option>
                        <option value="Alta" ${task.priority === 'Alta' ? 'selected' : ''}>Alta</option>
                    </select>
                    <label>Observaciones:</label>
                    <textarea class="edit-observations" placeholder="Observaciones">${task.observations}</textarea>
                    <div class="task-edit-actions">
                        <button class="action-btn save-btn" title="Guardar"><i class="fas fa-save"></i></button>
                        <button class="action-btn cancel-btn" title="Cancelar"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            `;
            li.querySelector('.save-btn').addEventListener('click', () => handleSaveEdit(task.id));
            li.querySelector('.cancel-btn').addEventListener('click', handleCancelEdit);
        } else {
            const isCompleted = task.status === 'Finalizado';
            li.innerHTML = `
                <div class="task-view">
                    <div class="task-item-header">
                        <h3>${task.description}</h3>
                        <div class="task-actions">
                            <select class="status-select">
                                <option value="No iniciado" ${task.status === 'No iniciado' ? 'selected' : ''}>No iniciado</option>
                                <option value="En proceso" ${task.status === 'En proceso' ? 'selected' : ''}>En proceso</option>
                                <option value="Depende de Alguien mas" ${task.status === 'Depende de Alguien mas' ? 'selected' : ''}>Depende de Alguien más</option>
                                <option value="Finalizado" ${task.status === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
                            </select>
                            ${!isCompleted ? `
                                <button class="action-btn edit-btn" title="Editar"><i class="fas fa-edit"></i></button>
                            ` : ''}
                            <button class="action-btn delete-btn" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                    <div class="task-details">
                        <span><strong>Responsable:</strong> ${task.responsible}</span>
                        <span><strong>Creada:</strong> ${task.creationDate} | <strong>Vencimiento:</strong> ${task.dueDate}</span>
                        ${task.observations ? `<span><strong>Observaciones:</strong> ${task.observations}</span>` : ''}
                    </div>
                </div>
            `;
            li.querySelector('.status-select').addEventListener('change', (e) => handleUpdateStatus(task.id, e.target.value));
            if (!isCompleted) {
                li.querySelector('.edit-btn').addEventListener('click', () => handleStartEdit(task.id));
            }
            li.querySelector('.delete-btn').addEventListener('click', () => handleDeleteTask(task.id));
        }
        return li;
    }

    function handleStartEdit(taskId) {
        if (taskForm.style.display === 'block') {
            hideAddTaskForm();
        }
        editingTaskId = taskId;
        renderTasks();
    }

    function handleCancelEdit() {
        editingTaskId = null;
        renderTasks();
    }

    function handleSaveEdit(taskId) {
        const task = tasks.find(t => t.id === taskId);
        const taskElement = document.querySelector(`li[data-id='${taskId}']`);

        if (task && taskElement) {
            task.description = taskElement.querySelector('.edit-description').value.trim();
            task.responsible = taskElement.querySelector('.edit-responsible').value.trim();
            task.dueDate = taskElement.querySelector('.edit-dueDate').value;
            task.priority = taskElement.querySelector('.edit-priority').value;
            task.observations = taskElement.querySelector('.edit-observations').value.trim();
        }

        editingTaskId = null;
        saveAndRender();
    }

    function handleUpdateStatus(taskId, newStatus) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            saveAndRender();
        }
    }

    function handleDeleteTask(taskId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            tasks = tasks.filter(t => t.id !== taskId);
            saveAndRender();
        }
    }

    renderTasks();
});
