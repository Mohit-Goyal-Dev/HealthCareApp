import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { Users } from "../models/users.model";
import { Patient } from "../models/patient";
import { Appointment } from "../models/appointment";

import { ApiService } from "./api.service";

@Injectable()
export class DataService {
  isLoggedIn = false;
  isLogIn: BehaviorSubject<boolean>;
  constructor(private api: ApiService) {
    this.isLogIn = new BehaviorSubject<boolean>(false);
  }

  authenticateUser(username: string, password: string): Observable<boolean> {
    // store 'userId' from response as key name 'userId' to the localstorage

    // return true if user authenticated

    // return false if user not authenticated
    return this.api.checkLogin(username, password).map(
      (response) => {
        console.log(response);
        if (response && response.userId) {
          console.log(response);
          let loggedInUserId = response.userId;
          localStorage.setItem("userId", loggedInUserId.toString());
          return true;
        } else return false;
        // } else return of(false);
      },
      (error) => {
        // alert(error);
        return of(false);
      }
    );
    // return returnValue;
  }

  getAuthStatus(): Observable<boolean> {
    // return this.isLogIn.asObservable();
    let userId = localStorage.getItem("userId");
    if (userId) {
      this.isLogIn.next(true);
      return this.isLogIn.asObservable();
    }
    return this.isLogIn.asObservable();
  }
  doLogOut() {
    // remove the key 'userId' if exists
    console.log("logout method");
    if (localStorage.getItem("userId")) {
      localStorage.removeItem("userId");
      console.log("Logout");
      this.isLogIn.next(false);
      return this.isLogIn;
    } else {
      console.log("User not logged in.");

      return this.isLogIn;
    }
  }

  getUserDetails(userId: number): Observable<Users> {
    // should return user details retrieved from api service

    return this.api.getUserDetails(userId);
  }

  updateProfile(userDetails): Observable<boolean> {
    // should return the updated status according to the response from api service
    // console.log(userDetails);
    return this.api.updateDetails(userDetails).map(
      (userDetail) => {
        // console.log("indside updateprofile map");
        if (userDetail && userDetail.userId) {
          // console.log("indside updateprofile if");
          return true;
        } else return false;
      },
      (error) => {
        return false;
      }
    );
  }

  registerPatient(patientDetails): Observable<any> {
    // should return response retrieved from ApiService

    // handle error
    // console.log("inside registerpatient");
    return this.api.registerPatient(patientDetails).map(
      (patientDetail) => {
        // console.log("inside registerpatient map");
        // console.log(patientDetail);
        return patientDetail;
      },
      (error) => {
        return Observable.throw(error);
      }
    );
  }

  getAllPatientsList(): Observable<any> {
    // should return all patients list retrieved from ApiService

    // handle error

    return this.api.getAllPatientsList().map(
      (patientList) => {
        return patientList;
      },
      (error) => {
        return Observable.throw(error);
      }
    );
  }

  getParticularPatient(id): Observable<any> {
    // should return particular patient details retrieved from ApiService

    // handle error

    return this.api.getParticularPatient(id).map(
      (patient) => {
        return patient;
      },
      (error) => {
        return Observable.throw(error);
      }
    );
  }

  getDiseasesList(): Observable<any> {
    // should return response retrieved from ApiService

    // handle error

    return this.api.getDiseasesList().map(
      (diseaseList) => {
        return diseaseList;
      },
      (error) => {
        return Observable.throw(error);
      }
    );
  }

  bookAppointment(appointmentDetails): Observable<any> {
    // should return response retrieved from ApiService

    // handle error
    return this.api.bookAppointment(appointmentDetails).map(
      (appointmentDetail) => {
        return appointmentDetail;
      },
      (error) => {
        return Observable.throw(error);
      }
    );
  }

  getAppointments(patientId): Observable<any> {
    // should return response retrieved from ApiService

    // handle error
    return this.api.getAppointments(patientId).map(
      (appointmentList) => {
        return appointmentList;
      },
      (error) => {
        return Observable.throw(error);
      }
    );
  }

  deleteAppointment(appointmentId): Observable<any> {
    // should return response retrieved from ApiService

    // handle error
    return this.api.deleteAppointment(appointmentId).map(
      (res) => {
        return res;
      },
      (error) => {
        return Observable.throw(error);
      }
    );
  }

  requestedAppointments(): Observable<any> {
    // should return response retrieved from ApiService

    // handle error
    return this.api.requestedAppointments().map(
      (appointmentList) => {
        return appointmentList;
      },
      (error) => {
        return Observable.throw(error);
      }
    );
  }

  getUserId(): number {
    // retrieve 'userId' from localstorage
    let userId = +localStorage.getItem("userId");
    if (userId && this.isLogIn) return userId;
    else {
      userId = -1;
      return userId;
    }
  }
}
