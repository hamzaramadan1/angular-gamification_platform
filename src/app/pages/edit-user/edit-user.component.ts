import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/authentication.service";
import Swal from 'sweetalert2';
import {Router} from "@angular/router";
import {Course} from "../../models/course.model";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  currentUser: User = new User();
  user: User = new User();
  currentPassword: string = '';
  errorMessage: string = '';
  firstNamePattern = "^[a-zA-Z'’]{2,30}$"
  lastNamePattern = "^[a-zA-Z'’]{2,30}$";
  emailPattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
  decodedImage: any = '';
  imageFile: File;

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private sanitizer: DomSanitizer
              ) {
  }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
      
      // Check if userImageFile is not null before processing it
      if (this.currentUser.userImageFile) {
        const base64String = this.currentUser.userImageFile as string;
        const byteArray = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
        const blob = new Blob([byteArray], { type: 'image/png' });

        let objectURL = URL.createObjectURL(blob);
        this.decodedImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }
    });
  }
  

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.imageFile = target.files?.[0] || null;
    if (this.imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result?.toString();
        if (base64) {
          this.currentUser.userImageFile = this.imageFile;
        }
      };
      reader.readAsDataURL(this.imageFile);
    }
    else {
      console.log('file not present');
    }
  }

  updateProfilePic() {
    this.userService.updateProfilePic(this.currentUser.userImageFile as File).subscribe((data: User) => {
      Swal.fire(
        'Succès !',
        'Photo de profil changée avec succès.',
        'success'
      );
      if (this.currentUser.role === 'USER') {
        this.router.navigate(['/profile']);
      } else if (this.currentUser.role === 'ADMIN' || this.currentUser.role === 'SUPERADMIN') {
        this.router.navigate(['/admin']);
      }
    }, error => {
      Swal.fire(
        'Erreur !',
        'Nous n\'avons pas pu sauvegarder votre photo de profil.',
        'error'
      );
    })
  }

  updateUser() {
    this.userService.updateUser(this.user, this.currentPassword).subscribe(data => {
      Swal.fire(
        'Succès !',
        'Changements réussis.',
        'success'
      );
      if (this.currentUser.role === 'USER') {
        this.router.navigate(['/profile']);
      } else if (this.currentUser.role === 'ADMIN') {
        this.router.navigate(['/admin']);
      }
    },
      err => {
      if (err?.status === 400) {
        Swal.fire(
          'Erreur !',
          'Mot de passe actuel erroné.',
          'error'
        );
      }
      else {
        Swal.fire(
          'Erreur !',
          'Nous n\'avons pas réussi à sauvegarder vos changements.',
          'error'
        );
        console.log(err);
      }
      });
  }

}
