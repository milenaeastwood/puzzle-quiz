const el = (css) => document.querySelector(css);
const group = (css) => document.querySelectorAll(css);
const create = (html) => document.createElement(html);

function showFinalResult() {

  // Spielergebnis aus localStorage abrufen 
  const resultText = localStorage.getItem("gameResult");
  if (resultText) { // wenn Spielergebnis vorhanden, p-Element mit individuellem Ergebnis befüllen und CSS-Klasse hinzufügen
    el('#result p').innerText = resultText; 
    el('#result').classList = 'result';
  }

  // Puzzle-Status aus localStorage abrufen
  const savedPuzzleBox = localStorage.getItem("puzzleBox");
  if (savedPuzzleBox) { // wenn Puzzle-Status vorhanden, div mit gespeichertem Puzzle-HTML befüllen (als innerHTML)
    el("#puzzle-box-end").innerHTML = savedPuzzleBox;
    const newPuzzleBox = el("#puzzle-box-end");   
    newPuzzleBox.classList = 'new-puzzle-box' // outerHTML-div mit CSS-Klasse versehen
  }

}

// neues Spiel starten
function newGame() {
    window.location.href = "start.html";
  }

showFinalResult();

// Button neues Spiel starten:
el("#btn-new-game").addEventListener("click", newGame);