import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {SuperAdminService} from "../../services/superadmin.service";
import {Router} from "@angular/router";
import {Role} from "../../models/role.enum";

@Component({
  selector: 'app-admin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css']
})
export class SuperAdminComponent implements OnInit {

  userList: Array<User> = [];

  constructor(private superAdminService: SuperAdminService, private router: Router) {
  }

  ngOnInit(): void {
    this.superAdminService.findAllUsers().subscribe(data => {
      this.userList = data;
    });
  }

  detail(user: User) {
    this.router.navigate(['/detail', user.id], {state: user});
  }

  isAdmin(id?: number): boolean {
    if (id) {
      const user = this.userList.find(user => user.id === id);

      if (user) {
        if (user.role == Role.ADMIN || user.role == Role.SUPERADMIN) {
          return true;
        }
      }
    }
    return false;
  }

  isSuperAdmin(id?: number): boolean {
    if (id) {
      const user = this.userList.find(user => user.id === id);

      if (user) {
        if (user.role == Role.SUPERADMIN) {
          return true;
        }
      }
    }
    return false;
  }

  changeRole(id?: number) {
    if (id) {
      const user = this.userList.find(user => user.id === id);

      if (user) {
        const newRole = user.role === Role.ADMIN ? Role.USER : Role.ADMIN;

        this.superAdminService.changeRole(newRole, id).subscribe(() => {
          user.role = newRole;
        }, error => {
          // Handle error
          console.log(error);
        });
      }
    }
  }

  lockUser(id?: number) {
    if (id) {
      const user = this.userList.find(user => user.id === id);

      if (user) {
        this.superAdminService.lockUser(id).subscribe(() => {
          console.log('User locked.')
          user.locked = true;
        }, error => {
          // Handle error
          console.log(error);
        });
      }
    }
  }

  unlockUser(id?: number) {
    if (id) {
      const user = this.userList.find(user => user.id === id);

      if (user) {
        this.superAdminService.unlockUser(id).subscribe(() => {
          console.log('User unlocked.')
          user.locked = false;
        }, error => {
          // Handle error
          console.log(error);
        });
      }
    }
  }

  deleteUser(id?: number) {
    if (id) {
      const user = this.userList.find(user => user.id === id);
      if (user) {
        this.superAdminService.deleteUser(id).subscribe(() => {
          const index = this.userList.indexOf(user);
          if (index !== -1) {
            this.userList.splice(index, 1);
          }
        }, error => {
          console.log(error);
        });
      }
    }
  }
}
