import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../services/api.service";
import { DataService } from "../../services/data.service";
import * as alertify from "alertify.js";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  isLoggedIn: boolean = false;
  loginForm: FormGroup;
  isLoginFailed: boolean = false;

  emptyUserName = "You must enter a username";
  minlengthUserName = "User name must be at least 3 characters long";
  maxlengthUserName = "Username cannot exceed 20 characters";
  userNamePattern = "Username should be in alphanumeric only";
  emptyPassword = "You must enter a password";
  minlengthPassword = "Password must be at least 8 characters long";
  maxlengthPassword = "Password cannot exceed 20 characters";
  passwordPattern = "Pattern does not match";
  wrongCredentials = "Incorrect Username or Password";

  constructor(private route: Router, private dataService: DataService) {}

  ngOnInit() {
    // add necessary validators

    this.loginForm = new FormGroup({
      userName: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern("^[a-zA-Z0-9 '-]+$"),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        ),
      ]),
    });
  }
  get userName() {
    return this.loginForm.get("userName");
  }

  get password() {
    return this.loginForm.get("password");
  }

  doLogin() {
    // call authenticateUser method to perform login operation
    // if success, redirect to profile page
    // else display appropriate error message
    // reset the form
    this.dataService
      .authenticateUser(this.userName.value, this.password.value)
      .subscribe(
        (response) => {
          console.log(response);
          this.isLoggedIn = response;
          if (this.isLoggedIn) {
            console.log("inside if : ", this.isLoggedIn);
            this.route.navigate(["/profile"]);
          } else {
            this.isLoginFailed = true;
            this.loginForm.reset();
          }
        },
        (error) => {
          this.isLoginFailed = true;
        }
      );
  }
}
