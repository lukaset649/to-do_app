//uruchomienie skryptu po pełnym załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
    //Pobranie elementów z DOM
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementsById("taskList");

    //Obsługa asynchronicznego dodawania
    taskForm.addEventListener("submit", async (event) => {
        //zatrzymanie standardowego wysłania formularza do serwera
        event.preventDefault();

        //pobranie zawartości pola tekstowego z usunięciem białych znaków na początku i końcu
        const taskText = taskInput.value.trim();
        if (!taskText){
            alert("Wprowadź nazwę zadania");
            return;
        }

        //wysłanie żądania z danymi JSON do serwera
        const response = await fetch("/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: taskText})
        });

        //Obsługa odpowiedzi z serwera
        if (response.ok){
            //oczekuje na odpowiedź i przekształca ją na json
            const data = await response.json();

            //dodanie elementu do listy html
            const newTask = document.createElement("li");
            newTask.id = `task-${data._id}`;
            newTask.innerHTML = `
                <button onclick="deleteTask('${data._id}', this)">Usuń</button>
                ${data.name}
            `;
            taskList.appendChild(newTask);

            taskInput.value = "";
        }
    });
});

