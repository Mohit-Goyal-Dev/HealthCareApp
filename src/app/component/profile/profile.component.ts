import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { Users } from "../../models/users.model";
import { DataService } from "../../services/data.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  // used as a flag to display or hide form
  editProfile = false;
  userId = -1;
  private userDetails = new Users();

  editProfileForm: FormGroup;
  userImg = "./../../assets/user.jpg";
  mobileErrMsg = "You must enter a valid mobile number";
  emailErrMsg = "You must enter a valid Email ID";
  locationErrMsg = "You must enter the location";

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // add necessary validators
    // username should be disabled. it should not be edited
    this.editProfileForm = new FormGroup({
      userName: new FormControl({
        value: "",
        disabled: true,
      }),
      mobile: new FormControl("", [
        Validators.required,
        Validators.pattern("[0-9 ]{10}"),
      ]),
      email: new FormControl("", [Validators.required, Validators.email]),
      location: new FormControl("", Validators.required),
    });

    // get login status from service
    // get userId from service and assign it to userId property
    // get profile details and display it

    this.userId = this.dataService.getUserId();
    this.getProfileDetails();
  }
  get userName() {
    return this.editProfileForm.get("userName");
  }
  get mobile() {
    return this.editProfileForm.get("mobile");
  }
  get email() {
    return this.editProfileForm.get("email");
  }
  get location() {
    return this.editProfileForm.get("location");
  }
  fillFormDetails() {
    this.editProfileForm.setValue({
      userName: this.userDetails.username,
      mobile: this.userDetails.mobile,
      email: this.userDetails.email,
      location: this.userDetails.location,
    });
  }
  changeMyProfile() {
    // if successfully changed the profile it should display new details hiding the form
    let user = new Users();
    user.location = this.location.value;
    user.mobile = this.mobile.value;
    user.userId = this.userId;
    user.username = this.userName.value;
    user.email = this.email.value;
    this.dataService.updateProfile(user).subscribe(
      (response) => {
        if (response) {
          this.getProfileDetails();
          this.discardEdit();
        }
      },
      (error) => {
        alert(error);
      }
    );
  }

  editMyProfile() {
    // change editProfile property value appropriately
    this.fillFormDetails();
    this.editProfile = !this.editProfile;
  }

  discardEdit() {
    // change editProfile property value appropriately
    // console.log(this.editProfileForm);
    // this.editProfileForm.reset();
    this.editProfile = !this.editProfile;
  }

  getProfileDetails() {
    // retrieve user details from service using userId
    this.dataService.getUserDetails(this.userId).subscribe(
      (userDetail) => {
        this.userDetails = userDetail;
        console.log(userDetail);
        console.log(this.userDetails.username);
      },
      (error) => {
        alert(error);
        this.userDetails = new Users();
      }
    );
  }
}
