import { addTodo, removeTodo, doTodo , getAllTodos} from "../Redux/actions.js";

import {
  getAllTodosAction,
  addTodoAction,
  removeTodoAction,
  doTodoAction,
} from "../Redux/actionCreators.js";

window.removeTodoHandler = removeTodoHandler;
window.doTodoHandler = doTodoHandler;

const todoInputElem = document.querySelector(".todo-input");
const addTodoBtn = document.querySelector(".todo-button");
const todosContainer = document.querySelector(".todo-list");
const todoFilteringElem = document.querySelector(".filter-todo")

// Create Todolist Reducer
function todolistReducer(state = [], action) {
  switch (action.type) {
    case getAllTodos: {
        return state;
    }
    case addTodo: {
      let newState = [...state];
      let newTodoObj = {
        id: crypto.randomUUID(),
        title: action.title,
        isCompleted: false,
      };
      newState.push(newTodoObj);
      return newState;
    }
    case removeTodo: {
      const newState = [...state];
      const finallyState = newState.filter((todo) => todo.id !== action.id);
      return finallyState;
    }
    case doTodo: {
      const newState = [...state];
      newState.some((todo) => {
        if (todo.id === action.id) {
          todo.isCompleted = !todo.isCompleted;
        }
      });
      return newState;
    }
    default: {
      return state;
    }
  }
}

// Create Store
const store = Redux.createStore(todolistReducer);
console.log(store);

addTodoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const newTodoTitle = todoInputElem.value.trim();
  store.dispatch(addTodoAction(newTodoTitle));
  const todos = store.getState();
  todoInputElem.value = "";
  generateTodosInDom(todos);
});

todoFilteringElem.addEventListener('change' , (e) => {
    store.dispatch(getAllTodosAction())
    const todos = store.getState()
    
    //Deriving Data (Dont Filtering In Reduser)
    if(e.target.value === 'all'){
        generateTodosInDom(todos);
    }
    else if(e.target.value === 'completed'){
        let completedTodos = todos.filter(todo => todo.isCompleted)
        generateTodosInDom(completedTodos)
    }
    else if(e.target.value === 'incomplete'){
        let inCompletedTodos = todos.filter(todo => !todo.isCompleted)
        generateTodosInDom(inCompletedTodos)
    }
})

function removeTodoHandler(todoId) {
  store.dispatch(removeTodoAction(todoId));
  const todos = store.getState();
  generateTodosInDom(todos);
}

function doTodoHandler(todoId) {
  store.dispatch(doTodoAction(todoId));
  const todos = store.getState();
  generateTodosInDom(todos);
}

function generateTodosInDom(todos) {
  todosContainer.innerHTML = "";
  todos.forEach((todo) => {
    todosContainer.insertAdjacentHTML(
      "beforeend",
    `
        <div class="todo ${todo.isCompleted && "completed"}">
          <li class="todo-item">${todo.title}</li>
          <button class="complete-btn" onclick=doTodoHandler("${todo.id}")>
            <i class="fas fa-check-circle"></i>
          </button>
          <button class="trash-btn" onclick=removeTodoHandler("${todo.id}")>
            <i class="fas fa-trash"></i>
          </button>
        </div>
    `
    );
  });
}
