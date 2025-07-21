import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  loading = false;
  error = '';

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.error = '';
    
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('API Error:', error);
        if (error.status === 0) {
          this.error = 'Unable to connect to server. Please check your internet connection.';
        } else if (error.status >= 500) {
          this.error = 'Server error. Please try again later.';
        } else {
          this.error = `Failed to load students: ${error.message}`;
        }
        this.loading = false;
      }
    });
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.loadStudents(); // Reload the list
        },
        error: (error) => {
          this.error = 'Failed to delete student';
          console.error(error);
        }
      });
    }
  }

  viewSelected(): void {
    this.router.navigate(['/students/selected']);
  }

  importStudents(): void {
    this.router.navigate(['/students/import']);
  }

  testApiConnection(): void {
    this.studentService.testConnection().subscribe({
      next: (response) => {
        console.log('API Test Response:', response);
        alert('API Connection Successful: ' + response);
      },
      error: (error) => {
        console.error('API Test Error:', error);
        alert('API Connection Failed: ' + error.message);
      }
    });
  }
}