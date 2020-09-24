import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { DataService } from "./data.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public dataService: DataService, public router: Router) {}

  canActivate(): boolean {
    // return true if authenticated else redirect to login page
    let userLoggedIn: boolean;
    this.dataService.getAuthStatus().subscribe(
      (response) => {
        console.log(response);
        if (response) {
          userLoggedIn = response;
        } else {
          this.router.navigate(["/login"]);
          userLoggedIn = false;
        }
      },
      (error) => {
        userLoggedIn = false;
        return userLoggedIn;
      }
    );
    return userLoggedIn;
  }
}
