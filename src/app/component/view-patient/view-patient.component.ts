import { Component, OnInit } from "@angular/core";
import { DataService } from "../../services/data.service";
//import {ActivatedRoute} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import "rxjs/add/operator/switchMap";
import { DatePipe } from "@angular/common";
import { Appointment } from "../../models/appointment";
import * as alertify from "alertify.js";

@Component({
  selector: "app-view-patient",
  templateUrl: "./view-patient.component.html",
  styleUrls: ["./view-patient.component.css"],
  providers: [DatePipe],
})
export class ViewPatientComponent implements OnInit {
  patient;
  names;
  today;
  isBookAppointment: boolean = true;
  isFormEnabled: boolean = false;
  isScheduledAppointment: boolean = true;
  isTableEnabled: boolean = false;
  appointmentForm: FormGroup;
  appointmentDetails = new Appointment();
  bookedAppointmentResponse;
  ScheduledAppointmentResponse;

  constructor(
    fb: FormBuilder,
    private route: Router,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) {
    this.today = this.datePipe.transform(Date.now(), "yyyy-MM-dd");

    // add necessary validators
    this.appointmentForm = fb.group({
      // selectDisease: [null, Validators.required],
      // tentativeDate: [null, Validators.required],
      // priority: [null, Validators.required],
      selectDisease: [null],
      tentativeDate: [null],
      priority: [null],
    });
  }
  get selectDisease() {
    return this.appointmentForm.get("selectDisease");
  }
  get tentativeDate() {
    return this.appointmentForm.get("tentativeDate");
  }
  get priority() {
    return this.appointmentForm.get("priority");
  }
  ngOnInit() {
    // get selected patient id
    // get Particular Patient from service using patient id and assign response to patient property
    let id = this.activatedRoute.snapshot.paramMap.get("id");
    this.dataService.getParticularPatient(id).subscribe((patientResponse) => {
      if (patientResponse && patientResponse.id) {
        this.patient = patientResponse;
      }
    });
  }

  bookAppointment() {
    // get diseases list from service
    // change isBookAppointment, isScheduledAppointment, isFormEnabled, isTableEnabled property values appropriately
    this.dataService.getDiseasesList().subscribe((diseaseList) => {
      if (diseaseList) {
        this.names = diseaseList;
        this.isFormEnabled = !this.isFormEnabled;
        this.isBookAppointment = !this.isBookAppointment;
        this.isScheduledAppointment = true;
        this.isTableEnabled = false;
        console.log("bookappointment");
      }
    });
  }

  scheduleAppointment() {
    // The below attributes to be added while booking appointment using service
    // patientId, patientFirstName, patientLastName, disease, priority, tentativedate, registeredTime
    // if booked successfully should redirect to 'requested_appointments' page
    this.appointmentDetails.patientId = this.patient.id;
    this.appointmentDetails.patientLastName = this.patient.lastName;
    this.appointmentDetails.patientFirstName = this.patient.firstName;
    this.appointmentDetails.disease = this.appointmentForm.value.selectDisease;
    this.appointmentDetails.priority = this.appointmentForm.value.priority;
    this.appointmentDetails.tentativedate = this.appointmentForm.value.tentativeDate;
    let registeredTime = new Date();
    this.appointmentDetails.registeredTime = registeredTime;
    console.log(
      this.appointmentForm.value.selectDisease,
      this.appointmentForm.value.priority,
      this.appointmentForm.value.tentativeDate
    );
    console.log(this.appointmentDetails);
    console.log("scheduleAppointment clicked");
    this.dataService.bookAppointment(this.appointmentDetails).subscribe(
      (appointmentResponse) => {
        if (appointmentResponse && appointmentResponse.id) {
          this.bookedAppointmentResponse = appointmentResponse;
          console.log(appointmentResponse);
          console.log("appointment booked");
          this.appointmentForm.reset();
          this.isFormEnabled = !this.isFormEnabled;
          this.isBookAppointment = !this.isBookAppointment;
          this.isScheduledAppointment = true;
          this.isTableEnabled = false;
          this.route.navigate(["/requested_appointments"]);
        }
      },
      (error) => {
        alert(error);
      }
    );
  }

  scheduledAppointment() {
    // change isBookAppointment, isScheduledAppointment, isFormEnabled, isTableEnabled property values appropriately
    // get particular patient appointments using getAppointments method of DataService
    this.isBookAppointment = true;
    this.isFormEnabled = false;
    this.dataService
      .getAppointments(this.patient.id)
      .subscribe((appointments: Appointment[]) => {
        console.log("inside getappointemtns method");
        this.isScheduledAppointment = false;
        if (appointments && appointments.length > 0) {
          console.log("inside getappointemtns method response if");
          console.log(appointments);
          this.ScheduledAppointmentResponse = appointments;
          this.isTableEnabled = true;
        } else {
          console.log("inside getappointemtns method response else");
          this.isTableEnabled = false;
          this.ScheduledAppointmentResponse = [];
        }
      });
    console.log("scheduledAppointment clicked");
  }

  cancelAppointment(id) {
    // delete selected appointment uing service
    // After deleting the appointment, get particular patient appointments
    this.dataService.deleteAppointment(id).subscribe((res) => {
      console.log(res);
      this.scheduledAppointment();
    });
    console.log("cancelAppointment clicked : " + id);
  }
}
