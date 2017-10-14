"use strict";
(function TaskerApp() {
    var tasks;
    var form = document.getElementById('myForm');
    var downloadJson = document.getElementById('download');

    form.addEventListener('submit', saveTask);
    downloadJson.addEventListener('click', downloadTasks);
    fetchTasks();

    function saveTask(event) {
        var taskTitle = document.getElementById('taskTitle').value;
        var taskDesc = document.getElementById('taskDesc').value;

        if (!validateForm(taskTitle, taskDesc)) {
            event.preventDefault();
            return;
        }

        var task = {
            id: generateId(),
            title: taskTitle,
            description: taskDesc,
            completed: false
        };

        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        document.getElementById('myForm').reset();

        fetchTasks();

        event.preventDefault();
    }

    function generateId() {
        if (tasks.length > 0) {
            return tasks[tasks.length - 1].id + 1;
        } else {
            return 0;
        }
    }

    function deleteTask(id) {
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === id) {
                tasks.splice(i, 1);
            }
        }
        orderIds();
        if (tasks.length === 0) {
            localStorage.removeItem('tasks');
        } else {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        fetchTasks();
    }

    function orderIds() {
        for (var i = 0; i < tasks.length; i++) {
            tasks[i].id = i;
        }
    }

    function finishTask(id) {
        var tasks = JSON.parse(localStorage.getItem('tasks'));
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === id) {
                tasks[i].completed = !tasks[i].completed;
            }
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));

        fetchTasks();
    }

    function fetchTasks() {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        if (tasks) {
            var fragment = document.createDocumentFragment();
            var tasksResult = document.getElementById('tasksResults');
            tasksResult.innerHTML = '';

            for (var i = 0; i < tasks.length; i++) {
                var div = showTask(tasks, i);
                fragment.appendChild(div);
            }

            tasksResult.appendChild(fragment);
        }
    }

    function showTask(tasks, index) {
        var div = document.createElement('div');
        div.classList.add('well');

        if (tasks[index].completed) {
            div.classList.add('taskCompleted');
        }

        var headerSize3 = document.createElement('h3');
        var paragraph = document.createElement('p');
        var completeButton = document.createElement('button');
        var deleteButton = document.createElement('button');

        headerSize3.innerHTML = tasks[index].title;
        paragraph.innerHTML = tasks[index].description;

        completeButton.innerHTML = 'Completed';
        completeButton.classList.add('btn', 'btn-success', 'pull-right');
        completeButton.addEventListener('click', function () {
            finishTask(tasks[index].id);
        });

        deleteButton.innerHTML = 'Delete';
        deleteButton.classList.add('btn', 'btn-danger', 'pull-right', 'delete');
        deleteButton.addEventListener('click', function () {
            deleteTask(tasks[index].id);
        });

        div.appendChild(headerSize3);
        paragraph.appendChild(completeButton);
        paragraph.appendChild(deleteButton);
        div.appendChild(paragraph);

        return div;
    }

    function validateForm(taskTitle, taskDesc) {
        if (!taskTitle || !taskDesc) {
            alert('Please fill in the form');
            return false;
        }

        var expression = /[\d\D]{3,}/gi;
        var regex = new RegExp(expression);

        if (!taskDesc.match(regex)) {
            alert('Description should have at least 3 characters');
            return false;
        }

        return true;
    }

    function downloadTasks() {
        var container = document.querySelector('.container');
        var footer = document.querySelector('.footer');
        var pre = document.createElement('pre');
        pre.innerHTML = JSON.stringify(tasks, null, 2);
        var helper = document.createElement('a');
        helper.innerText = 'How to work with json?';
        helper.href = 'http://www.google.com/search?q=How+to+work+with+json';

        container.insertBefore(pre, footer);

        downloadJson.removeEventListener('click', downloadTasks);
        document.getElementById('json-block').innerHTML = "";
        document.getElementById('json-block').appendChild(helper);
    }
})();
