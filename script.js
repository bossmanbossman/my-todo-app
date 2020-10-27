//store todo items
let todoItems = [];
//function to create new todo items and renders on the page
function renderTodo(todo) {
//store todo items into browser storage
  localStorage.setItem("todoItem", JSON.stringify(todoItems));
  const list = document.querySelector(".js-todo-list");
  const item = document.querySelector(`[data-key='${todo.id}']`);
//runs a check for deleted items and update the DOM
  if (todo.deleted) {
    item.remove();
    if (todoItems.length === 0) list.innerHTML = "";
    return;
  }
//evaluate the DOM state of a todo entry
  const isChecked = todo.checked ? "done" : "";
//creates a list item that holds todo entry
  const listItemElement = document.createElement("li");
//set class and data-key attribute to the todo entry
  listItemElement.setAttribute("class", `todo-item ${isChecked}`);
  listItemElement.setAttribute("data-key", todo.id);
//populates the todo entry with required values  
  listItemElement.innerHTML = `
    <input id="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${(todo.text)}</span>
    <button class="delete-todo js-delete-todo">
    &times
     </button>
    `;
//run condition to append the created item to the page    
  if (item) {
    list.replaceChild(listItemElement, item);
  } else {
    list.append(listItemElement);
  }
}
//define function to create a new todo entry
function addTodo(text) {
//define todo entry object structure    
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };
//add new todo entry to the array collection  
  todoItems.push(todo);
//trigger page update by invoking the render todo function  
  renderTodo(todo);
}
//get reference of todo entry form element
const form = document.querySelector(".js-form");
//bind an event listener on form submission
form.addEventListener("submit", (event) => {
//prevent default behaviour of form submission
  event.preventDefault();
//get reference of the input element 
  const input = document.querySelector(".js-todo-input");
//remove wide space on both end of the todo entry string
  const text = input.value.trim();
//check for empty value and create todo item  
  if (text !== "") {
//invoke function to commit change      
    addTodo(text);
//reset the value of the input element    
    input.value = "";
//set focus to the input element    
    input.focus();
  }
});
//define function to toggle the DOM state of a todo entry 
function toggleDone (key) {
//retrieve the index of the todo entry in the collection    
    const index = todoItems.findIndex((item) => item.id === Number(key));
//toggle the check attribute value of the todo entry    
    todoItems[index].checked = !todoItems[index].checked;
//trigger page update by invoking the renderTodo function    
    renderTodo(todoItems[index]);
}
//define function to delete a todo entrys
function deleteTodo(key) {
//retrieve the index of the todo entry in the collection    
    const index = todoItems.findIndex((item) => item.id === Number(key));
//set delete attribute to true for the todo entry    
    const todo = {
        deleted: true,
        ...todoItems[index],
    };
    todoItems = todoItems.filter((item)=>item.id !== Number(key));    
//trigger page update by invoking render function    
    renderTodo(todo);

}
//get reference to ulElement
const list = document.querySelector(".js-todo-list");
//bind clikck eventListerner to ulElement
list.addEventListener("click", (event) => {
//traverse the DOM to check for the class name ""js-tick"" and invoke the toggle done function if check return true 
    if (event.target.classList.contains("js-tick")) {
//retrieve the data key attribute value        
        const itemkey = event.target.parentElement.dataset.key;
//invoke toggle done function to update todo entry state
        toggleDone(itemkey);
    }
//traverse DOM to check for class name "js-delete-todo" and invoke the delete todo function if check returns true
    if (event.target.classList.contains("js-delete-todo")) {
//retrieve the data key attribute value
        const itemKey = event.target.parentElement.dataset.key;
//invoke deleteTodo function to delete a todo entrys        
        deleteTodo(itemKey);
    }

});
//binds eventListener of DOM content loaded to document object
document.addEventListener("DOMcontentLoaded", () => {
//get stored todo entry from browser local storage    
    const ref = localStorage.getItem("todoItems");
//check that we haveentries in the local storage    
    if (ref) {
//converts todo entries to an array collection        
        todoItems = JSON.parse(ref);
//iterate through the collection and update the web page        
        todoItems.forEach((t) => {
            renderTodo(t);
        });
    }
});