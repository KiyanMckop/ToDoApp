const apiUrl = "/api/todo";

// get todos
function fetchTodos() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const todoList = document.querySelector("#todoList");
            todoList.innerHTML = '';

            // sort by dueDate and priority
            data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate) || b.priority.localeCompare(a.priority));

            data.forEach(todo => {
                const todoItem = `
                    <li class="list-group-item">
                        <input type="checkbox" class="form-check-input"
                               ${todo.isCompleted ? 'checked' : ''}
                               onclick="toggleComplete(${todo.id})">
                        <span class="todo-title">${todo.title}</span>
                        <button class="btn btn-success btn-sm" onclick="editTodo(${todo.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTodo(${todo.id})">Delete</button>
                    </li>
                `;
                todoList.innerHTML += todoItem;
            });
        })
        .catch(error => console.error("Error fetching ToDos:", error));
}


// add todo
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
        fetchTodos();
        this.reset();
        document.querySelector("#todoTabs a[href='#all-todos']").click();
    });
});

// delete a todo
function deleteTodo(id) {
    fetch(`${apiUrl}/${id}`, { method: "DELETE" }).then(() => fetchTodos());
}

// edit todo
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

// Save changes after editing
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

// todo completion
function toggleComplete(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(todo => {
            todo.isCompleted = !todo.isCompleted;

            fetch(`${apiUrl}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(todo),
            })
            .then(() => fetchTodos())
            .catch(error => console.error("Error updating ToDo completion:", error));
        })
        .catch(error => console.error("Error fetching ToDo:", error));
}



// Initialize
document.addEventListener('DOMContentLoaded', (event) => {
    fetchTodos();
});

