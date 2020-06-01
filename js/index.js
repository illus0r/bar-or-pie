function Game() {
	this.isGameStarted = false
  this.currentQuestion = 0
  this.answerIsShown = false
	this.isLastAnswerCorrect = true
	this.questionCount = document.querySelectorAll("#game .optionSet").length
	this.questionsCorrectness = []

	this.countCorrect = () => {
		let sum = 0
		for (let q of this.questionsCorrectness)
			sum += q
		return sum
	}

	this.showResult = () => {
		const result = document.querySelector("#result")
		result.querySelector(".correct").innerText = this.countCorrect()
		result.querySelector(".total").innerText = this.questionCount
		result.classList.add('visible')
	}

	this.showProgress = () => {
		const progress = document.querySelector(".progress")
		progress.innerHTML = ''
		let index = 0
		for (q of this.questionsCorrectness) {
			progress.innerHTML += `<div class='${ q? 'correct' : 'wrong' }'></div>`
			index ++
		}
		for (; index < this.questionCount; index ++) {
			progress.innerHTML += `<div class='empty'></div>`
		}
	}

  this.shuffleAnswers = () => {
    const optionSets = document
      .querySelectorAll("#game .optionSet")

    optionSets.forEach( optionSet => {
      if(Math.random() < 0.5) {
        optionSet.appendChild(optionSet.firstElementChild)
      }
    })
  }

	this.start = () => {
		this.isGameStarted = true
    this.updateView()
	}

  this.updateView = () => {

		let intro = document.querySelector("#game #intro")
		intro.classList.toggle('visible',	!this.isGameStarted)
		if (! this.isGameStarted) return


		this.showProgress()
		
    const questions = document
      .querySelectorAll("#game .question.visible")

    for (let i = 0; i < questions.length; i++) {
      questions[i].classList.remove('visible')
    }
      
		if (this.currentQuestion >= this.questionCount) {
			this.showResult()
			return
		}

    const currentQuestion = document
      .querySelector(`#game .question-${ this.currentQuestion }`)

    currentQuestion.classList.add('visible')

    currentQuestion.querySelector('#game .answer')
      .classList.toggle('visible', this.answerIsShown)
    currentQuestion.querySelector('#game .answer .correct').classList.toggle('visible', this.isLastAnswerCorrect)
    currentQuestion.querySelector('#game .answer .wrong').classList.toggle('visible', !this.isLastAnswerCorrect)
  }

  this.showNextQuestion = () => {
    this.answerIsShown = false
    this.currentQuestion += 1
    this.updateView()
  }

  this.showAnswer = (correctness) => {
    this.answerIsShown = true
		this.isLastAnswerCorrect = correctness
		this.questionsCorrectness.push(correctness)
    this.updateView()
  }
}


window.addEventListener('load', function () {
  game = new Game()
  game.updateView()
  game.shuffleAnswers()

  document.querySelector('#game').onclick = (event) => {
    const classList = event.target.classList

		if (! game.isGameStarted && classList.contains('start')) {
			game.start()
			console.log('start')
			return
		}

		if (! game.answerIsShown) {
			if(classList.contains('option-correct')) {
				game.showAnswer(true)
			}
			if(classList.contains('option-wrong')) {
				game.showAnswer(false)
			}
			return
		}
		if(classList.contains('next')) {
			game.showNextQuestion()
			return
		}
  }
})
