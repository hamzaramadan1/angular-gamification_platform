import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/authentication.service";
import {CourseService} from "../../services/course.service";
import {Course} from "../../models/course.model";
import Swal from "sweetalert2";
import {Minigame} from "../../models/minigame.model";
import {MinigameService} from "../../services/minigame.service";
import { MemoryGame } from 'src/app/models/memoryGame.model';
import {MemoryGameService} from "../../services/memoryGame.service";
import { PuzzleGame } from 'src/app/models/puzzleGame.model';
import { PuzzleGameService } from 'src/app/services/puzzleGame.service';
import { UserMinigameScoreService } from 'src/app/services/userminigamescore.service';
import { UserMemoryGameScoreService } from 'src/app/services/userMemoryGameScore.service';
import { UserPuzzleGameScoreService } from 'src/app/services/userPuzzleGameScore.service';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  currentUser: User = new User();
  course: Course = new Course();
  minigame: Minigame = new Minigame();
  memoryGame: MemoryGame = new MemoryGame();
  puzzleGame: PuzzleGame = new PuzzleGame();
  selectedBox: number | null = null;
  selectedItem: number | null = null;
  courseForUserList: Array<Course> = [];
  minigameForUserList: Array<Minigame> = [];
  memoryGameForUserList: Array<MemoryGame> = [];
  puzzleGameForUserList: Array<PuzzleGame> = [];
  coursesForUserCount: number | undefined;
  minigamesForUserCount: number | undefined;
  memoryGamesForUserCount: number | undefined;
  puzzleGamesForUserCount: number | undefined;
  minigameScoresForUserCount: number[] = [];
  memoryGameScoresForUserCount: number[] = [];
  puzzleGameScoresForUserCount: number[] = [];
  courseList: Array<Course> = [];
  minigameList: Array<Minigame> = [];
  memoryGameList: Array<MemoryGame> = [];
  puzzleGameList: Array<PuzzleGame> = [];
  coursesCount: number | undefined;
  minigamesCount: number | undefined;
  memoryGamesCount: number | undefined;
  puzzleGamesCount: number | undefined;
  minigameScoresCount: number[] = [];
  memoryGameScoresCount: number[] = [];
  puzzleGameScoresCount: number[] = [];
  usersCount: number | undefined;
  courseModalVisible = false;
  minigamesModalVisible = false;
  minigameModalVisible = false;
  memoryGameModalVisible = false;
  puzzleGameModalVisible = false;
  count;

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService,
              private courseService: CourseService,
              private minigameService: MinigameService,
              private memoryGameService: MemoryGameService,
              private puzzleGameService: PuzzleGameService,
              private userMinigameScoreService: UserMinigameScoreService,
              private userMemoryGameScoreService: UserMemoryGameScoreService,
              private userPuzzleGameScoreService: UserPuzzleGameScoreService) {
  }
  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
    });
    if (this.currentUser.role === 'ADMIN') {
      console.log(this.currentUser.role);
      this.courseService.findAllCoursesForUserCount().subscribe(data => {
        this.coursesForUserCount = data;
      });
      this.minigameService.findAllMinigamesForUserCount().subscribe(data => {
        this.minigamesForUserCount = data;
      });
      this.memoryGameService.findAllMemoryGamesForUserCount().subscribe(data => {
        this.memoryGamesForUserCount = data;
      });
      this.puzzleGameService.findAllPuzzleGamesForUserCount().subscribe(data => {
        this.puzzleGamesForUserCount = data;
      });
      this.courseService.findAllCoursesForUser().subscribe(
        data => {
          this.courseForUserList = data;
        },
      );
      this.minigameService.findAllMinigamesForUser().subscribe(
        data => {
          this.minigameForUserList = data;
          this.minigameForUserList.forEach((item, index) => {
            this.userMinigameScoreService.getMinigameCount(item.id!).subscribe(data => {
              this.minigameScoresForUserCount[index] = data;
              console.log(item.id);
            });
          });
        }
      );
      this.memoryGameService.findAllMemoryGamesForUser().subscribe(
        data => {
          this.memoryGameForUserList = data;
          this.memoryGameForUserList.forEach((item, index) => {
            this.userMemoryGameScoreService.getMemoryGameCount(item.id!).subscribe(data => {
              this.memoryGameScoresForUserCount[index] = data;
              console.log(item.id);
            });
          });
        }
      );
      this.puzzleGameService.findAllPuzzleGamesForUser().subscribe(
        data => {
          this.puzzleGameForUserList = data;
          this.puzzleGameForUserList.forEach((item, index) => {
            this.userPuzzleGameScoreService.getPuzzleGameCount(item.id!).subscribe(data => {
              this.puzzleGameScoresForUserCount[index] = data;
              console.log(item.id);
            });
          });
        }
      );
    }
    else if (this.currentUser.role === 'SUPERADMIN') {
      console.log(this.currentUser.role);
      this.userService.findAllCoursesCount().subscribe(data => {
        this.coursesCount = data;
      });
      this.minigameService.findAllMinigamesCount().subscribe(data => {
        this.minigamesCount = data;
      });
      this.memoryGameService.findAllMemoryGamesCount().subscribe(data => {
        this.memoryGamesCount = data;
      });
      this.puzzleGameService.findAllPuzzleGamesCount().subscribe(data => {
        this.puzzleGamesCount = data;
      });
      this.userService.findAllCourses().subscribe(
        data => {
          this.courseList = data;
        },
      );
      this.minigameService.findAllMinigames().subscribe(
        data => {
          this.minigameList = data;
          this.minigameList.forEach((item, index) => {
            this.userMinigameScoreService.getMinigameCount(item.id!).subscribe(data => {
              this.minigameScoresCount[index] = data;
              console.log(item.id);
            });
          });
        }
      );
      this.memoryGameService.findAllMemoryGames().subscribe(
        data => {
          this.memoryGameList = data;
          this.memoryGameList.forEach((item, index) => {
            this.userMemoryGameScoreService.getMemoryGameCount(item.id!).subscribe(data => {
              this.memoryGameScoresCount[index] = data;
              console.log(item.id);
            });
          });
        }
      );
      this.puzzleGameService.findAllPuzzleGames().subscribe(
        data => {
          this.puzzleGameList = data;
          this.puzzleGameList.forEach((item, index) => {
            this.userPuzzleGameScoreService.getPuzzleGameCount(item.id!).subscribe(data => {
              this.puzzleGameScoresCount[index] = data;
              console.log(item.id);
            });
          });
        }
      );
    }
    this.userService.findAllUsersUsersCount().subscribe(
      data => {
        this.usersCount = data;
      }
    );
  }

  openCourseModal() {
    this.courseModalVisible = true;
  }

  closeCourseModal() {
    this.courseModalVisible = false;
  }

  openMinigamesModal() {
    this.minigamesModalVisible = true;
  }

  closeMinigamesModal() {
    this.minigamesModalVisible = false;
  }

  openMinigameModal() {
    this.minigameModalVisible = true;
  }

  closeMinigameModal() {
    this.minigameModalVisible = false;
  }

  openMemoryGameModal() {
    this.memoryGameModalVisible = true;
  }

  closeMemoryGameModal() {
    this.memoryGameModalVisible = false;
  }

  openPuzzleGameModal() {
    this.puzzleGameModalVisible = true;
  }

  closePuzzleGameModal() {
    this.puzzleGameModalVisible = false;
  }

  addQuestion() {
    this.minigame.questions.push({
      id: undefined,
      minigame: this.minigame,
      user: this.currentUser,
      questionText: '',
      answerText: ''
    });
  }  
  
  removeQuestion(index: number) {
    this.minigame.questions.splice(index, 1);
  }

  addCard() {
    this.memoryGame.cards.push({
    cardIndex: undefined,
    id: undefined,
    memoryGame: this.memoryGame,
    user: this.currentUser,
    cardQuestion: '',
    cardAnswer: '',
    cardContent: '',
    revealed: false,
    color: ''});
  }

  removeCard(index: number) {
    this.memoryGame.cards.splice(index, 1);
  }

  addWordSearch() {
    this.puzzleGame.wordSearches.push({
    id: undefined,
    puzzleGame: this.puzzleGame,
    user: this.currentUser,
    wordSearchQuestion: '',
    wordSearchAnswer: ''});
  }

  removeWordSearch(index: number) {
    this.puzzleGame.wordSearches.splice(index, 1);
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result?.toString();
        if (base64) {
          this.course.file = file;
        }
      };
      reader.readAsDataURL(file);
    }
    else {
      console.log('file not present');
    }
  }

  saveCourse() {
    this.courseService.saveCourse(this.course.courseName, this.course.courseDescription, this.course.courseLink, this.course.file).subscribe((data: Course) => {
      Swal.fire(
        'Succès !',
        'Cours sauvegardé pour l\'admin : ' + this.currentUser.username + '.',
        'success'
      );
      window.location.reload();
      this.closeCourseModal();    }, error => {
      Swal.fire(
        'Erreur !',
        'Nous n\'avons pas pu sauvegarder votre cours.',
        'error'
      );
      console.log(error);
    })
    }

  saveMinigame() {
  for(let i = 0; i <this.minigame.questions.length; i++) {
    this.minigame.questions[i].minigame = undefined;
  };
    this.minigameService.saveMinigame(this.minigame, this.course.id).subscribe( () => {
      Swal.fire(
        'Succès !',
        'Mini-jeu sauvegardé pour l\'admin : ' + this.currentUser.username + 'et pour le cours : ' + this.course.id,
        'success'
      );
      this.closeMinigameModal();    }, error => {
      Swal.fire(
        'Erreur !',
        'Nous n\'avons pas pu sauvegarder votre mini-jeu.',
        'error'
      );
      console.log(error);
    })
  }

  saveMemoryGame() {
    for(let i = 0; i <this.memoryGame.cards.length; i++) {
      this.memoryGame.cards[i].memoryGame = undefined;
    };
    this.memoryGameService.saveMemoryGame(this.memoryGame, this.course.id).subscribe( () => {
      Swal.fire(
        'Succès !',
        'Memory game sauvegardé pour l\'admin : ' + this.currentUser.username + 'et pour le cours : ' + this.course.id,
        'success'
      );
      this.closeMemoryGameModal();    }, error => {
      Swal.fire(
        'Erreur !',
        'Nous n\'avons pas pu sauvegarder votre memory game.',
        'error'
      );
      console.log(error);
    })
  }

  getMinigameCount(minigameId: number) {
    this.userMinigameScoreService.getMinigameCount(minigameId).subscribe(
      data => {
        this.count = data;
      }
    )
  }

  savePuzzleGame() {
    for(let i = 0; i <this.puzzleGame.wordSearches.length; i++) {
      this.puzzleGame.wordSearches[i].puzzleGame = undefined;
    };
    this.puzzleGameService.savePuzzleGame(this.puzzleGame, this.course.id).subscribe( () => {
      Swal.fire(
        'Succès !',
        'Puzzle game sauvegardé pour l\'admin : ' + this.currentUser.username + 'et pour le cours : ' + this.course.id,
        'success'
      );
      this.closePuzzleGameModal();    }, error => {
      Swal.fire(
        'Erreur !',
        'Nous n\'avons pas pu sauvegarder votre puzzle game.',
        'error'
      );
      console.log(error);
    })
  }

  displayBoxInformation(boxNumber: number) {
    this.selectedBox = boxNumber;
  }

  displayItemInformation(itemNumber: number) {
    this.selectedItem = itemNumber;
  }

}
