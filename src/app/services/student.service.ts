import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<Student[]>(this.apiUrl);
  }

  // Delete student
  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get selected students (final score >= 3.1)
  getSelectedStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/selected`);
  }

  // Import students from Excel
  importStudents(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/import`, formData, { 
      responseType: 'text' 
    });
  }

  // Test connection
  testConnection(): Observable<string> {
    return this.http.post(`${this.apiUrl}/test`, {}, { responseType: 'text' });
  }
}