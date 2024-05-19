import {Component, Input} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from "@angular/material/input";
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../services/auth.service";
import {FormsModule} from "@angular/forms";
import firebase from "firebase/compat";
import FirebaseError = firebase.FirebaseError;
import {Router, RouterLink} from "@angular/router";
import {InputFormatterPipe} from "../../pipes/input-formatter.pipe";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatInput,
    MatCardActions,
    MatButton,
    MatFormField,
    MatLabel,
    FormsModule,
    MatAnchor,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private snackBar: MatSnackBar, private authService: AuthService, private router: Router, private formatter: InputFormatterPipe) {}

  @Input() email!: string;
  @Input() password!: string;

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  isValidEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  async login() {
    this.email = this.formatter.transform(this.email);
    this.password = this.formatter.transform(this.password);

    // Replace the following with your actual login logic
    if (!this.email || !this.password) {
      this.snackBar.open('Email and password are required', 'Close', {
        duration: 2000,
      });
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.snackBar.open('Invalid email', 'Close', {
        duration: 2000,
      });
      return;
    }

    try {
      const value = await this.authService.signIn(this.email, this.password);
      if (value.user) {
        this.snackBar.open('Login successful', 'Close', {
          duration: 2000,
        });
        this.authService.setLoggedIn(true);
        //Redirect to the main page
        await this.router.navigate(['/']);
      } else {
        this.snackBar.open('Login failed', 'Close', {
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
        this.snackBar.open('Login failed', 'Close', {
          duration: 2000,
        });
      }
    }
  }
}
