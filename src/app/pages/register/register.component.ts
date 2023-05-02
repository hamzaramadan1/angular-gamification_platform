import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {faUserCircle, faLock, faEnvelope, faSignature} from "@fortawesome/free-solid-svg-icons";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = new User();
  faUser = faUserCircle;
  faLock = faLock;
  faEnvelope = faEnvelope;
  faSignature = faSignature;
  errorMessage: string = "";
  usernamePattern = "^[a-zA-Z0-9_-]{4,20}$";
  firstNamePattern = "^[a-zA-Z'’]{2,30}$"
  lastNamePattern = "^[a-zA-Z'’]{2,30}$";
  emailPattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
    if (this.authenticationService.currentUserValue?.id) {
      this.router.navigate(['/profile']);
    }
  }

  register() {
    this.authenticationService.register(this.user).subscribe(data => {
      this.router.navigate(['/login']);
    }, err => {
      if (err?.status === 409) {
        this.errorMessage = 'Username already exist.';
      } else {
        this.errorMessage = 'Unexpected error occurred.';
        console.log(err);
      }
    })
  }
}
