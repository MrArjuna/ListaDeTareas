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
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            
            const taskSpan = document.createElement('span');
            taskSpan.className = 'task-text';
            taskSpan.textContent = taskText;
            
            const completeBtn = document.createElement('button');
            completeBtn.className = 'complete-btn';
            completeBtn.textContent = 'Completada';
            
            completeBtn.addEventListener('click', function() {
                taskItem.classList.add('completed');
                // Mover a sección de completadas en lugar de eliminar
                moveToCompleted(taskItem);
                saveTasks();
            });
            
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskSpan);
            taskItem.appendChild(completeBtn);
            
            taskList.appendChild(taskItem);
            taskInput.value = '';
            saveTasks();
        }
    }
    

    function moveToCompleted(taskItem) {
        const completedList = document.getElementById('completedList') || createCompletedSection();
        taskItem.querySelector('.complete-btn').remove();
        completedList.appendChild(taskItem);
    }
    
    function createCompletedSection() {
        const section = document.createElement('div');
        section.className = 'completed-section';
        
        const title = document.createElement('h2');
        title.textContent = 'Tareas Completadas';
        
        const list = document.createElement('ul');
        list.id = 'completedList';
        
        section.appendChild(title);
        section.appendChild(list);
        document.querySelector('.todo-container').appendChild(section);
        
        return list;
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


    document.getElementById('clearCompletedBtn').addEventListener('click', () => {
        document.querySelectorAll('#completedList .task-item').forEach(item => item.remove());
        saveTasks();
    });
    
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