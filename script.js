let words = [];
let currentWord;
let wordIndex = 0;

const maggieImg = document.getElementById("maggie");
const wordDisplay = document.getElementById("word-display");

// Cargar palabras
fetch('words.json')
  .then(res => res.json())
  .then(data => { words = data; })
  .catch(err => alert("Error cargando palabras"));

// Mensajes flotantes
function showMessage(msg, color="green") {
    let message = document.createElement("div");
    message.textContent = msg;
    message.style.position = "fixed";
    message.style.top = "40%";
    message.style.left = "50%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.padding = "20px";
    message.style.background = color;
    message.style.color = "white";
    message.style.fontSize = "2em";
    message.style.borderRadius = "15px";
    message.style.zIndex = 1000;
    document.body.appendChild(message);
    setTimeout(() => { document.body.removeChild(message); }, 1500);
}

// Activar micrófono
function startRecognition() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
        let spoken = event.results[0][0].transcript.toLowerCase();
        if(spoken.includes(currentWord.word.toLowerCase())) {
            showMessage("¡Bien hecho! 🌟", "green");
            nextWord();
        } else {
            showMessage("Intenta otra vez 😅", "red");
            repeatWord();
        }
    };

    recognition.onerror = () => {
        showMessage("No te he escuchado 😕", "orange");
        repeatWord();
    };
}

// Repetir palabra automáticamente
function repeatWord() {
    if(!currentWord) return;

    let utter = new SpeechSynthesisUtterance(currentWord.word);
    utter.voice = speechSynthesis.getVoices().find(v => v.lang.includes("en")) || null;

    maggieImg.src = "images/mouth-open.png";
    utter.onend = () => {
        maggieImg.src = "images/maggie.png";
        startRecognition();
    };

    speechSynthesis.speak(utter);
}

// Siguiente palabra
function nextWord() {
    wordIndex++;
    if(wordIndex >= words.length) {
        showFinalScreen();
        return;
    }
    currentWord = words[wordIndex];
    speakWord();
}

// Decir la palabra
function speakWord() {
    if(!currentWord) return;

    wordDisplay.textContent = currentWord.word;

    let utter = new SpeechSynthesisUtterance(currentWord.word);
    utter.voice = speechSynthesis.getVoices().find(v => v.lang.includes("en")) || null;

    maggieImg.src = "images/mouth-open.png";
    utter.onend = () => {
        maggieImg.src = "images/maggie.png";
        startRecognition();
    };

    speechSynthesis.speak(utter);
}

// Botón Start
document.getElementById("start").onclick = () => {
    if(!words || words.length === 0){ alert("No hay palabras cargadas"); return; }
    wordIndex = 0;
    currentWord = words[wordIndex];
    speakWord();
};

// Pantalla final
function showFinalScreen() {
    document.body.innerHTML = `
        <div style="text-align:center; margin-top:10%;">
            <h1 style="font-size:3em; color: #FF69B4;">🎉 ¡Nivel completado! 🎉</h1>
            <img src="images/maggie.png" style="width:300px;">
        </div>
    `;
}
