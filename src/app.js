// Variables
let openTriviaUrl;
let questionsArr = [];
let extractedQuestions;
let arrIndex = 0;
let score = 0;

// DOM on quiz page
const answerBtns = document.querySelectorAll(".answer-btn");
const question = document.querySelector("#question");
const result = document.querySelector("#result");
const theme = document.querySelector("#question-theme");
const difficulty = document.querySelector("#question-level");
const questionNum = document.querySelector("#question-number");
let scoreDisplay = document.querySelector("#score");
let containerDiv = document.querySelector("#container");

// ---------------------------------------------------------------------------------------------------------------------------------

// Dealing with home page buttons (theme & difficulty)
let chosenTheme, chosenDifficulty;
const buttons = document.querySelectorAll('.theme-box button');

const getBtnInfo = event => {
  chosenTheme = event.target.getAttribute("data-category");
  chosenDifficulty = event.target.getAttribute("data-level");
  console.log(chosenTheme);
  console.log(chosenDifficulty);
  getUrl(chosenTheme, chosenDifficulty);
  window.location.replace("./quiz.html");
}

const getUrl = (theme, difficulty) => {
  if (theme === null && difficulty === null) openTriviaUrl = `https://opentdb.com/api.php?amount=5&type=multiple`;
  else if (theme === null) openTriviaUrl = `https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=multiple`;
  else if (difficulty === null) openTriviaUrl = `https://opentdb.com/api.php?amount=5&category=${theme}&type=multiple`;
  else openTriviaUrl = `https://opentdb.com/api.php?amount=5&category=${theme}&difficulty=${difficulty}&type=multiple`;
  console.log("URL updated! yay!");
  console.log(openTriviaUrl);
  localStorage.setItem("url", openTriviaUrl);
  return openTriviaUrl;
}

buttons.forEach(btn => btn.addEventListener('click', getBtnInfo));

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
      }
      
      // let displayQuestions = setInterval(() => {
      //   arrIndex++;
      //   displayAnswers(questionsArr[arrIndex]);
      //   displayInfo(questionsArr[arrIndex]);
      // }, 30000);
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
  }, 1000);

  if (arrIndex === questionsArr.length - 1) {
    setTimeout(() => { 
      displayResult();
    }, 1500);
  }
}

const checkAnswer = (event) => {
  setTimeout(() => {
    result.className = "";
    result.textContent = "";
  }, 1000);

  if (event.target.getAttribute("data-correct")) {
    result.textContent = "YES, that's it, well done!";
    result.classList.add("good-answer");
    score += 1;
    scoreDisplay.textContent = `Your score: ${score}`;
  } else {
    result.textContent = "Nope, sorry, that's wrong";
    result.classList.add("wrong-answer");
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
// ---------------------------------------------------------------------------------------------------------------------------------

// Events on quiz page
answerBtns.forEach(btn => {
  btn.addEventListener("click", checkAnswer);
});
