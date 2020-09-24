import { Component, OnInit, DoCheck, Inject } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { DataService } from "../../services/data.service";
import { Users } from "../../models/users.model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  userId = -1;
  private userDetails = new Users();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.userId = this.dataService.getUserId();
    // get userId from service and assign it to userId property
    this.getProfileDetails();
    // call getProfileDetails method to get user details
  }

  getProfileDetails() {
    // call getUserDetails method of dataService and assign response to userDetails property
    this.dataService.getUserDetails(this.userId).subscribe((userDetail) => {
      // console.log(userDetail);
      this.userDetails = userDetail;
    });
  }
}
