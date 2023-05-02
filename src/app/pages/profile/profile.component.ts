import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/authentication.service";
import {Course} from "../../models/course.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: User = new User();
  errorMessage: string = "";
  selectedFile: File | undefined;
  courseList: Array<Course> = [];

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
    });
    this.userService.findAllCourses().subscribe(data => {
      this.courseList = data;
    });
  }

  goToSelectedCourse(selectedCourse: Course) {
    console.log(selectedCourse.id);
    this.router.navigate(['/course-details', selectedCourse.id], {state: selectedCourse});
  }

  getLastEightItems() {
    const startIndex = this.courseList.length - 8;
    return startIndex >= 0 ? this.courseList.slice(startIndex) : this.courseList;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  getRemainingExperience() {
    // @ts-ignore
    return this.currentUser.userLevel*1000 - this.currentUser.experiencePoints;
  }

  get experiencePercentage(): number {
    if (this.currentUser.userLevel && this.currentUser.experiencePoints) {
      return (100 * this.currentUser.experiencePoints) / (this.currentUser.userLevel * 1000);
    }
    else {
      return 0;
    }
  }

  onSubmit() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      this.userService.uploadProfilePicture(this.currentUser.username, formData)
        .subscribe(
          res => {
            console.log('Profile picture uploaded successfully');
            // Refresh the page to show the new profile picture
            window.location.reload();
          },
          error => {
            console.error('Error uploading profile picture:', error);
          }
        );
    }

  }


}
