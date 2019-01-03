document.addEventListener("DOMContentLoaded", () => {
  let attemptCount = 3;
  let answer = "";
  let gameEnded = false;
  let userInput;
  let playerEarning = 0;
  let questionValue = 0;
  let hint_button = document.querySelector(".hint_button");
  let questionsButton = document.querySelector(".question_button");
  let answerForm = document.querySelector(".answerForm");
  let questionDiv = document.querySelector(".questionDiv");
  let questionsCounter = document.querySelector(".questions_Counter");
  let playerEarningDisplay = document.querySelector(".player_earning");
  playerEarningDisplay.innerText = "Total Earning: " + "$" + playerEarning;
  let questionCount = 3;
  let questions = document.createElement("p");
  let answers = document.createElement("p");
  let values = document.createElement("p");
  questions.classList.add("questions");
  answers.classList.add("answers");
  values.classList.add("values");
  questionDiv.appendChild(questions);
  questionDiv.appendChild(answers);
  questionDiv.appendChild(values);

  questionsButton.addEventListener("click", event => {
    if (questionCount !== 0) {
      fireRequest("http://jservice.io/api/clues", generateQuestion);
    } else {
      questionsCounter.innerText = "No more questions remaining. Game Over!";
    }
  });

  async function fireRequest(url, callback) {
    let result = await axios.get(url);
    callback(result.data);
  }

  answerForm.addEventListener("submit", event => {
    event.preventDefault();
    userInput = document.querySelector(".answerInput").value.toLowerCase();
    answer = answer.toLowerCase();
    if (questionCount === 0 && gameEnded === true) {
      questionsButton.innerText = "No questions remaining. Game Over!";
      playerEarningDisplay.innerText =
        "End of Game Total Earning: " + "$" + playerEarning;
      questionCount = 0;
      userInput = "gameover";
      gameEnded = true;
    } else if (userInput === answer && gameEnded === false) {
      debugger
      console.log("correct answer!");
      questionsButton.innerText = "Correct! Next Question";
      attemptCount = 3;
      playerEarning += questionValue;
      console.log(questionCount);
      playerEarningDisplay.innerText = "Total Earning: " + "$" + playerEarning;
      fireRequest("http://jservice.io/api/clues", generateQuestion);
    } else if (attemptCount === 0) {
      questionsButton.innerText = "Too many wrong attempts. Game Over!";
      playerEarningDisplay.innerText =
        "End of Game Total Earning: " + "$" + playerEarning;
      questionCount = 0;
      userInput = "gameover";
      console.log(userInput);
      gameEnded = true;
    } else if (userInput !== answer && gameEnded === false) {
      attemptCount -= 1;
      questionsButton.innerText =
        "Wrong! " + "Remaining attempt: " + attemptCount;
    }
  });

  hint_button.addEventListener("click", event => {
    event.preventDefault();
    if (questionCount !== 0) {
      questionsButton.innerText = answer;
      playerEarning -= 100;
      playerEarningDisplay.innerText = "Total Earning: " + "$" + playerEarning;
    }
  });

  function generateQuestion(questions) {
    questionsCounter.innerText = "Questions remaining:" + " " + questionCount;
    let questionData = questionBank(questions);
    debugger;
    questionData =
      questionData[Math.floor(Math.random() * questionData.length)];
    if (questionCount !== 0) {
      questionsButton.innerText = "Click here to SKIP";
      questionCount -= 1;
      debugger;
      document.querySelector(".questions").innerText = questionData.question;
      document.querySelector(".values").innerText = "$" + questionData.value;
      questionValue = questionData.value;
      answer = questionData.answer;
      console.log(answer);
    } else if (questionCount === 0) {
      debugger
      // gameEnded = true;
      questionsButton.innerText = "No questions remaining AT ALL. Game Over!";
      playerEarningDisplay.innerText =
        "End of Game Total Earning: " + "$" + playerEarning;
      questionCount = 0;
      userInput = "gameover";
      gameEnded = true;
    }
  }

  function questionBank(questions) {
    let result = [];
    questions.forEach(el => {
      if (el.value !== null) {
        result.push(el);
      }
    });
    return result;
  }
});
