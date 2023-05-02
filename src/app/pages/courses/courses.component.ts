import {Component, OnInit} from '@angular/core';
import {Course} from "../../models/course.model";
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/authentication.service";
import {CourseService} from "../../services/course.service";
import {Minigame} from "../../models/minigame.model";
import {UserMinigameScore} from "../../models/userminigamescore.model";
import {UserMinigameScoreService} from "../../services/userminigamescore.service";
import {User} from "../../models/user.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {

  courseList: Array<Course> = [];
  minigameList: Array<Minigame> = [];
  selectedCourse: Course | undefined;
  selectedMinigameScore: number | undefined;
  selectedMinigame: Minigame | undefined;
  selectedMinigameScores: number[] = [];
  playMinigameModals: boolean[] = [];
  userAnswer = '';


  constructor(private userService: UserService,
              private courseService: CourseService,
              private userMinigameScoreService: UserMinigameScoreService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.userService.findAllCourses().subscribe(data => {
      this.courseList = data;
    });
    this.courseService.findAllCoursesForUser().subscribe(data => {
      this.courseList = data;
    });
    this.playMinigameModals = Array(this.minigameList.length).fill(false);
  }

  openPlayMinigameModals(index: number) {
    this.playMinigameModals[index] = true;
  }

  closePlayMinigameModals(index: number) {
    this.playMinigameModals[index] = false;
  }

  checkAnswer(userAnswer: string, minigameId: number, index: number) {
    this.userService.checkAnswer(userAnswer, minigameId).subscribe(() => {
      Swal.fire(
        'Bonne réponse !',
        '',
        'success'
      );
      this.closePlayMinigameModals(index);
    }, (error) => {
      console.error(error);
      Swal.fire(
        'Erreur !',
        '',
        'error'
      );
    });
  }

  showCourseDetails(item: Course) {
    this.selectedCourse = item;
    this.userService.findAllMinigamesForCourse(item.id!).subscribe(data => {
      this.minigameList = data;
      this.minigameList.forEach((item, index) => {
        this.userMinigameScoreService.findScoreByMinigameId(item.id!).subscribe(data => {
          this.selectedMinigameScores[index] = data;
        });
      });
    })
  }
}
