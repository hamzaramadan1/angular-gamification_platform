import { Component } from '@angular/core';
import {User} from "../../models/user.model";
import {AuthenticationService} from "../../services/authentication.service";
import {faArrowRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {Router} from "@angular/router";
import {Role} from "../../models/role.enum";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  currentUser: User = new User;
  faArrowRightToBracket = faArrowRightToBracket;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
    });
  }

  isSuperAdmin() {
    return this.currentUser?.role === Role.SUPERADMIN;
  }

  logOut() {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
  }

}
