import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { Patient } from "../../models/patient";
import { DataService } from "../../services/data.service";
import * as alertify from "alertify.js";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
  providers: [DatePipe],
})
export class FormComponent implements OnInit {
  complexForm: FormGroup;
  patientDetails = new Patient();
  today: string;
  result;

  noRecordsFound =
    "No patient records found in the list. Click on Register New Patient to add Patient details.";

  emptyFirstname = "You must include a first name.";
  minlengthFirstname = "Your first name must be at least 3 characters long.";
  maxlengthFirstname = "Your first name cannot exceed 20 characters.";
  emptyLastname = "You must include a last name.";
  minlengthLastname = "Your last name must be at least 3 characters long.";
  maxlengthLastname = "Your last name cannot exceed 20 characters.";
  noGender = "You must select a gender.";
  noDob = "You must select a valid date of birth.";
  noMobile = "You must include mobile number.";
  numberMobile = "You must enter a valid 10 digit mobile number.";
  maxlengthMobile = "Your mobile number should not exceed 10 digits.";
  noEmail = "You must include a valid email.";
  patternEmail = "Pattern does not match.";

  ngOnInit() {
    this.today = this.datePipe.transform(Date.now(), "yyyy-MM-dd");
  }

  constructor(
    fb: FormBuilder,
    private datePipe: DatePipe,
    private route: Router,
    private dataService: DataService
  ) {
    // add necessary validators

    this.complexForm = fb.group({
      firstName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      lastName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      gender: [null, Validators.required],
      dob: [null, Validators.required],
      mobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9 ]{10,}$"),
          Validators.maxLength(10),
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      description: "",
    });
  }

  get firstName() {
    return this.complexForm.get("firstName");
  }
  get lastName() {
    return this.complexForm.get("lastName");
  }
  get gender() {
    return this.complexForm.get("gender");
  }
  get dob() {
    return this.complexForm.get("dob");
  }
  get mobile() {
    return this.complexForm.get("mobile");
  }
  get email() {
    return this.complexForm.get("email");
  }
  get description() {
    return this.complexForm.get("description");
  }
  submitForm(value: any) {
    // assign new date object to reportedTime
    // should reister new patient using service
    // if added successfully should redirect to 'patientList' page
    // console.log(value);
    let registerDate = new Date();
    value["registeredTime"] = registerDate;
    let newPatient = new Patient(...value);
    // console.log(newPatient);
    this.dataService.registerPatient(newPatient).subscribe((response) => {
      if (response && response.id) {
        console.log(response);
        this.route.navigate(["/patientList"]);
      }
    });
  }
}
