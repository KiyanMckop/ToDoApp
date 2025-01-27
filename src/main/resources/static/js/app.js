const apiUrl = "/api/todo";

// Get todos
function fetchTodos() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const todoList = document.querySelector("#todoList");
            todoList.innerHTML = ''; // clear the list

            // sort todos by dueDate and priority
            data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate) || b.priority.localeCompare(a.priority));

            data.forEach(todo => {
                // create the list item for each todo
                console.log(todo.completed);
                const todoItem = `
                    <li class="list-group-item">
                        <input type="checkbox" class="form-check-input"
                               ${todo.completed ? 'checked' : ''}
                               data-id="${todo.id}" onclick="toggleComplete(${todo.id}, this)">
                        <span class="todo-title ${todo.isCompleted ? 'completed' : ''}">${todo.title}</span>
                        <button class="btn btn-success btn-sm" onclick="editTodo(${todo.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTodo(${todo.id})">Delete</button>
                    </li>
                `;
                todoList.innerHTML += todoItem; // add to the list
            });
        })
        .catch(error => console.error("Error fetching ToDos:", error));
}

// Toggle completion status for a todo
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

// Initialize the app when the document is loaded
document.addEventListener('DOMContentLoaded', (event) => {
    fetchTodos(); // fetch todos
});
