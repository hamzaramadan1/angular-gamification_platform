import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {SuperAdminService} from "../../services/superadmin.service";
import {Router} from "@angular/router";
import {Role} from "../../models/role.enum";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css']
})
export class SuperAdminComponent implements OnInit {

  userList: Array<User> = [];
  searchQuery = '';

  constructor(private superAdminService: SuperAdminService, private router: Router) {
  }

  ngOnInit(): void {
    this.superAdminService.findAllUsers().subscribe(data => {
      this.userList = data;
    });
  }

  public get sortedUserList(): User[] {
    if (this.reverseSort) {
      return this.userList.sort((a, b) => b.username.localeCompare(a.username))
        .filter(user => user.username.toLowerCase().includes(this.searchQuery.toLowerCase()));
    } else {
      return this.userList.sort((a, b) => a.username.localeCompare(b.username))
        .filter(user => user.username.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  }

  public reverseSort: boolean = false;

  public sortUsersByUsername(sortDirection: 'asc' | 'desc'): void {
    this.reverseSort = sortDirection === 'desc';
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
          Swal.fire(
            'Role changé !',
            'Le role de l\'utilisateur ' + user.username + ' a été changé avec succès.',
            'success'
          )
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
          user.locked = true;
          Swal.fire(
            'Verouillé !',
            'L\'utilisateur ' + user.username + ' a été verouillé avec succès.',
            'success'
          )
        }, error => {
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
          user.locked = false;
          Swal.fire(
            'Déverouillé !',
            'L\'utilisateur ' + user.username + ' a été déverouillé avec succès.',
            'success'
          )
        }, error => {
          console.log(error);
        });
      }
    }
  }

  deleteUser(id?: number) {
    if (id) {
      const user = this.userList.find(user => user.id === id);
      if (user) {
        Swal.fire({
          title: 'Êtes vous sûr ?',
          text: "Vous ne pourrez pas annuler cela !",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Oui, supprimer !'
        }).then((result) => {
          if (result.isConfirmed) {
            this.superAdminService.deleteUser(id).subscribe(() => {
              const index = this.userList.indexOf(user);
              if (index !== -1) {
                this.userList.splice(index, 1);
              }
              Swal.fire(
                'Supprimé !',
                'L\'utilisateur a été supprimé avec succès.',
                'success'
              )
            })
          }
        }), error => {
          console.log(error);
        }
        };
    }
  }
}
