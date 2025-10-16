let words = [];
let currentWord;
let wordIndex = 0;
let isSpeaking = false;
let recognitionActive = false;

const maggieImg = document.getElementById("maggie");
const wordDisplay = document.getElementById("word-display");

// Cargar palabras
fetch('words.json')
  .then(res => res.json())
  .then(data => { words = data; })
  .catch(err => alert("Error loading words"));

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

// Reconocimiento de voz
function startRecognition() {
    if(recognitionActive) return;
    recognitionActive = true;

    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
        recognitionActive = false;
        let spoken = event.results[0][0].transcript.toLowerCase();
        if(spoken.includes(currentWord.word.toLowerCase())) {
            showMessage("Well done! 🌟", "green");
            setTimeout(nextWord, 1600); // siguiente palabra automáticamente
        } else {
            showMessage("Try again 😅", "red");
        }
    };

    recognition.onerror = () => {
        recognitionActive = false;
        showMessage("I didn't hear you 😕", "orange");
    };
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

// Pronunciar palabra
function speakWord() {
    if(!currentWord || isSpeaking) return;
    isSpeaking = true;
    wordDisplay.textContent = currentWord.word;
    maggieImg.src = "images/mouth-open.png";

    function doSpeak() {
        let voices = speechSynthesis.getVoices();
        if(!voices.length){
            setTimeout(doSpeak, 200);
            return;
        }

        let utter = new SpeechSynthesisUtterance(currentWord.word);
        utter.voice = voices.find(v => v.lang.includes("en")) || null;

        utter.onend = () => {
            maggieImg.src = "images/maggie.png";
            isSpeaking = false;
        };

        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
    }

    doSpeak();
}

// Botón Start
document.getElementById("start").onclick = () => {
    if(!words || words.length === 0){ alert("No words loaded"); return; }
    wordIndex = 0;
    currentWord = words[wordIndex];
    speakWord();
};

// Botón Speak
document.getElementById("speak").onclick = () => {
    startRecognition();
};

// Pantalla final
function showFinalScreen() {
    document.body.innerHTML = `
        <div style="text-align:center; margin-top:10%;">
            <h1 style="font-size:3em; color: #FF69B4;">🎉 Level completed! 🎉</h1>
            <img src="images/maggie.png" style="width:300px;">
        </div>
    `;
}
