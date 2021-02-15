// Variables
let openTriviaUrl = "https://opentdb.com/api.php?amount=20&type=multiple";
let questionsArr = [];
let extractedQuestions;
let arrIndex = 0;
let score = 0;
const answerBtns = document.querySelectorAll(".answer-btn");
const question = document.querySelector("#question");
const result = document.querySelector("#result");
const theme = document.querySelector("#question-theme");
const difficulty = document.querySelector("#question-level");
const questionNum = document.querySelector("#question-number");
let scoreDisplay = document.querySelector("#score");
let containerDiv = document.querySelector("#container");


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

getOpenTriviaInfo();
// console.log(questionsArr);

// Other functions 
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

  if (arrIndex === questionsArr.length - 1) displayResult();
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
  newGameBtn.textContent = "Change theme";

  finalScoreDisplay.textContent = score;
  containerDiv.appendChild(finalScoreDisplay);
  containerDiv.appendChild(buttonsDiv);
  buttonsDiv.appendChild(replayBtn);
  buttonsDiv.appendChild(newGameBtn);
}

// Events
answerBtns.forEach(btn => {
  btn.addEventListener("click", checkAnswer);
});
