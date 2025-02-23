const el = (css) => document.querySelector(css);
const group = (css) => document.querySelectorAll(css);
const create = (html) => document.createElement(html);

let filteredQuestions = []; // leeres Array für alle gefilterten Fragen

let selectedDifficulty = []; // leeres Array für gefilterten Fragen - difficulty
let selectedCategory = []; // leeres Array für gefilterten Fragen - category

// questions-Array mit Fragen um die Eigenschaften "difficulty" und "category" erweitern:
function expandArrayProps() {

  // Kategorien erstellen
  const categories = [
    "banana eclipse",
    "jellyfish disco",
    "waffle tornado",
    "bubble toaster",
  ];

  // Frage-Ojekten zufällig "difficulty" und "category" Eigenschaft & Wert hinzufügen
  questions.forEach((obj) => {
    obj.difficulty = Math.ceil(Math.random() * 4).toString(); // Schwierigkeitslevel 1-4 als String
    const index = Math.floor(Math.random() * categories.length);
    obj.category = categories[index];
  });
  // console.log(questions)
}

// Soundausgabe on - off:

let currentSound = null; // Variable für die aktuelle Audio-Instanz
const pair = "sound/spawn.mp3";

// Funktion zum Sound an-/ausschalten
// Sound-Schalter (nur EIN/AUS)
let soundSwitch = false;

// Funktion, um den Sound-Schalter zu toggeln (Sound an/aus)
function soundOnOff() {
  soundSwitch = !soundSwitch;
  console.log("Sound ist " + (soundSwitch ? "AN" : "AUS"));
}

// Funktion zum einmaligen Abspielen eines Sounds
function playAudio(path) {
  if (soundSwitch) {
    // Nur wenn der Sound an ist
    const sound = new Audio(path);
    sound.volume = 0.1;
    sound
      .play()
      .catch((err) =>
        console.error("Sound konnte nicht abgespielt werden:", err)
      );
  }
}
// Funktion, um Sound abzuspielen, wenn beide Buttons ausgewählt wurden
function yesMatch() {
  if (selectedCategory.length > 0 || selectedDifficulty.length > 0) {
    playAudio("sound/spawn.mp3"); // Sound für die Auswahl
  } else {
    console.log("Bitte wähle eine Kategorie und eine Schwierigkeit aus.");
  }
}

// 20 Fragen aus questions-Array filtern (Ausgabe in neuem Array)
// nach "difficulty" & "category" filtern
function selectFilter() {

  // Überprüfen, ob der geklickte Button zur Schwierigkeitsauswahl gehört
  // Wert von angeklicktem difficulty-button wird ausgelesen -- Objekte mit entsprechendem Wert werden aus questions-Array herausgefiltert und in selectedDifficulty-Array gespeichert
  if (this.closest("div").id === "btns-difficulty") { // wenn Buttons für 'difficulty'-Filter zuständig sind...
    selectedDifficulty = questions.filter(            // ...difficulty-Array mit Frage-Objekten befüllen, deren difficulty mit angeklicktem Button-value übereinstimmen
      (obj) => obj.difficulty === this.value
    );

    // falls button-id = random --> selectedDifficulty-Array mit Kopie von komplettem questions-Array befüllen
    if (this.id === "random") {
      selectedDifficulty = [...questions];
    }

    // "selected"-Klasse von allen Difficulty-Buttons entfernen
    group("#btns-difficulty button").forEach((btn) => {
      btn.classList.remove("selected", 'no-hover');
      yesMatch();
    });
    // Klassen nur dem geklickten Button hinzufügen
    this.classList.add("selected", 'no-hover');
  }


  // siehe oben, nur mit category statt difficulty
  if (this.closest("div").id === "btns-category") {
    selectedCategory = questions.filter((obj) => obj.category === this.value);

    if (this.id === "random") {
      selectedCategory = [...questions];
    }

    group("#btns-category button").forEach((btn) => {
      btn.classList.remove("selected", 'no-hover');
      yesMatch();
    });
    this.classList.add("selected");
    this.classList.remove("no-hover", 'no-hover');
  }

  // Überprüfen, ob sowohl difficulty als auch category gewählt wurden
  // jeweilige Arrays müssen > 0 sein; erst dann kann ihre Schnittmenge bestimmt werden
  if (selectedDifficulty.length > 0 && selectedCategory.length > 0) {
    filteredQuestions = questions
      .filter(      
        (q) => // jede Frage (q) im questions-Array wird daraufhin überprüft, ob..
          selectedDifficulty.some((d) => d.difficulty === q.difficulty) && // .. vom selectedDifficulty-Array mindestens ein Element den gleichen Wert für difficulty hat wie die zu überprüfende Frage aus dem questions-Array
          selectedCategory.some((c) => c.category === q.category) // .. UND ob vom selectedCategory-Array mindestens ein Element den gleichen Wert für category hat wie die zu überprüfende Frage aus dem questions-Array
      ) // sobald beide Bedingungen auf eine Frage zutreffen, bleibt die Frage im filteredQuestions-Array, andernfalls wird sie entffernt
      .slice(0, 20);  // Array auf 20 Fragen kürzen

    console.log("filteredQuestions: ", filteredQuestions);
  }
}

// Spiel mit gefilterten Fragen beginnen
function startGame() {

  // Spiel kann erst gestartet werden, wenn sowohl difficulty als auch category ausgewählt wurden
  if (selectedDifficulty.length === 0 || selectedCategory.length === 0) {
    alert(
      "You must select both a difficulty level and a category to start the game."
    );
  } else {
    // Daten aus filteredQuestions im localStorage speichern, damit sie auf index.html verfügbar sind:
    localStorage.setItem(
      "filteredQuestions",
      JSON.stringify(filteredQuestions)
    ); // Daten aus filteredQuestions werden in JSON umgewandelt und im localStorage unter selbem Namen gespeichert
    window.location.href = "index.html"; // Weiterleitung auf index.html
  }
}

expandArrayProps();

// Filter-Funktion an Filter-Btns anhängen
group(".choose-buttons button").forEach((btn) =>
  btn.addEventListener("click", selectFilter)
);

// Button Spielbeginn starten
el("#btn-start").addEventListener("click", startGame);

// Button Sound on-off
el("#sound").addEventListener("click", soundOnOff);
