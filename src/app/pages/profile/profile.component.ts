import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/authentication.service";
import {Course} from "../../models/course.model";
import {Router} from "@angular/router";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


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
  firstThreeUsers: Array<User> = [];
  firstAllUsers: Array<User> = [];
  imageFile: File;

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
    });

    this.userService.findAllCourses().subscribe(data => {
      this.courseList = data;
    });
    this.userService.getFirstThreeUsersWithHighestExperiencePoints().subscribe(data => {
      this.firstThreeUsers = data;
      console.log(data);
    });
    this.userService.getUsersWithHighestExperiencePoints().subscribe(data => {
      this.firstAllUsers = data;
      console.log(data);
    });
  }

  getUserImageURL(user: User): SafeUrl | undefined {
    if (user.userImageFile) {
      const base64String = user.userImageFile as string;
      const byteArray = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
      const blob = new Blob([byteArray], { type: 'image/png' });

      let objectURL = URL.createObjectURL(blob);
      return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }
    return undefined;
  }

  getCourseImageURL(course: Course): SafeUrl | undefined {
    if (course.file) {
      const base64String = course.file as string;
      const byteArray = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
      const blob = new Blob([byteArray], { type: 'image/png' });

      let objectURL = URL.createObjectURL(blob);
      return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }
    return undefined;
  }

  getUserIndex(firstAllUsers, username: string): number {
    for (let index = 0; index < firstAllUsers.length; index++) {
      if (firstAllUsers[index].username === username) {
        return index;
      }
    }
    return -1;
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
    return ((this.currentUser.userLevel * 1000) + (this.currentUser.userLevel * 100 * this.currentUser.userLevel)) - this.currentUser.experiencePoints;
  }

  get experiencePercentage(): number {
    return (((this.currentUser.experiencePoints - (((this.currentUser.userLevel-1) * 1000) + ((this.currentUser.userLevel-1) * 100 * (this.currentUser.userLevel-1)))) / (((this.currentUser.userLevel * 1000) + (this.currentUser.userLevel * 100 * this.currentUser.userLevel)) - (((this.currentUser.userLevel-1) * 1000) + ((this.currentUser.userLevel-1) * 100 * (this.currentUser.userLevel-1))))) * 100);
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
