import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-selected-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-students.component.html',
  styleUrls: ['./selected-students.component.css']
})
export class SelectedStudentsComponent implements OnInit {
  students: Student[] = [];
  loading = false;
  error = '';

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadSelectedStudents();
  }

  loadSelectedStudents(): void {
    this.loading = true;
    this.studentService.getSelectedStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load selected students';
        this.loading = false;
        console.error(error);
      }
    });
  }
}