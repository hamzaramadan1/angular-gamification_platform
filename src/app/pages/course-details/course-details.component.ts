import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {Router} from "@angular/router";
import {Course} from "../../models/course.model";
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent {
  selectedCourse: Course = new Course();

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService,
              private router: Router) {
    this.selectedCourse = Object.assign(new Course(),this.router.getCurrentNavigation()?.extras.state);
  }

}
