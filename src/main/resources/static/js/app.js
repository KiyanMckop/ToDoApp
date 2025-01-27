const apiUrl = "/api/todo";

// Get todos
function fetchTodos() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const todoList = document.querySelector("#todoList");
            todoList.innerHTML = ''; // Clear the list

            // Sort todos by dueDate and priority
            data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate) || b.priority.localeCompare(a.priority));

            data.forEach(todo => {
                const priorityColors = {
                    High: 'text-danger',
                    Medium: 'text-warning',
                    Low: 'text-success'
                };

                // create list item
                const todoItem = document.createElement('li');
                todoItem.className = 'list-group-item';

                //checkbox
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'form-check-input';
                checkbox.checked = todo.completed;
                checkbox.setAttribute('data-id', todo.id);
                checkbox.onclick = () => toggleComplete(todo.id, checkbox);

                //title
                const title = document.createElement('span');
                title.className = `todo-title ${todo.completed ? 'completed' : ''}`;
                title.textContent = todo.title;

                //priority Badge
                const priorityBadge = document.createElement('span');
                priorityBadge.className = `badge ${priorityColors[todo.priority]} ms-2`;
                priorityBadge.textContent = todo.priority;

                //buttons
                const editButton = document.createElement('button');
                editButton.className = 'btn btn-success btn-sm';
                editButton.textContent = 'Edit';
                editButton.onclick = () => editTodo(todo.id);

                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-danger btn-sm';
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteTodo(todo.id);

                //add elements to list
                todoItem.appendChild(checkbox);
                todoItem.appendChild(title);
                todoItem.appendChild(priorityBadge);
                todoItem.appendChild(editButton);
                todoItem.appendChild(deleteButton);

                todoList.appendChild(todoItem);
            });
        })
        .catch(error => console.error("Error fetching ToDos:", error));
}


//update completion for a todo
function toggleComplete(id, checkbox) {
    const completed = checkbox.checked;
    fetch(`${apiUrl}/${id}/complete`, {
        method: "PUT",
        body: JSON.stringify({ isCompleted: completed }), // Send updated status
        headers: { "Content-Type": "application/json" }
    })
    .then(() => {
        fetchTodos();
    })
    .catch(error => {
        console.error("Error toggling ToDo completion:", error);
    });
}

// add a todo
document.getElementById("addTodoForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const todo = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        dueDate: document.getElementById("dueDate").value,
        priority: document.getElementById("priority").value,
        isCompleted: false
    };

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
    }).then(() => {
        fetchTodos(); // Re-fetch and display the updated todo list
        this.reset();
        document.querySelector("#todoTabs a[href='#all-todos']").click();
    });
});

// delete a todo
function deleteTodo(id) {
    fetch(`${apiUrl}/${id}`, { method: "DELETE" }).then(() => fetchTodos());
}

// edit a todo
function editTodo(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(todo => {
            document.getElementById("editTodoId").value = todo.id;
            document.getElementById("editTitle").value = todo.title;
            document.getElementById("editDescription").value = todo.description;
            document.getElementById("editDueDate").value = todo.dueDate.split('T')[0]; // Format date
            document.getElementById("editPriority").value = todo.priority;
            document.querySelector("#editForm").classList.remove("d-none");
            document.querySelector("#todoTabs a[href='#edit-todo']").click();
        });
}

// save editing
document.getElementById("saveEditBtn").addEventListener("click", function () {
    const id = document.getElementById("editTodoId").value;
    const updatedTodo = {
        title: document.getElementById("editTitle").value,
        description: document.getElementById("editDescription").value,
        dueDate: document.getElementById("editDueDate").value,
        priority: document.getElementById("editPriority").value,
        isCompleted: false
    };
    fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTodo),
    }).then(() => {
        fetchTodos();
        document.querySelector("#todoTabs a[href='#all-todos']").click();
    });
});


document.addEventListener('DOMContentLoaded', (event) => {
    fetchTodos(); // fetch todos
});
