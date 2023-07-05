import {Component, OnInit} from '@angular/core';
import {Course} from "../../models/course.model";
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/authentication.service";
import {CourseService} from "../../services/course.service";
import {Minigame} from "../../models/minigame.model";
import {UserMinigameScoreService} from "../../services/userminigamescore.service";
import {User} from "../../models/user.model";
import { Router } from '@angular/router';
import { MemoryGame } from 'src/app/models/memoryGame.model';
import { UserMemoryGameScoreService } from 'src/app/services/userMemoryGameScore.service';
import { PuzzleGame } from 'src/app/models/puzzleGame.model';
import { UserPuzzleGameScoreService } from 'src/app/services/userPuzzleGameScore.service';
import Swal from 'sweetalert2';
import { MemoryGameService } from 'src/app/services/memoryGame.service';
import { PuzzleGameService } from 'src/app/services/puzzleGame.service';
import { MinigameService } from 'src/app/services/minigame.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {

  currentUser: User = new User();
  courseList: Array<Course> = [];
  minigameList: Array<Minigame> = [];
  memoryGameList: Array<MemoryGame> = [];
  puzzleGameList: Array<PuzzleGame> = [];
  selectedCourse: Course | undefined;
  selectedMinigameScore: number | undefined;
  selectedMinigame: Minigame | undefined;
  selectedMinigameScores: number[] = [];
  selectedMemoryGameScore: number | undefined;
  selectedMemoryGame: MemoryGame | undefined;
  selectedMemoryGameScores: number[] = [];
  selectedPuzzleGameScore: number | undefined;
  selectedPuzzleGame: PuzzleGame | undefined;
  selectedPuzzleGameScores: number[] = [];
  userAnswer = '';
  searchQuery: string = '';
  minigame: Minigame = new Minigame();
  memoryGame: MemoryGame = new MemoryGame();
  puzzleGame: PuzzleGame = new PuzzleGame();

  constructor(private userService: UserService,
              private courseService: CourseService,
              private userMinigameScoreService: UserMinigameScoreService,
              private userMemoryGameScoreService: UserMemoryGameScoreService,
              private userPuzzleGameScoreService: UserPuzzleGameScoreService,
              private authenticationService: AuthenticationService,
              private minigameService: MinigameService,
              private memoryGameService: MemoryGameService,
              private puzzleGameService: PuzzleGameService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
    });
    if (this.currentUser.role === 'USER' || this.currentUser.role === 'SUPERADMIN') {
      this.userService.findAllCourses().subscribe(data => {
        this.courseList = data;
      });
    }
    if (this.currentUser.role === 'ADMIN') {
      this.courseService.findAllCoursesForUser().subscribe(data => {
        this.courseList = data;
      });
    }
  }

  public get sortedCourseList(): Course[] {
    if (this.reverseSort) {
      return this.courseList.sort((a, b) => b.courseName.localeCompare(a.courseName))
        .filter(course => course.courseName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    } else {
      return this.courseList.sort((a, b) => a.courseName.localeCompare(b.courseName))
        .filter(course => course.courseName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  }

  public reverseSort: boolean = false;

  public sortCoursesByName(sortDirection: 'asc' | 'desc'): void {
    this.reverseSort = sortDirection === 'desc';
  }

  // checkAnswer(userAnswer: string, minigameId: number, index: number) {
  //   this.userService.checkAnswer(userAnswer, minigameId).subscribe(() => {
  //     Swal.fire(
  //       'Bonne réponse !',
  //       '',
  //       'success'
  //     );
  //     this.closePlayMinigameModals(index);
  //   }, (error) => {
  //     console.error(error);
  //     Swal.fire(
  //       'Erreur !',
  //       '',
  //       'error'
  //     );
  //   });
  // }

  showCourseDetails(item: Course) {
    this.selectedCourse = item;
    this.userService.findAllMinigamesForCourse(item.id!).subscribe(data => {
      this.minigameList = data;
      this.minigameList.forEach((item, index) => {
        this.userMinigameScoreService.findScoreByMinigameId(item.id!).subscribe(data => {
          this.selectedMinigameScores[index] = data;
        });
      });
    });
    this.userService.findAllMemoryGamesForCourse(item.id!).subscribe(data => {
      this.memoryGameList = data;
      this.memoryGameList.forEach((item, index) => {
        this.userMemoryGameScoreService.findScoreByMemoryGameId(item.id!).subscribe(data => {
          this.selectedMemoryGameScores[index] = data;
        });
      });
    });
    this.userService.findAllPuzzleGamesForCourse(item.id!).subscribe(data => {
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

  deleteCourse(id?: number) {
    if (id) {
      const course = this.courseList.find(course => course.id === id);
      if (course) {
        Swal.fire({
          title: 'Êtes vous sûr de vouloir supprimer ' + course.courseName + ' ?',
          text: "Vous ne pourrez pas annuler cela !",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Oui, supprimer !'
        }).then((result) => {
          if (result.isConfirmed) {
            this.courseService.deleteCourse(id).subscribe(() => {
              const index = this.courseList.indexOf(course);
              if (index !== -1) {
                this.courseList.splice(index, 1);
              }
              Swal.fire(
                'Supprimé !',
                course.courseName + ' a été supprimé avec succès.',
                'success'
              )
            })
          }
        }), error => {
          console.log(error);
        }
        };
    }
  }

  deleteMinigame(id?: number) {
    if (id) {
      const minigame = this.minigameList.find(minigame => minigame.id === id);
      if (minigame) {
        Swal.fire({
          title: 'Êtes vous sûr ?',
          text: "Vous ne pourrez pas annuler cela !",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Oui, supprimer !'
        }).then((result) => {
          if (result.isConfirmed) {
            this.minigameService.deleteMinigame(id).subscribe(() => {
              const index = this.minigameList.indexOf(minigame);
              if (index !== -1) {
                this.minigameList.splice(index, 1);
              }
              Swal.fire(
                'Supprimé !',
                'Le Hangman a été supprimé avec succès.',
                'success'
              )
            })
          }
        }), error => {
          console.log(error);
        }
        };
    }
  }

  deleteMemoryGame(id?: number) {
    if (id) {
      const memoryGame = this.memoryGameList.find(memoryGame => memoryGame.id === id);
      if (memoryGame) {
        Swal.fire({
          title: 'Êtes vous sûr ?',
          text: "Vous ne pourrez pas annuler cela !",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Oui, supprimer !'
        }).then((result) => {
          if (result.isConfirmed) {
            this.memoryGameService.deleteMemoryGame(id).subscribe(() => {
              const index = this.memoryGameList.indexOf(memoryGame);
              if (index !== -1) {
                this.memoryGameList.splice(index, 1);
              }
              Swal.fire(
                'Supprimé !',
                'Le memory game a été supprimé avec succès.',
                'success'
              )
            })
          }
        }), error => {
          console.log(error);
        }
        };
    }
  }

  deletePuzzleGame(id?: number) {
    if (id) {
      const puzzleGame = this.puzzleGameList.find(puzzleGame => puzzleGame.id === id);
      if (puzzleGame) {
        Swal.fire({
          title: 'Êtes vous sûr ?',
          text: "Vous ne pourrez pas annuler cela !",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Oui, supprimer !'
        }).then((result) => {
          if (result.isConfirmed) {
            this.puzzleGameService.deletePuzzleGame(id).subscribe(() => {
              const index = this.puzzleGameList.indexOf(puzzleGame);
              if (index !== -1) {
                this.puzzleGameList.splice(index, 1);
              }
              Swal.fire(
                'Supprimé !',
                'Le puzzle game a été supprimé avec succès.',
                'success'
              )
            })
          }
        }), error => {
          console.log(error);
        }
        };
    }
  }
}
