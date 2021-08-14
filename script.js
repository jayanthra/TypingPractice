const inputBox = document.querySelector('.input-text')
const sentenceToType = document.querySelector('.text')
const message = document.querySelector('.message')
const game = document.querySelector('.game')
const result = document.querySelector('.result')
const gameMsg = document.querySelector('.game-msg')
const historyTable = document.querySelector('.table')

let currentWord = ''
let sentenceIndex = 0
let wordIndex = 0
let currentWordList = []
let backspaces = 0
let isStarted = false
let startTime = null
let history = [];

Object.prototype.showEle = function () {
  this.style.display = "block"
}

Object.prototype.hideEle = function () {
  this.style.display = "none"
}

const textList = [
  "The quick brown fox jumps over the lazy dog.",
  "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
  "Est earum cum accusamus! Rem aliquid molestias error amet distinctio magnam voluptates.",
  "Hic quaerat nisi sit eligendi error pariatur! Vitae, mollitia quo."
]

function highlightWord() {
  let childNodes = sentenceToType.childNodes
  if (wordIndex !== 0) {
    childNodes[wordIndex - 1].classList.remove('highlight')
  }
  childNodes[wordIndex].classList.add('highlight')
}

function sortHistory() {
  if (history.length) {
    history.sort((a, b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0))
  }
}

function showResult() {
  let endTime = (new Date().getTime() - startTime) / 1000

  result.showEle()
  game.hideEle()

  gameMsg.textContent = 'Press restart to try again'
  message.textContent = `You finished in ${endTime} seconds, Backspace used : ${backspaces} times`

  const record = {
    date: new Date(),
    time: endTime,
    backspaces,
  }

  history.push(record)
  sortHistory()
  if (history.length > 10) {
    history.length = 10
  }
  localStorage.setItem('history', JSON.stringify(history))
  getHistory()
}

function updateWordIndex() {
  if (wordIndex < currentWordList.length - 1) {
    wordIndex++
  } else {
    wordIndex = 0
    if (sentenceIndex < textList.length - 1) {
      sentenceIndex++
      setSentence()
    } else {
      isStarted = false
      showResult()
    }
  }
  highlightWord()
}

function setSentence() {
  sentenceToType.textContent = ''
  currentWordList = textList[sentenceIndex].split(" ");
  const spans = currentWordList.map(function (word) { return `<span>${word} </span>` });
  sentenceToType.innerHTML = spans.join('');
}

function getHistory() {
  history = JSON.parse(localStorage.getItem('history')) ?? []
  sortHistory()
  historyTable.showEle()
  const tblbody = document.querySelector('.tblbody')
  const historyData = history.map(record => {
    return `<tr><td>${new Date(record.date).toLocaleDateString()}</td><td>${record.time}</td><td>${record.backspaces}</td></tr>`
  })

  tblbody.innerHTML = historyData.join('')
}

function init() {
  backspaces = 0
  currentWord = ''
  sentenceIndex = 0
  wordIndex = 0
  currentWordList = []
  isStarted = false
  result.hideEle()
  game.showEle()
  getHistory()
  inputBox.focus()
  gameMsg.textContent = 'Practice your typing, Enter first letter to start time'
  setSentence();
  highlightWord();
}

init()

inputBox.addEventListener('keyup', (e) => {
  if (!isStarted) {
    historyTable.hideEle()
    gameMsg.textContent = 'Timer starter!!!'
    isStarted = true
    startTime = new Date().getTime();
  }

  if (e.code === 'Backspace') {
    backspaces++
  }

  if (currentWordList[wordIndex].startsWith(inputBox.value)) {
    inputBox.classList.remove('error')
  } else {
    inputBox.classList.add('error')
  }

  if (inputBox.value === currentWordList[wordIndex]) {
    inputBox.value = ''
    updateWordIndex()
  }
})



document.addEventListener("keyup", function (e) {
  if (e.code === 'Enter' && !isStarted) {
    init()
  }
});
