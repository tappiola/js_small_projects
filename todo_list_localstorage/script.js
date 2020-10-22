const newTodoInput = document.getElementById('new-todo');
const addButton = document.getElementById('add-button');
const todosList = document.querySelector('.todos-list');
const categoriesTabsSection = document.querySelector('ul.categories');
const categoryMain = document.getElementById('category');

const saveTodos = (todos) => {
    localStorage.todos = JSON.stringify(todos);
}

const retrieveTodos = () => {
    return JSON.parse(localStorage.todos);
}

let todos = [];
if (localStorage.getItem('todos')) {
    todos = retrieveTodos();
} else {
    saveTodos([]);
}


const allTodosCategory = 'All';
const categories = [allTodosCategory, 'Family', 'Work', 'Vacation', 'Payment'];
let currentCategory = allTodosCategory;

const addTabs = () => {
    for (const category of categories) {
        const li = document.createElement('li');
        li.classList.add('nav-item', 'category');
        const a = document.createElement('a');
        a.classList.add('nav-link');
        if (category === categories[0]) {
            a.classList.add('active');
        }
        a.textContent = category;
        a.href = '#' + category.toLowerCase();
        li.append(a);
        categoriesTabsSection.append(li);
    }
}

const addCategoryDropdown = (parent) => {
    for (const category of categories) {
        if (category !== allTodosCategory) {
            const a = document.createElement('a');
            a.className = 'dropdown-item';
            a.href = '#';
            a.textContent = category;

            a.addEventListener('click', () => {
                parent.querySelector('.dropdown-toggle').innerText = category;
                parent.querySelector('button').value = category;
            });

            parent.querySelector('.dropdown-menu').append(a);
        }
    }
}

const resetNewTodoInput = () => {
    newTodoInput.value = '';
    categoryMain.querySelector('button').value = '';
    categoryMain.querySelector('.dropdown-toggle').innerText = 'Category';
}

const newTodoHandler = () => {

    const inputText = newTodoInput.value.trim();

    if (!inputText) {
        return
    }

    const todoCategory = categoryMain.querySelector('button').value;

    if (currentCategory !== todoCategory && currentCategory !== allTodosCategory){
        const categoryTab = Array.from(document.querySelectorAll('.category a'))
            .find(el => el.textContent === todoCategory);
        switchToCategory(categoryTab);
    }

    const newTodo = {
        id: String(Math.random()),
        text: inputText,
        complete: false,
        category: todoCategory === '' ? null : todoCategory
    }
    todos.push(newTodo);
    saveTodos(todos);
    console.log(todos);

    resetNewTodoInput();
    if (currentCategory === allTodosCategory || currentCategory === newTodo.category) {
        renderTodo(newTodo);
    }
}

const renderTodo = (todo) => {

    const createCheckbox = () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'todo-checkbox';
        checkbox.className = "form-check-input";
        return checkbox;
    }

    const createLabel = () => {
        const label = document.createElement('label');
        label.htmlFor = 'todo-checkbox';
        label.className = 'form-check-label';
        if (todo.complete) {
            li.classList.add('complete');
            checkbox.checked = true;
        }
        label.textContent = todo.text;
        label.style.fontWeight = 'normal';
        return label;
    }

    const createEditButton = () => {
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('btn', 'btn-primary', 'edit-button');
        return editButton;
    }

    const createDeleteButton = () => {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('btn', 'btn-danger');
        return deleteButton;
    }

    const addButtons = (li, ...buttons) => {
        const buttonsGroup = document.createElement('span');
        buttonsGroup.classList.add('btn-group', 'delete-button');
        buttonsGroup.append(...buttons);
        buttonsGroup.class = 'input-group-btn';
        li.append(todoContent, buttonsGroup);
    }

    const li = document.createElement('li');
    li.classList.add('todo-item', 'list-group-item', 'input-group');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';

    const checkbox = createCheckbox();
    const label = createLabel();
    const todoContent = document.createElement('div');
    todoContent.append(checkbox, label);
    todoContent.classList.add('todo-content');

    const editButton = createEditButton();
    const deleteButton = createDeleteButton();
    addButtons(li, editButton, deleteButton);
    todosList.prepend(li);

    checkbox.addEventListener('change', clickCheckboxHandler.bind(this, todo.id));
    editButton.addEventListener('click', editTodoHandler.bind(this, todo.id));
    deleteButton.addEventListener('click', deleteTodoHandler.bind(this, todo.id));
}

const clickCheckboxHandler = (id, event) => {
    const li = event.target.closest('li');
    li.classList.toggle('complete');
    const ul = li.closest('ul');
    let newValue;
    if (li.classList.contains('complete')) {
        ul.append(li);
        newValue = true;
    } else {
        ul.prepend(li);
        newValue = false;
    }

    todos = todos.map(item => item.id === id ? {...item, complete: newValue} : item);
    saveTodos(todos);
    console.log(todos);
}

const deleteTodoHandler = (id, event) => {
    const li = event.target.closest('li');
    li.remove();

    todos = todos.filter(item => item.id !== id);
    saveTodos(todos);
    console.log(todos);
}

const editTodoHandler = (id, event) => {
    const createInput = (currentValue) => {
        const input = document.createElement('input');
        input.style.marginLeft = '5px';
        input.value = currentValue;
        return input;
    }

    const createSubmitButton = (li) => {
        const submitButton = document.createElement('button');
        submitButton.classList.add('btn', 'btn-success', 'submit-button');
        submitButton.textContent = 'Submit';
        return submitButton;
    }

    const createCancelButton = () => {
        const cancelButton = document.createElement('button');
        cancelButton.classList.add('btn', 'cancel-button');
        cancelButton.style.color = 'white';
        cancelButton.style.backgroundColor = 'gray';
        cancelButton.textContent = 'Cancel';
        return cancelButton;
    }

    const li = event.target.closest('li');
    const label = li.querySelector('label');
    const currentValue = label.textContent;
    const input = createInput(currentValue);
    label.replaceWith(input);

    const submitButton = createSubmitButton(li);
    const editButton = li.querySelector('.edit-button');
    editButton.replaceWith(submitButton);

    const cancelButton = createCancelButton();
    li.querySelector('.btn-group').prepend(cancelButton);

    const revert = () => {
        input.replaceWith(label);
        submitButton.replaceWith(editButton);
        cancelButton.remove();
    }

    cancelButton.addEventListener('click', revert);

    submitButton.addEventListener('click', () => {
        const newValue = input.value
        label.textContent = newValue;
        revert();

        todos = todos.map(item => item.id === id ? {...item, text: newValue} : item);
        saveTodos(todos);
        console.log(todos);
    });
}

const renderTodos = () => {
    todosList.innerHTML = '';
    todos
        .filter(todo => currentCategory === allTodosCategory || currentCategory === todo.category)
        .sort(todo => todo.complete ? -1 : 1)
        .forEach(todo => renderTodo(todo));
    console.log(todos);
}

const switchToCategory = (el) => {
    const allTabs = document.querySelectorAll('.nav-link.active');
    allTabs.forEach(tab => tab.classList.remove('active'));

    el.classList.add('active');

    currentCategory = el.textContent;
    renderTodos();
}

const switchCategoryHandler = (event) => {
    switchToCategory(event.target)
}

addTabs();
addCategoryDropdown(categoryMain);
renderTodos();
addButton.addEventListener('click', newTodoHandler);
const categoriesTabs = document.querySelectorAll('.categories > li');
for (const category of categoriesTabs) {
    category.addEventListener('click', switchCategoryHandler);
}
