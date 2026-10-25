//Całość wygenerowana, poza rozdzieleniem funkcji odpowiadających za logikę od funkcji tworzącej elementy wizualne, czyli głównie renderList.
//Claude domyślnie nie używał stylów w JS, a jedynie przypisywał selektory klas z pliku css
const tasks = [];

const STORAGE_KEY = "tasks";

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {}
}

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) tasks.splice(0, tasks.length, ...saved);
  } catch {}
}

function isValidTask(text, date) {
  if (text.length < 3 || text.length > 255) return false;
  return date === "" || new Date(date + "T00:00") > new Date();
}

function addTask(text, date) {
  tasks.push({ text, date });
  saveTasks();
}

function removeTask(task) {
  tasks.splice(tasks.indexOf(task), 1);
  saveTasks();
}

function updateTask(task, key, value) {
  task[key] = value;
  saveTasks();
}

const list = document.querySelector(".screen");
const search = document.querySelector(".search");

search.addEventListener("input", renderList);

function highlight(span, text, query) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) {
    span.textContent = text;
    return;
  }

  const match = document.createElement("mark");
  match.textContent = text.slice(index, index + query.length);
  span.append(text.slice(0, index), match, text.slice(index + query.length));
}

function renderList() {
  list.replaceChildren();

  const query = search.value.length >= 2 ? search.value : "";

  for (const task of tasks) {
    if (query && !task.text.toLowerCase().includes(query.toLowerCase())) continue;

    const item = document.createElement("div");
    item.className = "item";

    const text = document.createElement("span");
    text.className = "item-text";
    if (query) highlight(text, task.text, query);
    else text.textContent = task.text;
    text.addEventListener("click", () => editField(text, task, "text", "text"));

    const date = document.createElement("span");
    date.className = "item-date";
    date.textContent = task.date;
    date.addEventListener("click", () => editField(date, task, "date", "date"));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove";
    remove.addEventListener("click", () => {
      removeTask(task);
      renderList();
    });

    item.append(text, date, remove);
    list.append(item);
  }
}

function editField(span, task, key, type) {
  const input = document.createElement("input");
  input.type = type;
  input.className = span.className;
  input.value = task[key];

  input.addEventListener("blur", () => {
    updateTask(task, key, input.value);
    renderList();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
  });

  span.replaceWith(input);
  input.focus();
}

const addForm = document.querySelector(".add");
const addText = document.querySelector(".add-text");
const addDate = document.querySelector(".add-date");

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = addText.value.trim();
  if (!isValidTask(text, addDate.value)) return;
  addTask(text, addDate.value);
  addForm.reset();
  renderList();
});

loadTasks();
renderList();
