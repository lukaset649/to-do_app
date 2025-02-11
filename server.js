const express = require("express"); // framework do obsługi HTTP
const mongoose = require("mongoose"); // baza danych MongoDB
const bodyParser = require("body-parser"); // przetwarzanie formularzy

const app = express();
const PORT = 3000;

// Połączenie z bazą danych MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todoDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Utworzenie schematu taska (zadania) dla bazy danych
const taskSchema = new mongoose.Schema({
    name: String
});

// Utworzenie modelu Task na podstawie schematu i przypisanie go do zmiennej
const Task = mongoose.model("Task", taskSchema);

// Konfiguracja aplikacji, obsługa formularzy, plików statycznych i szablonów EJS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());  // Dodaj obsługę danych JSON
app.set("view engine", "ejs");

// Definicje tras

// Pobieranie zadań z bazy danych i renderowanie widoku
app.get("/", async (req, res) => {
    try {
        // Wyszukiwanie wszystkich dokumentów w kolekcji Task
        const tasks = await Task.find();
        // Renderowanie widoku index i przekazywanie danych zadań
        res.render("index", { tasks: tasks });
    } catch (err) {
        res.status(500).json({ error: "Błąd podczas ładowania zadań." });
    }
});

// Dodawanie zadania
app.post("/add", async (req, res) => {
    const taskName = req.body.task.trim();  // Używamy .trim(), aby usunąć nadmiarowe białe znaki

    console.log('Otrzymane zadanie:', taskName);

    if (!taskName) {
        return res.status(400).send("Nazwa zadania nie może być pusta");
    }

    const newTask = new Task({ name: taskName });
    await newTask.save();
    // Zwracanie nowego zadania w odpowiedzi JSON
    res.json(newTask);
});

// Usuwanie zadania
app.delete("/delete", async (req, res) => {
    try {
        const taskId = req.body.taskId;
        if (!taskId) {
            return res.status(400).json({ error: "Brak ID zadania." });
        }

        await Task.findByIdAndDelete(taskId);
        // Odpowiedź z sukcesem po usunięciu zadania
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Nie udało się usunąć zadania." });
    }
});

// Uruchomienie serwera na wskazanym porcie
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
