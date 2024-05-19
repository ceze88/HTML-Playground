import {Component, Input} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../services/auth.service";
import firebase from "firebase/compat";
import FirebaseError = firebase.FirebaseError;
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatAnchor, MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {InputFormatterPipe} from "../../pipes/input-formatter.pipe";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatLabel,
    MatFormField,
    MatCardContent,
    MatCardActions,
    FormsModule,
    MatInput,
    MatButton,
    MatCardTitle,
    MatAnchor,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private snackBar: MatSnackBar, private authService: AuthService, private router: Router, private formatter: InputFormatterPipe) {}

  @Input() username!: string;
  @Input() password!: string;
  @Input() email!: string;

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  isValidEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  async register() {
    this.username = this.formatter.transform(this.username);
    this.email = this.formatter.transform(this.email);
    this.password = this.formatter.transform(this.password);

    // Check if username is empty
    if (!this.username) {
      this.snackBar.open('Username is required', 'Close', {
        duration: 2000,
      });
      return;
    }

    // Check if password is empty
    if (!this.password) {
      this.snackBar.open('Password is required', 'Close', {
        duration: 2000,
      });
      return;
    }

    // Check if email is empty
    if (!this.email) {
      this.snackBar.open('Email is required', 'Close', {
        duration: 2000,
      });
      return;
    }

    // Check if email is valid
    if (!this.isValidEmail(this.email)) {
      this.snackBar.open('Email is not valid', 'Close', {
        duration: 2000,
      });
      return;
    }

    // Check if password length is less than 6 characters
    if (this.password.length < 6) {
      this.snackBar.open('Password must be at least 6 characters', 'Close', {
        duration: 2000,
      });
      return;
    }

    try {
      let value = await this.authService.signUp(this.username, this.email, this.password);
      if (value.user) {
        this.snackBar.open('Registration successful', 'Close', {
          duration: 2000,
        });
        this.authService.setLoggedIn(true)

        //Redirect to the main page
        await this.router.navigate(['/']);
      } else {
        this.snackBar.open('Registration failed', 'Close', {
          duration: 2000,
        });
      }
    } catch (error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/invalid-credential') {
        this.snackBar.open('The supplied auth credential is incorrect, malformed or has expired.', 'Close', {
          duration: 2000,
        });
      } else {
        this.snackBar.open('Registration failed', 'Close', {
          duration: 2000,
        });
      }
    }
  }
}
