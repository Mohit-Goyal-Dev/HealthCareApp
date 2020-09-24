import { Component, OnInit } from "@angular/core";
import { DataService } from "../../services/data.service";
import { Router } from "@angular/router";
import * as alertify from "alertify.js";
import { concatStatic } from "rxjs/operator/concat";

@Component({
  selector: "app-all-requested-appointments",
  templateUrl: "./all-requested-appointments.component.html",
  styleUrls: ["./all-requested-appointments.component.css"],
})
export class AllRequestedAppointmentsComponent implements OnInit {
  allAppointments;

  constructor(private dataService: DataService, private route: Router) {}

  ngOnInit() {
    // call appointments method by default
    this.appointments();
  }

  appointments() {
    // get all requested appointments from service
    this.dataService.requestedAppointments().subscribe((appointmentsList) => {
      this.allAppointments = appointmentsList;
      console.log("fetched appointments");
      console.log(appointmentsList);
    });
  }

  view(patientId) {
    // should navigate to 'patientList' page with selected patientId
    console.log("view details clicked : " + patientId);
    this.route.navigate(["/patientList/" + patientId]);
  }

  cancelAppointment(id) {
    // delete selected appointment uing service
    // After deleting the appointment, get all requested appointments
    console.log("cancelAppointment clicked : " + id);
    this.dataService.deleteAppointment(id).subscribe(
      (response) => {
        console.log(response);
        this.appointments();
      },
      (error) => {
        alert(error);
      }
    );
  }
}
