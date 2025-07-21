import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-import-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './import-students.component.html',
  styleUrls: ['./import-students.component.css']
})
export class ImportStudentsComponent {
  selectedFile: File | null = null;
  loading = false;
  error = '';
  success = '';

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel' // .xls
      ];
      
      if (allowedTypes.includes(file.type)) {
        this.selectedFile = file;
        this.error = '';
        this.success = '';
      } else {
        this.error = 'Please select a valid Excel file (.xlsx or .xls)';
        this.selectedFile = null;
      }
    }
  }

  onImport(): void {
    if (!this.selectedFile) {
      this.error = 'Please select a file';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.studentService.importStudents(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Import response:', response);
        this.success = response || 'Students imported successfully!';
        this.loading = false;
        
        // Navigate back to students list after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/students']);
        }, 3000);
      },
      error: (error) => {
        console.error('Import error:', error);
        this.loading = false;
        
        if (error.status === 0) {
          this.error = 'Unable to connect to server. Please check your internet connection.';
        } else if (error.status === 400) {
          this.error = 'Invalid file format or data. Please check your Excel file.';
        } else if (error.status === 500) {
          this.error = 'Server error occurred while processing the file.';
        } else {
          this.error = `Failed to import students: ${error.message || 'Unknown error'}`;
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/students']);
  }
}