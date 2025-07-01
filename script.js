// --- State Variables ---
let totalCount = 0;
let pending = 0;
let completed = 0;
let current_filter = "All";

// --- DOM Elements ---
const filter = document.querySelector(".filter");
const addTask = document.querySelector(".addTask");
const taskEdit = document.querySelector(".taskEdit");
const taskBox = document.querySelector(".taskBox");
const submit = document.querySelector(".submit");
const taskCounter = document.querySelector(".taskCounter");

// --- Utility Functions ---
function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

function taskEditValueRefresh() {
    taskEdit.querySelector(".taskEditTitle").innerHTML = "Add Task";
    taskEdit.querySelector(".submit").innerHTML = "Submit";
    taskEdit.querySelectorAll('input[type="text"], input[type="date"], input[type="time"]').forEach(input => {
        input.value = "";
    });
}

function countRefresher() {
    const tasks = document.querySelectorAll('.taskBox .task');
    completed = 0;
    tasks.forEach(task => {
        const checkbox = task.querySelector('.checkbox');
        if (checkbox && checkbox.classList.contains('active')) {
            completed++;
        }
    });
    pending = totalCount - completed;
    if (taskCounter) {
        taskCounter.innerHTML = `Pending: ${pending} ; Completed: ${completed}`;
    }
}

function taskAdder(name, date, time) {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `
        <div class="leftAligned">
            <div class="checkbox"><img src="tick.svg" draggable="false" alt=""></div>
            <div class="taskDetails">
                <div class="name">${name}</div>
                <div class="timing">${time}, ${date}</div>
            </div>
        </div>
        <div class="rightAligned">
            <div class="delete"><img src="delete.svg" draggable="false" alt=""></div>
            <div class="edit"><img src="edit.svg" draggable="false" alt=""></div>
        </div>
    `;
    taskBox.appendChild(div);
}

function convertToInputDate(dateStr) {
    // dateStr is like "1 July 2025"
    const [day, month, year] = dateStr.split(" ");
    const monthNum = new Date(`${month} 1, 2000`).getMonth() + 1;
    return `${year}-${monthNum.toString().padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function applyFilter() {
    const tasks = document.querySelectorAll('.taskBox .task');
    tasks.forEach(task => {
        const checkbox = task.querySelector('.checkbox');
        if (current_filter === "All") {
            task.style.display = "";
        } else if (current_filter === "Pending") {
            task.style.display = checkbox.classList.contains('active') ? "none" : "";
        } else if (current_filter === "Completed") {
            task.style.display = checkbox.classList.contains('active') ? "" : "none";
        }
    });
}

// --- Event Listeners ---
filter.addEventListener("click", function (e) {
    filter.classList.toggle("active");
    e.stopPropagation();
});

window.addEventListener("click", function (e) {
    if (!filter.contains(e.target)) {
        filter.classList.remove("active");
    }
    if (!taskEdit.contains(e.target) && !addTask.contains(e.target)) {
        taskEdit.classList.remove("active");
        taskEdit.classList.add("display:none");
    }
});

filter.querySelector(".item1").addEventListener("click", () => {
    filter.querySelector(".filterText").innerHTML = filter.querySelector(".item1").innerHTML;
    filter.querySelector(".item1").innerHTML = current_filter;
    current_filter = filter.querySelector(".filterText").innerHTML;
    applyFilter();
});

filter.querySelector(".item2").addEventListener("click", () => {
    filter.querySelector(".filterText").innerHTML = filter.querySelector(".item2").innerHTML;
    filter.querySelector(".item2").innerHTML = current_filter;
    current_filter = filter.querySelector(".filterText").innerHTML;
    applyFilter();
});

addTask.addEventListener("click", function (e) {
    taskEditValueRefresh();
    taskEdit.classList.add("active");
    e.stopPropagation();
});

submit.addEventListener("click", () => {
    const name = taskEdit.querySelector('input[type="text"]').value;
    const date = taskEdit.querySelector('input[type="date"]').value;
    const time = taskEdit.querySelector('input[type="time"]').value;
    if(submit.innerHTML == "Submit"){
        totalCount++;
        countRefresher();
        taskAdder(name, formatDate(date), time);
    }
    taskEdit.classList.remove("active");
});

taskBox.addEventListener("click", function (e) {
    if (e.target.classList.contains("checkbox") || e.target.closest(".checkbox")) {
        const checkbox = e.target.classList.contains("checkbox") ? e.target : e.target.closest(".checkbox");
        checkbox.classList.toggle("active");
        applyFilter();
        countRefresher();
        e.stopPropagation();
    } else if (e.target.classList.contains("delete") || e.target.closest(".delete")) {
        const toDelete = e.target.classList.contains("task") ? e.target : e.target.closest(".task");
        toDelete.remove();
        totalCount--;
        countRefresher();
    } else if (e.target.classList.contains("edit") || e.target.closest(".edit")) {
        taskEditValueRefresh();
        taskEdit.classList.add("active");
        taskEdit.querySelector(".taskEditTitle").innerHTML = "Edit Task";
        taskEdit.querySelector(".submit").innerHTML = "Edit";
        const taskElem = e.target.closest(".task");
        const nameElem = taskElem.querySelector(".name");
        const dateTimeElem = taskElem.querySelector(".timing");
        const [time,date] = dateTimeElem.innerHTML.split(", ");
        taskEdit.querySelector('input[type="text"]').value = nameElem.innerHTML;
        taskEdit.querySelector('input[type="date"]').value = convertToInputDate(date);
        taskEdit.querySelector('input[type="time"]').value = time;;

        
        submit.addEventListener("click", () => {
            if(submit.innerHTML == "Edit"){
                taskElem.querySelector(".name").innerHTML = taskEdit.querySelector('input[type="text"]').value;
                taskElem.querySelector(".timing").innerHTML = `${taskEdit.querySelector('input[type="time"]').value}, ${formatDate(taskEdit.querySelector('input[type="date"]').value)}`;    
            }
            taskEdit.classList.remove("active");
        });
        e.stopPropagation();    
    }
});


