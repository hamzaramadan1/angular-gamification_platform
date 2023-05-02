import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {faUserCircle, faLock} from "@fortawesome/free-solid-svg-icons";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = new User();
  faUser = faUserCircle;
  faLock = faLock;
  errorMessage: string = "";
  usernamePattern = "^[a-zA-Z0-9_-]{4,20}$";

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {

  }

  login() {
    this.authenticationService.login(this.user).subscribe(data => {
      const role = data.role;

      switch (role) {
        case 'USER':
          this.router.navigate(['/profile']);
          break;
        case 'ADMIN':
          this.router.navigate(['/admin']);
          break;
        case 'SUPERADMIN':
          this.router.navigate(['/superadmin']);
      }
    }, error => {
      this.errorMessage = 'Username or password is incorrect.';
      console.log(error);
    });
  }

}
