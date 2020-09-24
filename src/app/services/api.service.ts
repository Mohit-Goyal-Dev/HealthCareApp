import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { Credentials } from "../models/credentials.model";
import { Users } from "../models/users.model";
import { Patient } from "../models/patient";
import { Appointment } from "../models/appointment";

@Injectable()
export class ApiService {
  API_URL: String;
  AUTH_API_URL = "/auth/server/";

  constructor(private http: HttpClient) {
    this.API_URL = "api";
  }

  public checkLogin(
    username: string,
    password: string
  ): Observable<Credentials> {
    // should return response from server

    // handle error

    return this.http
      .post(this.API_URL + "/auth/server/", {
        username: username,
        password: password,
      })
      .map((response: { userId: number }) => {
        // console.log("inside api service");
        // console.log(response);
        // this.getUserDetails(response.userId).subscribe((user) => {
        //   console.log(user);
        // });
        let user = new Credentials({
          userId: response.userId,
          username: username,
          password: password,
          isLoggedIn: true,
        });
        // let user = new Credentials();
        // user.userId = response.userId;
        return user;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  public getUserDetails(userId: number): Observable<Users> {
    // should return user details retireved from server

    // handle error
    let url = this.API_URL + "/users/" + userId;

    return this.http
      .get(url)
      .map((user: Users) => {
        return user;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  public updateDetails(userDetails: Users): Observable<Users> {
    // should return user details if successfully updated the details

    // handle error
    let url = this.API_URL + "/users/" + userDetails.userId;
    return this.http
      .put(url, userDetails)
      .map((user: Users) => {
        // console.log("indside updateprofile api map");
        // console.log(user);
        return user;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  public registerPatient(patientDetails: any): Observable<any> {
    // should return response from server if patientDetails added successfully

    // handle error
    // console.log(patientDetails);
    return this.http
      .post(this.API_URL + "/allpatients", patientDetails)
      .map((patientDetail) => {
        // console.log("inside registerpatient map");
        // console.log(patientDetail);
        return patientDetail;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  public getAllPatientsList(): Observable<any> {
    // should return all patients from server

    // handle error
    return this.http
      .get(this.API_URL + "/allpatients")
      .map((patientList) => {
        return patientList;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  public getParticularPatient(id): Observable<any> {
    // should return particular patient details from server

    // handle error
    let url = this.API_URL + "/allpatients/" + id;
    return this.http
      .get(url)
      .map((patient) => {
        return patient;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  public getDiseasesList(): Observable<any> {
    // should return diseases from server

    // handle error
    return this.http
      .get(this.API_URL + "/diseases")
      .map((diseaseList) => {
        return diseaseList;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  public bookAppointment(appointmentDetails: any): Observable<any> {
    // should return response from server if appointment booked successfully

    // handle error
    return this.http
      .post(this.API_URL + "/reqappointments", appointmentDetails)
      .map((appointmentDetail) => {
        return appointmentDetail;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  public requestedAppointments(): Observable<any> {
    // should return all requested appointments from server

    // handle error
    return this.http
      .get(this.API_URL + "/reqappointments")
      .map((appointmentList) => {
        return appointmentList;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  public getAppointments(userId): Observable<any> {
    // should return appointments of particular patient from server

    // handle error
    let url = this.API_URL + "/reqappointments?patientId=" + userId;
    return this.http
      .get(url)
      .map((appointmentList) => {
        return appointmentList;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  public deleteAppointment(appointmentId): Observable<any> {
    // should delete the appointment

    // handle error
    let url = this.API_URL + "/reqappointments/" + appointmentId;
    return this.http
      .delete(url)
      .map((res) => {
        return res;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  private handleError(error: Response | any) {
    return Observable.throw(error);
  }
}
