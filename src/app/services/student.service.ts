import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Student } from '../models/student.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/Students`;

  constructor(private http: HttpClient) {}

  // Get all students
  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Delete student
  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get selected students (final score >= 3.1)
  getSelectedStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/selected`).pipe(
      catchError(this.handleError)
    );
  }

  // Import students from Excel
  importStudents(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/import`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // 🚀 NEW: Notify selected students via email
  notifySelectedStudents(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/notify-selected`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Test connection
  testConnection(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/test`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side errors
      if (error.error && typeof error.error === 'object') {
        if (error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error.error) {
          errorMessage = error.error.error;
        } else {
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
        }
      } else if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else {
        errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}