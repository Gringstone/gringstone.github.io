const tasks = [
  { text: "Buy groceries", date: "2026-10-22" },
  { text: "Finish the lab report and send it to the teacher before the deadline", date: "2026-10-25" },
  { text: "Call mom", date: "2025-01-20" },
  { text: "Gym", date: "2026-10-30" },
];

const list = document.querySelector(".screen");

function renderList() {
  list.replaceChildren();

  for (const task of tasks) {
    const item = document.createElement("div");
    item.className = "item";

    const text = document.createElement("span");
    text.className = "item-text";
    text.textContent = task.text;
    text.addEventListener("click", () => editField(text, task, "text", "text"));

    const date = document.createElement("span");
    date.className = "item-date";
    date.textContent = task.date;
    date.addEventListener("click", () => editField(date, task, "date", "date"));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove";
    remove.addEventListener("click", () => {
      tasks.splice(tasks.indexOf(task), 1);
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
    task[key] = input.value;
    renderList();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
  });

  span.replaceWith(input);
  input.focus();
}

renderList();
