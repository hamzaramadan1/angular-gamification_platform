import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/authentication.service";
import {CourseService} from "../../services/course.service";
import {Course} from "../../models/course.model";
import {HttpClient} from "@angular/common/http";
import Swal from "sweetalert2";
import {Minigame} from "../../models/minigame.model";
import {MinigameService} from "../../services/minigame.service";


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  currentUser: User = new User();
  course: Course = new Course();
  minigame: Minigame = new Minigame();
  selectedBox: number | null = null;
  selectedItem: number | null = null;
  courseList: Array<Course> = [];
  coursesCount: number | undefined;
  usersCount: number | undefined;
  courseModalVisible = false;
  minigameModalVisible = false;

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService,
              private courseService: CourseService,
              private minigameService: MinigameService) {
  }
  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
    });
    this.courseService.findAllCoursesForUserCount().subscribe(data => {
      this.coursesCount = data;
    })
    this.courseService.findAllCoursesForUser().subscribe(
      data => {
        this.courseList = data;
      },
    );
    this.userService.findAllUsersUsersCount().subscribe(
      data => {
        this.usersCount = data;
      }
    )
  }

  openCourseModal() {
    this.courseModalVisible = true;
  }

  closeCourseModal() {
    this.courseModalVisible = false;
  }

  openMinigameModal() {
    this.minigameModalVisible = true;
  }

  closeMinigameModal() {
    this.minigameModalVisible = false;
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
      this.closeCourseModal();    }, error => {
      Swal.fire(
        'Erreur !',
        'Nous n\'avons pas pu sauvegarder votre cours.',
        'error'
      );
    })
    }

  saveMinigame() {
    console.log(this.minigame, this.course.id, this.course.courseName);
    this.minigameService.saveMinigame(this.minigame, this.course.id).subscribe( () => {
      Swal.fire(
        'Succès !',
        'Mini-jeu sauvegardé pour l\'admin : ' + this.currentUser.username + 'et pour le cours : ' + this.course.courseName,
        'success'
      );
      this.closeCourseModal();    }, error => {
      Swal.fire(
        'Erreur !',
        'Nous n\'avons pas pu sauvegarder votre mini-jeu.',
        'error'
      );
    })
  }

  displayBoxInformation(boxNumber: number) {
    this.selectedBox = boxNumber;
  }

  displayItemInformation(itemNumber: number) {
    this.selectedItem = itemNumber;
  }

}
