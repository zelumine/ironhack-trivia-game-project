// Variables
let openTriviaUrl;
let questionsArr = [];
let extractedQuestions;
let arrIndex = 0;
let score = 0;
let time = 30;
let secondsInterval;
let displayQuestions;

// DOM on quiz page
const answerBtns = document.querySelectorAll(".answer-btn");
const question = document.querySelector("#question");
const result = document.querySelector("#result");
const theme = document.querySelector("#question-theme");
const difficulty = document.querySelector("#question-level");
const questionNum = document.querySelector("#question-number");
let scoreDisplay = document.querySelector("#score");
let containerDiv = document.querySelector("#container");
let timerContainer = document.querySelector("#timer");


// ---------------------------------------------------------------------------------------------------------------------------------

// Dealing with home page buttons (theme & difficulty)
let chosenTheme, chosenDifficulty;
const buttons = document.querySelectorAll(".theme-box button");
const themeBtns = document.querySelectorAll(".theme-btn");
const shuffleBtn = document.querySelector("#shuffle-btn");
let themesArr = [];
let difficultyArr = ["easy", "medium", "hard", null];

const getBtnInfo = event => {
  chosenTheme = event.target.getAttribute("data-category");
  chosenDifficulty = event.target.getAttribute("data-level");
  getUrl(chosenTheme, chosenDifficulty);
  window.location.replace("./quiz.html");
}

const getUrl = (theme, difficulty) => {
  if (theme === null && difficulty === null) openTriviaUrl = `https://opentdb.com/api.php?amount=5&type=multiple`;
  else if (theme === null) openTriviaUrl = `https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=multiple`;
  else if (difficulty === null) openTriviaUrl = `https://opentdb.com/api.php?amount=5&category=${theme}&type=multiple`;
  else openTriviaUrl = `https://opentdb.com/api.php?amount=5&category=${theme}&difficulty=${difficulty}&type=multiple`;
  localStorage.setItem("url", openTriviaUrl);
  console.log(openTriviaUrl);
  return openTriviaUrl;
}

const shuffleThemes = () => {
  let theme, shuffledTheme, shuffledDifficulty;

  themeBtns.forEach(btn => {
    if (btn.getAttribute("data-category")) {
      theme = btn.getAttribute("data-category");
      themesArr.push(theme);
    }
  });

  shuffledTheme = themesArr[Math.floor(Math.random() * Math.floor(themesArr.length-1))];
  shuffledDifficulty = difficultyArr[Math.floor(Math.random() * Math.floor(difficultyArr.length-1))];

  getUrl(shuffledTheme, shuffledDifficulty);
  window.location.replace("./quiz.html");
}

if (buttons) buttons.forEach(btn => btn.addEventListener("click", getBtnInfo));
if (shuffleBtn) shuffleBtn.addEventListener("click", shuffleThemes);

// ---------------------------------------------------------------------------------------------------------------------------------

// Get request
const getOpenTriviaInfo = () => {
  axios
    .get(openTriviaUrl)
    .then(response => {
      extractedQuestions = response.data.results;
      extractedQuestions.forEach(item => questionsArr.push(item));
      
      if (arrIndex < questionsArr.length) {
        displayAnswers(questionsArr[arrIndex]);
        displayInfo(questionsArr[arrIndex]);
        manageTimer();
      } 
    })
    .catch(err => console.log(err));
};

window.addEventListener('load', () => {
  openTriviaUrl = localStorage.getItem("url");
  getOpenTriviaInfo();
});
// console.log(questionsArr);

// ---------------------------------------------------------------------------------------------------------------------------------

// Other functions for quiz page
const displayInfo = arr => {
  theme.textContent = `Theme: ${arr.category}`;
  difficulty.textContent = `Difficulty: ${arr.difficulty}`;
  questionNum.textContent = `Question ${arrIndex + 1} of ${questionsArr.length}`;
  console.log(questionsArr[arrIndex]);
}

const displayAnswers = arr => {
  let index = Math.floor(Math.random() * Math.floor(answerBtns.length-1));
  let incorrectAnswersArr = [...arr.incorrect_answers];

  question.innerHTML = arr.question;
  answerBtns[index].innerHTML = arr.correct_answer;
  answerBtns[index].setAttribute("data-correct", "true");

  answerBtns.forEach(btn => {
    if (btn !== answerBtns[index]) {
        btn.innerHTML = incorrectAnswersArr.splice([Math.floor(Math.random() * Math.floor(incorrectAnswersArr.length-1))], 1);
    }
  });
}

const getNextQuestion = arr => {
  answerBtns.forEach(btn => btn.setAttribute("data-correct", ""));

  setTimeout(() => {
    arrIndex++;
    displayInfo(arr[arrIndex]);
    displayAnswers(arr[arrIndex]);
  }, 500);

  if (arrIndex === questionsArr.length - 1) {
    setTimeout(() => { 
      displayResult();
    }, 1500);
  }

  clearInterval(secondsInterval);
  clearInterval(displayQuestions);
  time = 30;
  manageTimer();
}

const checkAnswer = (event) => {
  let rightAnswer;

  setTimeout(() => {
    result.className = "";
    result.textContent = "";
    event.target.classList.remove("btn-right-answer");
    event.target.classList.remove("btn-wrong-answer");
    rightAnswer.classList.remove("btn-right-answer");
  }, 500);

  if (event.target.getAttribute("data-correct")) {
    result.textContent = "YES, that's it, well done!";
    result.classList.add("good-answer");
    event.target.classList.add("btn-right-answer");
    score += 1;
    scoreDisplay.textContent = `Your score: ${score}`;
  } else {
    for (let i = 0; i < answerBtns.length; i++) {
      if(answerBtns[i].getAttribute("data-correct")) {
        rightAnswer = answerBtns[i];
      }
    }
    result.textContent = "Nope, sorry, that's wrong";
    result.classList.add("wrong-answer");
    event.target.classList.add("btn-wrong-answer");
    rightAnswer.classList.add("btn-right-answer");
  }

  getNextQuestion(questionsArr);
}

const displayResult = () => {
  let finalScoreDisplay = document.createElement("p");
  let buttonsDiv = document.createElement("div");
  let replayBtn = document.createElement("button");
  let newGameBtn = document.createElement("button");

  containerDiv.textContent = "There are no more questions! Here is your score";
  replayBtn.textContent = "Play again!";
  replayBtn.setAttribute("id", "replay-btn");
  newGameBtn.textContent = "Change theme";
  newGameBtn.setAttribute("id", "new-game-btn");

  finalScoreDisplay.textContent = score;
  containerDiv.appendChild(finalScoreDisplay);

  containerDiv.appendChild(buttonsDiv);
  buttonsDiv.appendChild(replayBtn);
  buttonsDiv.appendChild(newGameBtn);

  replayBtn.addEventListener("click", reload);
  newGameBtn.addEventListener("click", backToHomepage);
}

const reload = () => location.reload();

const backToHomepage = () => location.replace("./index.html");

// Timer
const printTime = () => {
  if (time < 10) timerContainer.textContent = `Remaining time: 0${time}`;
  else timerContainer.textContent = `Remaining time: ${time}`;
}

const timer = () => {
  secondsInterval = setInterval(() => {
    printTime();
    time--;

    if (time === -1) {
      clearInterval(secondsInterval);
      time = 30;
      timer();
    }
  }, 1000);
}

const manageTimer = () => {
  displayQuestions = setInterval(() => {
      if (arrIndex <= questionsArr.length - 1) {
        getNextQuestion(questionsArr);
      } else {
        clearInterval(displayQuestions);
        displayResult();
      }
    }, 31000);
  timer(); 
}


// ---------------------------------------------------------------------------------------------------------------------------------

// Events on quiz page
answerBtns.forEach(btn => btn.addEventListener("click", checkAnswer));
