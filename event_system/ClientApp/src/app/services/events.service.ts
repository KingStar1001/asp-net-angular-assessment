import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CustomEvent } from '../models/custom-event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private apiURL = "http://localhost:5002/api";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  /**
   * Write code on Method
   *
   * @return response()
   */
  getAll(): Observable<any> {

    return this.httpClient.get(this.apiURL + '/Event/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  create(customEvent: CustomEvent): Observable<any> {

    return this.httpClient.post(this.apiURL + '/Event/', JSON.stringify(customEvent), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  find(id: number): Observable<any> {

    return this.httpClient.get(this.apiURL + '/Event/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  update(id: number, customEvent: CustomEvent): Observable<any> {

    return this.httpClient.put(this.apiURL + '/Event/' + id, JSON.stringify(customEvent), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  delete(id: number) {
    return this.httpClient.delete(this.apiURL + '/Event/' + id, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /** 
   * Write code on Method
   *
   * @return response()
   */
  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
