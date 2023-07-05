import { Component, OnInit } from '@angular/core';

import { CardService } from './services/card.service';
import { shuffle } from './helpers/array';
import { Card } from 'src/app/models/card.model';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MemoryGame } from 'src/app/models/memoryGame.model';
import { User } from 'src/app/models/user.model';
import { UserMemoryGameScoreService } from 'src/app/services/userMemoryGameScore.service';

@Component({
  selector: 'app-ca',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class CaComponent implements OnInit {
  currentUser: User = new User();
  cards;
  memoryGame: MemoryGame = new MemoryGame();
  unsolved;
  lastClicked;  
  revealedCards;
  cardIndex;
  waiting;
  clicks;
  colorsList;
  gameWon;
  gameLost;
  score: number = 0;
  userScore: number = 0;
  userHighscore: number = 0;
  maxClicks: number = 0;

  constructor(private cardService: CardService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private userMemoryGameScoreService: UserMemoryGameScoreService) {
                this.memoryGame = Object.assign(new MemoryGame(),this.router.getCurrentNavigation()?.extras.state);
              }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
    });
    this.clicks = 0;
    this.waiting = false;
    this.cards = [];
    this.lastClicked = null;  
    this.revealedCards = 0;
    this.cardIndex = 0;
    this.gameWon = false;
    this.gameLost = false;
    this.colorsList = ["#CCCCCC", "#ADD8E6", "#90EE90", "#FFFFE0", "#FFEFD5", "#FFB6C1", "#E6E6FA", "#98FB98", "#FFDAB9", "#F5F5DC", "#E0B0FF", "#F08080", "#AFEEEE", "#FFA07A"];
    this.cardService.findByMemoryGameId(this.memoryGame.id).subscribe(data => {      
      data.map(item => {
        console.log(data);
        var randomColorIndex = Math.floor(Math.random() * this.colorsList.length);
        var randomColor = this.colorsList[randomColorIndex];
        this.cards.push(new Card(this.cardIndex, item.id, item.cardQuestion, randomColor));
        this.cards.push(new Card(this.cardIndex + 1, item.id, item.cardAnswer, randomColor));
        console.log(randomColor);
        this.cardIndex +=2;
        this.colorsList.splice(randomColorIndex, 1);
      });
      this.cards = shuffle(this.cards);
      this.unsolved = this.cards.length / 2;
    });
    this.userMemoryGameScoreService.findScoreByMemoryGameId(this.memoryGame.id).subscribe(data => {
      this.userHighscore = data;
    });
    
  }

  // initGame() {
  //   this.clicks = 0;
  //   this.waiting = false;
  //   this.cards = [];
  //   this.lastClicked = null;  
  //   this.revealedCards = 0;
  //   this.cardIndex = 0;
  //   this.unsolved = Math.floor(BOARD_WIDTH * BOARD_HEIGHT / 2);
  //   this.cardService.findByMemoryGameId(444).subscribe(data => {      
  //     data.map(item => {
  //       console.log(data);
  //       this.cards.push(new Card(this.cardIndex, item.id, item.cardQuestion));
  //       this.cards.push(new Card(this.cardIndex + 1, item.id, item.cardAnswer));
  //       this.cardIndex +=2;
  //     });      
  //     this.cards = shuffle(this.cards);
  //   });  
  // }

  handleCardClick([cardIndex, id]) {
    if (!this.waiting) {
      if (!this.isCardShown(cardIndex)) {
        this.clicks++;
        this.showCard(cardIndex);
        if (this.lastClicked != null && this.lastClicked === id) {
          this.unsolved--;
          this.lastClicked = null;
          this.revealedCards = 0;
          this.score += 100;
        } else {                 
          this.revealedCards++;
          if (this.revealedCards == 2) {
            this.waiting = true;
            setTimeout(() => {
              this.hideCard(cardIndex);          
              this.hideCardByImageId(this.lastClicked);
              this.revealedCards = 0;       
              this.lastClicked = null;      
              this.waiting = false;     
            }, 1000);
          } else {       
            this.lastClicked = id;  
          }                   
        }              
      }
    }

    console.log(this.score);

    var totalQuestions = this.cards.length / 2;
    this.maxClicks = Math.floor(((totalQuestions*totalQuestions) + ((totalQuestions*totalQuestions)/2)));

    if (this.clicks >= this.maxClicks) {
      if (this.unsolved > 0) {
        this.gameLost = true;
      };
    }

    if (this.unsolved == 0) {
      this.gameWon = true;
      this.userScore = Math.floor((this.score / this.clicks) * 10);
      this.userMemoryGameScoreService.updateScoreByMemoryGameId(this.memoryGame.id, this.userScore).subscribe( data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
      console.log(this.userScore);
    }
  }

  showCard(cardIndex: number): void {
    this.cards.map(card => card.cardIndex === cardIndex ? card.revealed = true : true)
  }

  hideCard(cardIndex: number): void {
    this.cards.map(card => card.cardIndex === cardIndex ? card.revealed = false : true)
  }

  hideCardByImageId(id: string): void {
    this.cards.map(card => card.id === id ? card.revealed = false : true)
  }

  isCardShown(cardIndex): boolean {
    return this.cards.find(card => card.cardIndex === cardIndex).revealed;
  }

  refreshPage() {
    window.location.reload();
  }
}
