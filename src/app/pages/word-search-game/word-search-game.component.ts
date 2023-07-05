import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PuzzleGame } from 'src/app/models/puzzleGame.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserPuzzleGameScoreService } from 'src/app/services/userPuzzleGameScore.service';
import { WordSearchService } from 'src/app/services/wordSearch.service';

@Component({
  selector: 'app-word-search-game',
  templateUrl: './word-search-game.component.html',
  styleUrls: ['./word-search-game.component.css']
})
export class WordSearchGameComponent implements OnInit {

  currentUser: User = new User();
  puzzleGame: PuzzleGame = new PuzzleGame();
  wordSearches;
  wordSearchQuestions: string[] = [];
  wordSearchAnswers: string[] = [];
  grid: { value: string, color: string, id: string }[][] = [];
  userInput: string = "";
  tries: number = 5;
  score: number = 0;
  userScore: number = 0;
  userHighscore: number = 0;
  currentWordSearchAnswer;
  correct;
  gameWon;
  gameLost;
  foundWords: string[] = [];

  constructor(private wordSearchService: WordSearchService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userPuzzleGameScoreService: UserPuzzleGameScoreService) {
      this.puzzleGame = Object.assign(new PuzzleGame(),this.router.getCurrentNavigation()?.extras.state);
    }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
    });
    this.wordSearchService.findByPuzzleGameId(this.puzzleGame.id).subscribe( (data: { wordSearchAnswer: string, wordSearchQuestion: string }[]) => {
      this.wordSearchAnswers = data.map(wordSearchAnswer => wordSearchAnswer.wordSearchAnswer);
      this.wordSearchQuestions = data.map(wordSearchQuestion => wordSearchQuestion.wordSearchQuestion);
      console.log(this.wordSearchAnswers);
      console.log(this.wordSearchQuestions);
      this.generateGrid();
    }, error => {
      console.log(error)
    });
    this.userPuzzleGameScoreService.findScoreByPuzzleGameId(this.puzzleGame.id).subscribe(data => {
      this.userHighscore = data;
    });
  }

  generateGrid(): void {
    this.gameLost = false;
    this.gameWon = false;
    const gridSize = 15; // Size of the grid (number of rows and columns)
    const letters = 'abcdefghijklmnopqrstuvwxyz'; // Possible letters to fill the grid
  
    // Initialize an empty grid
    this.grid = [];
    for (let i = 0; i < gridSize; i++) {
      this.grid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        this.grid[i][j] = { value: '', color: 'black', id: '' };;
      }
    }
  
    // Place the words in the grid randomly
    for (const word of this.wordSearchAnswers) {
      let wordPlaced = false;
  
      while (!wordPlaced) {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        const wordFits = this.checkWordFit(word, row, col, direction, gridSize);
  
        if (wordFits) {
          wordPlaced = true;
          this.fillWord(word, row, col, direction);
        }
      }
    }
  
    // Fill the remaining empty cells with random letters
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (this.grid[i][j].value === '') {
          const randomLetter = letters[Math.floor(Math.random() * letters.length)];
          this.grid[i][j] = { value: randomLetter, color: 'black', id: '' };
        }
      }
    }
  }
  
  checkWordFit(word: string, row: number, col: number, direction: string, gridSize: number): boolean {
    const wordLength = word.length;
  
    if (direction === 'horizontal' && col + wordLength <= gridSize) {
      for (let i = 0; i < wordLength; i++) {
        if (this.grid[row][col + i].value !== '' && this.grid[row][col + i].value !== word[i]) {
          return false;
        }
      }
      return true;
    } else if (direction === 'vertical' && row + wordLength <= gridSize) {
      for (let i = 0; i < wordLength; i++) {
        if (this.grid[row + i][col].value !== '' && this.grid[row + i][col].value !== word[i]) {
          return false;
        }
      }
      return true;
    }
  
    return false;
  }
  
  fillWord(word: string, row: number, col: number, direction: string): void {
    if (direction === 'horizontal') {
      for (let i = 0; i < word.length; i++) {
        this.grid[row][col + i].value = word[i];
        this.grid[row][col + i].id = word;
      }
    } else if (direction === 'vertical') {
      for (let i = 0; i < word.length; i++) {
        this.grid[row + i][col].value = word[i];
        this.grid[row + i][col].id = word;
      }
    }
  }

  checkWord(): void {
    const index = this.wordSearchAnswers.findIndex(wordSearchAnswer => wordSearchAnswer.toLowerCase() === this.userInput.toLowerCase());
    this.currentWordSearchAnswer = this.userInput.toLowerCase();
    if (index !== -1) {
      this.foundWords.push(this.currentWordSearchAnswer);
      this.wordSearchAnswers.splice(index, 1);
      this.wordSearchQuestions.splice(index, 1);
      console.log('Correct word!');
      console.log(this.foundWords)
      this.score += 100;
      this.correct = true;
    } else {
      console.log('Incorrect word!');
      this.tries--;
      this.correct = false;
      if (this.tries == 0) {
        this.gameLost = true;
      }
    };
    this.userInput = '';
    console.log("wordsearchqsts",this.wordSearchQuestions);
    console.log("wordsearchanss",this.wordSearchAnswers);
    console.log("score",this.score);
    if (this.wordSearchAnswers.length == 0) {
      this.gameWon = true;
      this.userScore = this.score * (this.tries * 0.5);
    }
    this.userPuzzleGameScoreService.updateScoreByPuzzleGameId(this.puzzleGame.id, this.userScore).subscribe( data => {
      console.log(data);
    }, error => {
      console.log(error);
    });
  }

  refreshPage() {
    window.location.reload();
  }

}
