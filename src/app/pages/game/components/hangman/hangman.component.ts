import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HangmanService } from '../../services/hangman.service';
import { Router } from '@angular/router';
import { Minigame } from 'src/app/models/minigame.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/user.model';
import { UserMinigameScoreService } from 'src/app/services/userminigamescore.service';

@Component({
  selector: 'app-hangman',
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.scss'],
})
export class HangmanComponent implements OnInit {

  currentUser: User = new User();
  question: string = '';
  questionText: string = '';
  questions: string[] = [];
  questionTexts: string[] = [];
  guesses: string[] = [];
  category: string = '';
  restartGameBtnShown = false;
  gameOver = false;
  gameWon = false;
  minigame: Minigame = new Minigame();
  buttonText = 'Prochaine question';
  score: number = 0;
  userHighscore: number = 0;
  highestScore: number;
  scoreRate: number;

  constructor(
    private hangmanService: HangmanService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userMinigameScoreService: UserMinigameScoreService
  )
  {
    this.minigame = Object.assign(new Minigame(),this.router.getCurrentNavigation()?.extras.state);
  }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
    });
    this.hangmanService.findByMinigameId(this.minigame.id).subscribe( (data: { answerText: string, questionText: string }[]) => {
      this.questions = data.map(question => question.answerText);
      this.questionTexts = data.map(question => question.questionText);
      console.log(this.questions);
      console.log(this.questionTexts);
      this.highestScore = this.questions.length * 100;
      this.pickNewQuestion();
    }, error => {
      console.log(error)
    });
    this.userMinigameScoreService.findScoreByMinigameId(this.minigame.id).subscribe(data => {
      this.userHighscore = data;
    })
  }

  guess(letter: string) {
    if (!letter || this.guesses.includes(letter)) {
      return;
    }
    this.guesses = [...this.guesses, letter];
  }

  dummyClick() {
    const key = prompt('Enter a key') || '';
    this.guess(key);
  }

  reset() {
    this.guesses = [];
    this.pickNewQuestion();
    this.restartGameBtnShown = false;
  }

  // replay() {
  //   this.guesses = [];
  //   this.restartGameBtnShown = false;
  //   this.gameOver = false;
  //   this.hangmanService.findByMinigameId(this.minigame.id).subscribe((data: { answerText: string, questionText: string }[]) => {
  //     this.questions = data.map(question => question.answerText);
  //     this.questionTexts = data.map(question => question.questionText);
  //     this.pickNewQuestion();
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  pickNewQuestion() {
    if (this.questions.length === 0) {
      if ((this.score / this.highestScore) < 0.6) {
        this.gameOver = true;
        this.scoreRate = Math.floor((this.score / this.highestScore) * 100);
      }
      else {
        this.gameWon = true;
        this.scoreRate = Math.floor((this.score / this.highestScore) * 100);
        this.userMinigameScoreService.updateScoreByMinigameId(this.minigame.id, this.score).subscribe( data => {
          console.log(data);
        }, error => {
          console.log(error);
        });
      }
    }

    if (this.questions.length === 1) {
      this.buttonText = 'Voir score';
    }

    const randomIndex = Math.floor(Math.random() * this.questions.length);
    this.question = this.questions[randomIndex];
    this.questionText = this.questionTexts[randomIndex];
    console.log(this.question);
    console.log(this.questionText);
    this.questions.splice(randomIndex, 1);
    this.questionTexts.splice(randomIndex, 1);
  }

  onGameFinished(success: boolean) {
    this.restartGameBtnShown = true;
    if (success) {
      this.score += 100;
    }
  }

  refreshPage() {
    window.location.reload();
  }
}
