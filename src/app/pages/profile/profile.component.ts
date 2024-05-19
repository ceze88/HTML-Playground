// profile.component.ts
import {Component, Input} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../services/auth.service";
import firebase from "firebase/compat";
import FirebaseError = firebase.FirebaseError;
import {Router} from "@angular/router";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {InputFormatterPipe} from "../../pipes/input-formatter.pipe";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatLabel,
    MatFormField,
    MatInput,
    FormsModule,
    MatCardActions,
    MatButton,
    MatCardTitle
  ],
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  @Input() username!: string;
  @Input() password!: string;
  @Input() profilePictureUrl!: string | null;

  constructor(private snackBar: MatSnackBar, private authService: AuthService, private router: Router, private formatter: InputFormatterPipe) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.getUsername().then(username => {
          this.username = username;
        });
        this.authService.getProfilePicture().then(profilePictureUrl => {
          this.profilePictureUrl = profilePictureUrl;
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  async updateProfile() {
    if (this.password && this.password.length < 6) {
      this.snackBar.open('Password must be at least 6 characters', 'Close', {
        duration: 2000,
      });
      return;
    }

    if (!this.username) {
      this.snackBar.open('Username is required', 'Close', {
        duration: 2000,
      });
      return;
    }

    this.username = this.formatter.transform(this.username);

    if (this.password) {
      this.password = this.formatter.transform(this.password);
    }

    if (this.profilePictureUrl) {
      this.profilePictureUrl = this.formatter.transform(this.profilePictureUrl);
    }


    try {
      await this.authService.updateProfile(this.password, this.profilePictureUrl, this.username);
      this.snackBar.open('Profile updated successfully', 'Close', {
        duration: 2000,
      });
      //Clear the password field
      this.password = '';
    } catch (error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/invalid-credential') {
        this.snackBar.open('The supplied auth credential is incorrect, malformed or has expired.', 'Close', {
          duration: 2000,
        });
      } else {
        console.log(error)
        this.snackBar.open('Profile update failed', 'Close', {
          duration: 2000,
        });
      }
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profilePictureUrl = URL.createObjectURL(file);
    }
  }

  deleteAccount() {
    this.authService.deleteAccount().then(r => {
      //show snackbar
      this.snackBar.open('Account deleted successfully', 'Close', {
        duration: 2000,
      });
      this.authService.setLoggedIn(false);

      //navigate to the sign-in page
      this.router.navigate(['/login']);
    });
  }

  signOut() {
    this.authService.signOut().then(r => {
      //show snackbar
      this.snackBar.open('Signed out successfully', 'Close', {
        duration: 2000,
      });
      this.authService.setLoggedIn(false);
      //navigate to the sign-in page
      this.router.navigate(['/login']);
    });
  }
}
