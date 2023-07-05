import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {Router} from "@angular/router";
import {Course} from "../../models/course.model";
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/authentication.service";
import { Minigame } from 'src/app/models/minigame.model';
import { UserMemoryGameScoreService } from 'src/app/services/userMemoryGameScore.service';
import { UserMinigameScoreService } from 'src/app/services/userminigamescore.service';
import { MemoryGame } from 'src/app/models/memoryGame.model';
import { PuzzleGame } from 'src/app/models/puzzleGame.model';
import { UserPuzzleGameScoreService } from 'src/app/services/userPuzzleGameScore.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  selectedCourse: Course = new Course();
  currentUser: User = new User();
  minigameList: Array<Minigame> = [];
  memoryGameList: Array<MemoryGame> = [];
  puzzleGameList: Array<PuzzleGame> = [];
  selectedMinigameScores: number[] = [];
  selectedMemoryGameScores: number[] = [];
  selectedPuzzleGameScores: number[] = [];
  

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService,
              private userMinigameScoreService: UserMinigameScoreService,
              private userMemoryGameScoreService: UserMemoryGameScoreService,
              private userPuzzleGameScoreService: UserPuzzleGameScoreService,
              private router: Router) {
    this.selectedCourse = Object.assign(new Course(),this.router.getCurrentNavigation()?.extras.state);
  }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
    });
    this.userService.findAllMinigamesForCourse(this.selectedCourse.id!).subscribe(data => {
      this.minigameList = data;
      this.minigameList.forEach((item, index) => {
        this.userMinigameScoreService.findScoreByMinigameId(item.id!).subscribe(data => {
          this.selectedMinigameScores[index] = data;
        });
      });
    });
    this.userService.findAllMemoryGamesForCourse(this.selectedCourse.id!).subscribe(data => {
      this.memoryGameList = data;
      this.memoryGameList.forEach((item, index) => {
        this.userMemoryGameScoreService.findScoreByMemoryGameId(item.id!).subscribe(data => {
          this.selectedMemoryGameScores[index] = data;
        });
      });
    });
    this.userService.findAllPuzzleGamesForCourse(this.selectedCourse.id!).subscribe(data => {
      this.puzzleGameList = data;
      this.puzzleGameList.forEach((item, index) => {
        this.userPuzzleGameScoreService.findScoreByPuzzleGameId(item.id!).subscribe(data => {
          this.selectedPuzzleGameScores[index] = data;
        });
      });
    });
  }

  gameDetails(minigame: Minigame) {
    this.router.navigate(['/game', minigame.id], {state: minigame});
  }

  memoryGameDetails(memoryGame: MemoryGame) {
    this.router.navigate(['/memoryGame', memoryGame.id], {state: memoryGame});
  }

  puzzleGameDetails(puzzleGame: PuzzleGame) {
    this.router.navigate(['/puzzleGame', puzzleGame.id], {state: puzzleGame});
  }


}
