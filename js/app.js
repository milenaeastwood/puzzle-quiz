const el = (css) => document.querySelector(css);
const group = (css) => document.querySelectorAll(css);
const create = (html) => document.createElement(html);

let filteredQuestions = []; // leeres Array für alle gefilterten Fragen

let questionCounter = 0; // counter für beantwortete Fragen
let lostOrWon; // Spielende: gewonnen oder verloren

// Variante Soundausgabe on - off:
// let soundSwitch = false; // Sound-Schalter
// let currentSound = null; // Variable für die aktuelle Audio-Instanz

// function soundOnOff(path) {
//   if (soundSwitch) {
//     // Falls bereits ein Sound spielt, stoppen
//     if (currentSound) {
//       currentSound.pause();
//       currentSound.currentTime = 0; // Zurückspulen
//     }

//     // Neuen Sound laden und abspielen
//     currentSound = new Audio(path);
//     currentSound.volume = 0.1;
//     currentSound.loop = true; // Falls du möchtest, dass die Musik in Dauerschleife läuft
//     currentSound
//       .play()
//       .catch((err) =>
//         console.error("Sound konnte nicht abgespielt werden:", err)
//       );
//   } else {
//     // Falls Sound ausgeschaltet wird, aktuellen Sound stoppen
//     if (currentSound) {
//       currentSound.pause();
//       currentSound.currentTime = 0;
//       currentSound = null;
//     }
//   }
// }

// Event-Listener für den Sound-Button
// el("#sound").addEventListener("click", function () {
//   soundSwitch = !soundSwitch; // Sound an/aus schalten
//   console.log("Sound ist " + (soundSwitch ? "AN" : "AUS"));

//   // Sound an-/ausschalten
//   soundOnOff("sound/puzzle1.mp3");
// });
let soundSwitch = false;

// Funktion, um den Sound-Schalter zu toggeln (Sound an/aus)
function soundOnOff() {
  soundSwitch = !soundSwitch;
  // console.log("Sound ist " + (soundSwitch ? "AN" : "AUS"));
}

// Funktion zum einmaligen Abspielen eines Sounds
function playAudioQuestion(path) {
  if (!soundSwitch) {
    return; // Falls Sound ausgeschaltet ist, nichts tun
  }

  // console.log("Versuche Sound abzuspielen:", path);
  const sound = new Audio(path);
  sound.volume = 0.1;
  sound
    .play()
    .then()
    .catch((err) => console.error("Fehler beim Abspielen des Sounds:", err));
}

// Fragen aus dem filteredQuestions-Array in HTML einfügen
function showQuestion() {
  const storedQuestions = localStorage.getItem("filteredQuestions"); // die im localStorage gespeicherten Daten abrufen und in var storedQuestions speichern
  if (storedQuestions) {
    // sofern Daten in localStorage vorhanden...
    filteredQuestions = JSON.parse(storedQuestions); // ...zurück in JS Objekt umwandeln und in filteredQuestions-Array speichern
  }

  // zu befüllende HTML-Elemente für Frage und Antworten auswählen u. mit Text von jew. Frage aus filteredQuestions-Array befüllen (Index = questionCounter)
  el("#question-index").innerText = filteredQuestions[questionCounter].question;
  el("#A").innerText = filteredQuestions[questionCounter].A;
  el("#B").innerText = filteredQuestions[questionCounter].B;
  el("#C").innerText = filteredQuestions[questionCounter].C;
  el("#D").innerText = filteredQuestions[questionCounter].D;

  console.log("correct answer: ", filteredQuestions[questionCounter].answer);

  questionCounter++; // Index erhöhen, um damit nächste Frage bestimmen zu können

  group("#answer-buttons button").forEach((btn) => {
    btn.classList.remove("correct", "incorrect", "no-hover"); // Klassen correct/incorrect/no-hover entfernen
    btn.addEventListener("click", checkAnswer); // jeder Antwort-Button erhält Funktion zum Überprüfen auf richtig-falsch
  });
  el("#next-btn").style.display = "none"; // Button "Next Question" verstecken
}

function createPuzzle() {
  let max = 16;
  for (let i = 0; i < max; i++) {
    const img = create("img");
    img.setAttribute("src", "img/Deckblatt_blau.png");
    img.setAttribute("alt", `Klammer ${i + 1}`);
    img.setAttribute("data-index", i);
    img.setAttribute("data-hidden", "true");
    el("#puzzle-box").append(img);
  }
}

// Puzzleteile aufdecken
function uncoverPuzzle() {
  // Puzzleteile aufdecken
  const hiddenPieces = document.querySelectorAll(
    "#puzzle-box img[data-hidden='true']"
  );

  // zufälliges noch verdecktes Puzzleteil auswählen
  const randomIndex = Math.floor(Math.random() * hiddenPieces.length);
  const selectedPiece = hiddenPieces[randomIndex];

  // Index des Puzzleteils abrufen und sicherstellen, dass er zwischen 0 und 15 bleibt
  let index = parseInt(selectedPiece.getAttribute("data-index"), 10);
  if (index < 0 || index >= 16) {
    console.error("Ungültiger Index:", index);
    return;
  }

  // neues Bild setzen: img/georgie-cobbs_01.jpg bis img/georgie-cobbs_16.jpg
  const newImageSrc = `img/cobbs/georgie-cobbs_${String(index + 1).padStart(
    2,
    "0"
  )}.jpg`;
  selectedPiece.setAttribute("src", newImageSrc);

  // Puzzleteil als sichtbar markieren
  selectedPiece.setAttribute("data-hidden", "false");

  if (hiddenPieces.length < 2) {
    // falls alle Teile aufgedeckt sind...
    lostOrWon = "won"; // Status Spielende auf gewonnen setzen
    gameOver("Mission Accomplished!"); // ..Spiel beenden "Mission Accomplished!" als Text für Modal übergeben
    return;
  }
}

// Antwort überprüfen auf richtig-falsch
function checkAnswer(e) {
  const selectedBtn = e.target; // angeklickten Button in Variable speichern
  const correctAnswer = filteredQuestions[questionCounter - 1].answer; //antwort ist richtig

  // richtig-falsch Antwort farblich hinterlegen: Überprüfen, ob id(=Antwort) vom selected Button mit der Antwort der aktuellen Frage übereinstimmt...
  if (selectedBtn.id === correctAnswer) {
    selectedBtn.classList.add("correct"); // ...wenn ja: Button farblich grün markieren
    uncoverPuzzle();
    playAudioQuestion("sound/correct.mp3");
  } else {
    selectedBtn.classList.add("incorrect"); // ...wenn nein: Button farblich rot markieren
    const showCorrectAnswer = Array.from(group("#answer-buttons button")).find(
      (btn) => btn.id === correctAnswer
    ); // NodeList in Array umwandeln, um die korrekte Farbe zu finden...
    showCorrectAnswer.classList.add("correct"); // ...und grün zu markieren
    playAudioQuestion("sound/bomb2.mp3");
  }

  group("#answer-buttons button").forEach((btn) => {
    btn.removeEventListener("click", checkAnswer); // eventListener entfernen, damit nicht mehrfach klickbar
    btn.classList.add("no-hover"); // hover-Effekt entfernen
  });
  el("#next-btn").style.display = "block"; // showQuestion-button erscheint

  // wenn Fragen-Maximum erreicht: Spiel beenden und Status Spielende auf verloren setzen
  if (questionCounter > 19) {
    lostOrWon = "lost";
    gameOver("Game Over!"); // "Game Over!" als Text für Modal übergeben
  }
}

// bei Spielende: Modal öffnen
function gameOver(pText) {
  const modal = el("#modal");
  modal.style.display = "flex";
  el(".modal-content p").innerText = pText; // je nachdem ob Spiel gewonnen/verloren, wird Text im Modal gesetzt ('Mision Accomplished!' / 'Game Over!')
  el("#modal-btn").innerText = "Show result";
  el("#modal-btn").addEventListener("click", showResult);
  const puzzleBoxHTML = document.querySelector("#puzzle-box").outerHTML; // HTML vom Puzzle-Status (welche Teile sind wo aufgedeckt) speichern...
  localStorage.setItem("puzzleBox", puzzleBoxHTML); // ...und in localStorage speichern, damit Puzzle auf end.html abgerufen werden kann
}

function showResult() {
  // benötigte Daten von index.html im localStorage speichern, damit sie auf end.html abgerufen werden können
  localStorage.setItem(
    "gameResult",
    `You ${lostOrWon} – it took you ${questionCounter} out of 20 attempts!`
  );
  window.location.href = "end.html";
}

showQuestion();
createPuzzle();

// Überprüf-Funktion für Antwort-Buttons anhängen
group("#answer-buttons button").forEach((btn) =>
  btn.addEventListener("click", checkAnswer)
);

// Button "next Question":
el("#next-btn").addEventListener("click", showQuestion);

// Button sound on-off
el("#sound").addEventListener("click", soundOnOff);
