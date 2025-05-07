document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    
    // Cargar tareas desde localStorage al iniciar
    loadTasks();
    
    // Añadir nueva tarea
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            // Crear elemento de tarea
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            
            // Checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            
            // Texto de la tarea
            const taskSpan = document.createElement('span');
            taskSpan.className = 'task-text';
            taskSpan.textContent = taskText;
            
            // Botón de completar
            const completeBtn = document.createElement('button');
            completeBtn.className = 'complete-btn';
            completeBtn.textContent = 'Completada';
            
            // Evento para marcar como completada
            completeBtn.addEventListener('click', function() {
                taskItem.classList.add('completed');
                setTimeout(() => {
                    taskItem.remove();
                    saveTasks();
                }, 500);
            });
            
            // Construir el elemento
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskSpan);
            taskItem.appendChild(completeBtn);
            
            // Añadir a la lista
            taskList.appendChild(taskItem);
            
            // Limpiar input
            taskInput.value = '';
            
            // Guardar tareas
            saveTasks();
        }
    }
    
    // Guardar tareas en localStorage
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(taskItem => {
            const text = taskItem.querySelector('.task-text').textContent;
            const isCompleted = taskItem.classList.contains('completed');
            tasks.push({ text, isCompleted });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Cargar tareas desde localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            tasks.forEach(task => {
                if (!task.isCompleted) {
                    const taskItem = document.createElement('li');
                    taskItem.className = 'task-item';
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'task-checkbox';
                    
                    const taskSpan = document.createElement('span');
                    taskSpan.className = 'task-text';
                    taskSpan.textContent = task.text;
                    
                    const completeBtn = document.createElement('button');
                    completeBtn.className = 'complete-btn';
                    completeBtn.textContent = 'Completada';
                    
                    completeBtn.addEventListener('click', function() {
                        taskItem.classList.add('completed');
                        setTimeout(() => {
                            taskItem.remove();
                            saveTasks();
                        }, 500);
                    });
                    
                    taskItem.appendChild(checkbox);
                    taskItem.appendChild(taskSpan);
                    taskItem.appendChild(completeBtn);
                    
                    taskList.appendChild(taskItem);
                }
            });
        }
    }
});