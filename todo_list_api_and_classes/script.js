const ALL_TODOS_CATEGORY = 'All';
const ALL_CATEGORIES = [ALL_TODOS_CATEGORY, 'Family', 'Work', 'Vacation', 'Payment'];

let state = {
    todos: [],
    currentCategory: ALL_TODOS_CATEGORY
}

class TodoHeader {

    constructor() {
        this.categoryMain = document.getElementById('category');
        this.newTodoInput = document.getElementById('new-todo');
        this.addButton = document.getElementById('add-button');

        this.initCategoryDropdown();

        this.addButton.addEventListener('click', this.newTodoHandler);
    }

    initCategoryDropdown = () => {
        for (const category of ALL_CATEGORIES) {
            if (category !== ALL_TODOS_CATEGORY) {
                const a = document.createElement('a');
                a.className = 'dropdown-item';
                a.href = '#';
                a.textContent = category;

                a.addEventListener('click', () => {
                    this.categoryMain.querySelector('.dropdown-toggle').innerText = category;
                    this.categoryMain.querySelector('button').value = category;
                });

                this.categoryMain.querySelector('.dropdown-menu').append(a);
            }
        }
    }

    newTodoHandler = async () => {
        const inputText = this.newTodoInput.value.trim();

        if (!inputText) {
            return
        }

        const todoCategory = this.categoryMain.querySelector('button').value;

        if (state.currentCategory !== todoCategory && state.currentCategory !== ALL_TODOS_CATEGORY) {
            const categoryTab = Array.from(document.querySelectorAll('.category a'))
                .find(el => el.textContent === todoCategory);
            categoryTab.click();
        }

        const newTodoData = {
            title: inputText,
            done: false,
            category: todoCategory === '' ? null : todoCategory
        }
        const newTodoResponse = await ApiClient.createTodo(newTodoData);
        newTodoData.id = newTodoResponse.id;

        const newTodo = new TodoItem(newTodoData);
        state.todos.push(newTodo);
        console.log(state.todos);

        this.resetNewTodoInput();
        if (state.currentCategory === ALL_TODOS_CATEGORY || state.currentCategory === newTodo.category) {
            const todosListElement = document.querySelector('.todos-list');
            newTodo.render(todosListElement);
        }
    }

    resetNewTodoInput = () => {
        this.newTodoInput.value = '';
        this.categoryMain.querySelector('button').value = '';
        this.categoryMain.querySelector('.dropdown-toggle').innerText = 'Category';
    }
}

class CategoryTab {

    constructor(parentNode, category) {
        this.parentNode = parentNode;
        this.category = category;

        this.todosListElement = document.querySelector('.todos-list');
        this.initTab();
    }

    initTab = () => {
        const li = document.createElement('li');
        li.classList.add('nav-item', 'category');

        const a = document.createElement('a');
        a.classList.add('nav-link');
        a.textContent = this.category;
        a.href = '#' + this.category.toLowerCase();
        li.append(a);

        li.addEventListener('click', this.switchToCategoryHandler);

        this.tabElement = li;
        this.parentNode.append(li);
    }

    setActive = () => {
        this.tabElement.querySelector('a').classList.add('active');
        this.renderTodoItems(state.todos);
    }

    setInactive = (allTabs) => {
        allTabs.forEach(x => x.tabElement.querySelector('a').classList.remove('active'));
    }

    setInactiveFunction(switchHandlerFunction) {
        this.setInactiveHandler = switchHandlerFunction;
    }

    renderTodoItems = (todoItems) => {
        this.todosListElement.innerHTML = '';
        todoItems
            .filter(todo => this.category === ALL_TODOS_CATEGORY || this.category === todo.category)
            .sort(todo => todo.done ? -1 : 1)
            .forEach(todo => todo.render(this.todosListElement));
        console.log(todoItems);
    }

    switchToCategoryHandler = () => {

        this.setInactiveHandler();
        this.setActive();
        state.currentCategory = this.category;
    }
}

class TodoSection {

    constructor() {
        this.categoriesTabsSection = document.querySelector('ul.categories');
        this.fetchTodoItems().then(x => this.initTabs()); m
    }

    initTabs = () => {
        this.allTabs = ALL_CATEGORIES.map(item => new CategoryTab(this.categoriesTabsSection, item))

        const allTodosTab = this.allTabs.filter(t => t.category === ALL_TODOS_CATEGORY)[0];
        allTodosTab.setActive();

        this.allTabs.forEach(x => x.setInactiveFunction(x.setInactive.bind(this, this.allTabs)));
    }

    fetchTodoItems = async () => {
        let apiTodos = await ApiClient.retrieveTodos();
        state.todos = apiTodos.map(item => new TodoItem(item))
    }
}

class TodoItem {
    constructor(apiTodo) {
        this.id = apiTodo.id;
        this.category = apiTodo.category;
        this.title = apiTodo.title;
        this.done = apiTodo.done;
    }

    render = (parentNode) => {
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
            if (this.done) {
                li.classList.add('complete');
                checkbox.checked = true;
            }
            label.textContent = this.title;
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
        parentNode.prepend(li);

        checkbox.addEventListener('change', this.clickCheckboxHandler.bind(this, this.id));
        editButton.addEventListener('click', this.editTodoHandler.bind(this, this.id));
        deleteButton.addEventListener('click', this.deleteTodoHandler.bind(this, this.id));
    }

    clickCheckboxHandler = async (id, event) => {
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

        state.todos = state.todos.map(item => item.id === id ? {...item, complete: newValue} : item);
        await ApiClient.updateTodo(id, {done: newValue})
        console.log(state.todos);
    }

    deleteTodoHandler = async (id, event) => {
        const li = event.target.closest('li');
        li.remove();

        state.todos = state.todos.filter(item => item.id !== id);
        await ApiClient.deleteTodo(id);
        console.log(state.todos);
    }

    editTodoHandler = (id, event) => {
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

        submitButton.addEventListener('click', async () => {
            const newValue = input.value
            label.textContent = newValue;
            revert();

            state.todos = state.todos.map(item => item.id === id ? {...item, title: newValue} : item);
            await ApiClient.updateTodo(id, {'title': newValue});
            console.log(state.todos);
        });
    }
}


new TodoHeader();
new TodoSection();
