const express = require("express"); //framework do obsługi http
const mongoose = require("mongoose"); //baza danych MongoDB
const bodyParser = require("body-parser"); //przetwarzanie formularzy

const app = express();
const PORT = 3000;

//połączenie z bazą danych
mongoose.connect("mongodb://127.0.0.1:27017/todoDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//utworzenie schematu task'a dla bazy danych (MongoDB jest niestrukturalna, więc schemat określa jakie obiekt w bazie ma pola i typy)
const taskSchema = new mongoose.Schema({
    name: String
});

//utworzenie modelu Task na podstawie schematu i przypisanie do zmiennej, aby móc wykonywać operacje na bazie
const Task = mongoose.model("Task", taskSchema);

//konfiguracja aplikacji, obsługa formularzy, ststycznych plików i szablonów EJS
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//Defninicje trasy
// Pobieranie zadań
app.get("/", async (req, res) => {
    //wyszukuje wszystkie dokumenty w kolekcji Task, await zapewnia czekanie na wynik zapytania
    const tasks = await Task.find();
    //renderowanie widoku ejs index 
    res.render("index", { tasks: tasks });
});

//dodawanie zadania
app.get("/add", async (req, res) =>{
    const taskName = req.body.task;
    const newTask = new Task({ name: taskName });
    await newTask.save();
    res.redirect("/");
});

//usuwanie zadania
app.get("/delete", async(req, res) => {
    const taskId = req.body.taskId;
    await Task.findByIdAndDelete(taskId);
    res.redirect("/");
});

//uruchomienie serwera na wskazanym porcie
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});