import tasks from "./data/tasks.js";

const TaskCard = document.getElementById("lists");

TaskCard.innerHTML = tasks
  .map((task, index) => {
    return `
      <div class="task-card" data-index="${index}">
        <div class="title-description">
          <h3>${task.title}</h3>
          <p>${
            task.description.length < 30
              ? task.description
              : task.description.slice(0, 30) + "...."
          }</p>
        </div>
        <div class="status-action">
          <div class="status">
            <small>${task.completed ? "✅ Done" : "⏳ Pending"}</small>
          </div>
          <div class="action"></div>
          <div class="edit"><i class="fa-solid fa-pen-to-square"></i></div>
          <div class="delete"><i class="fa-solid fa-trash"></i></div>
          <div class="complete-btn ${task.completed ? "active" : ""}">
            <i class="fa-solid fa-check-to-slot"></i>
          </div>
        </div>
      </div>
    `;
  })
  .join("");

const isCompleteHandle = (e) => {
  const isComplete = e.target.closest(".complete-btn");
  if (!isComplete) return;

  const card = isComplete.closest(".task-card");
  const index = card.dataset.index;

  // Toggle status
  tasks[index].completed = !tasks[index].completed;

  // Update UI
  isComplete.classList.toggle("active");
  const status = card.querySelector(".status small");
  status.textContent = tasks[index].completed ? "✅ Done" : "⏳ Pending";
};

const deleteHandle = (e) => {
  const deleteBtn = e.target.closest(".delete");

  if (deleteBtn) {
    const card = deleteBtn.closest(".task-card"); // ✅ use deleteBtn
    const index = card.dataset.index;

    // remove from array
    tasks.splice(index, 1);

    // remove from DOM
    card.remove();

    // re-index the remaining cards
    document.querySelectorAll(".task-card").forEach((c, i) => {
      c.dataset.index = i;
    });
  }
};

const renderTasks = (filter = "all") => {
  TaskCard.innerHTML = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true; // "all"
    })
    .map(
      (task, index) => `
      <div class="task-card" data-index="${index}">
        <div class="title-description">
          <h3>${task.title}</h3>
          <p>${
            task.description.length < 30
              ? task.description
              : task.description.slice(0, 30) + "...."
          }</p>
        </div>
        <div class="status-action">
          <div class="status">
            <small>${task.completed ? "✅ Done" : "⏳ Pending"}</small>
          </div>
          <div class="action"></div>
          <div class="edit"><i class="fa-solid fa-pen-to-square"></i></div>
          <div class="delete"><i class="fa-solid fa-trash"></i></div>
          <div class="complete-btn ${task.completed ? "active" : ""}">
            <i class="fa-solid fa-check-to-slot"></i>
          </div>
        </div>
      </div>
    `
    )
    .join("");
};


// Select it
// Select containers
const editContainer = document.getElementById("edit");
const createContainer = document.getElementById("create");

// --- EDIT MODAL ---
const editHandler = (e) => {
  const editBtn = e.target.closest(".edit");
  if (!editBtn) return;

  const card = editBtn.closest(".task-card");
  const index = card.dataset.index;
  const task = tasks[index];

  editContainer.innerHTML = `
    <div class="editCard">
      <div class="close">
        <h1>Edit Note</h1>
        <i class="fa-solid fa-xmark"></i>
      </div>
      <form id="editForm">
        <div><input type="text" id="editTitle" value="${task.title}" /></div>
        <div><textarea rows=6 id="editDescription">${task.description}</textarea></div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  `;
  editContainer.style.display = "flex";

  // Save changes
  document.getElementById("editForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    task.title = document.getElementById("editTitle").value;
    task.description = document.getElementById("editDescription").value;
    renderTasks();
    closeModal(editContainer);
  });

  attachModalCloseHandlers(editContainer);
};

// --- CREATE MODAL ---
const createNoteHandler = (e) => {
  const createBtn = e.target.closest(".add-box div");
  if (!createBtn) return;

  createContainer.innerHTML = `
  <div class="editCard">
    <div class="close">
      <h1>Create Note</h1>
      <i class="fa-solid fa-xmark"></i>
    </div>
    <form id="createForm">
      <div><input type="text" id="createTitle" placeholder="Title" /></div>
      <div><textarea rows=6 id="createDescription" placeholder="Write your tasks here"></textarea></div>
      <button type="submit">Create Task</button>
    </form>
  </div>
`;
  createContainer.style.display = "flex";

  // Save new task
  document.getElementById("createForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const title = document.getElementById("createTitle").value;
    const description = document.getElementById("createDescription").value;

    if(title.trim() === "") return alert("Title cannot be empty");

    tasks.push({ title, description, completed: false });
    renderTasks();
    closeModal(createContainer);
  });

  attachModalCloseHandlers(createContainer);
};

// --- HELPER TO CLOSE MODALS ---
const closeModal = (container) => {
  container.style.display = "none";
  container.innerHTML = "";
};

// Attach close handlers (X icon + outside click)
const attachModalCloseHandlers = (container) => {
  const closeBtn = container.querySelector(".close i");
  if(closeBtn) {
    closeBtn.addEventListener("click", () => closeModal(container));
  }

  container.addEventListener("click", (ev) => {
    if(ev.target === container) {
      closeModal(container);
    }
  });
};


document.querySelector(".add-box div").addEventListener("click", createNoteHandler);

document
  .querySelector(".menu-option.home")
  .addEventListener("click", () => renderTasks("all"));
document
  .querySelector(".menu-option.pending")
  .addEventListener("click", () => renderTasks("pending"));
  document
    .querySelector(".menu-option.completed")
    .addEventListener("click", () => renderTasks("completed"));
  
TaskCard.addEventListener("click", (e) => {
  e.preventDefault();
  isCompleteHandle(e);
  deleteHandle(e);
  editHandler(e)
  createNoteHandler(e)
});

