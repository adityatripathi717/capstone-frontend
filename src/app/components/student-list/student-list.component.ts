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
  selectedStudents: Student[] = [];
  loading = false;
  error = '';
  showSelected = false;
  selectedFile: File | null = null;

  // Notification states
  notificationLoading = false;
  lastNotificationResult: string | null = null;

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
        console.log('Students loaded:', data.length);
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

  deleteStudent(student: Student): void {
    const confirmMessage = `Delete student "${student.firstName} ${student.lastName}"?\n\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
      this.studentService.deleteStudent(student.id).subscribe({
        next: () => {
          console.log('Student deleted successfully');
          alert(`✅ Student "${student.firstName} ${student.lastName}" deleted successfully.`);
          this.loadStudents(); // Reload the list
        },
        error: (error) => {
          console.error('Delete error:', error);
          this.error = 'Failed to delete student';
          alert(`❌ Failed to delete student: ${error.message}`);
        }
      });
    }
  }

  viewSelected(): void {
    this.loading = true;
    this.error = '';
    
    this.studentService.getSelectedStudents().subscribe({
      next: (data) => {
        this.selectedStudents = data;
        this.showSelected = true;
        this.loading = false;
        console.log('Selected students loaded:', data.length);
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Error loading selected students:', error);
      }
    });
  }

  backToAll(): void {
    this.showSelected = false;
    this.selectedStudents = [];
  }

  // 🚀 NEW: Handle file selection for import
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('File selected:', file.name);
    }
  }

  // 🚀 UPDATED: Import students with file upload
  importStudents(): void {
    if (!this.selectedFile) {
      alert('Please select an Excel file first!');
      return;
    }

    const confirmMessage = `Import students from "${this.selectedFile.name}"?\n\nThis will:\n• Add new students to the database\n• Calculate final scores automatically\n• Identify students eligible for selection (Score ≥ 3.1)`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.lastNotificationResult = null;

    this.studentService.importStudents(this.selectedFile).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Import response:', response);
        
        if (response.success) {
          alert('✅ Students imported successfully!\n\nYou can now:\n• View all students to see the imported data\n• View selected students to see who qualifies\n• Send notification emails to selected students');
          this.loadStudents(); // Refresh the list
          this.selectedFile = null;
          // Reset file input
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        } else {
          this.error = response.message || 'Import failed';
          alert(`❌ Import failed: ${this.error}`);
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message;
        console.error('Import error:', error);
        alert(`❌ Import failed: ${error.message}`);
      }
    });
  }

  // 🚀 NEW: Notify selected students via email
  notifySelected(): void {
    const confirmMessage = `📧 Send Email Notifications\n\nThis will send congratulatory emails to ALL students with Final Score ≥ 3.1.\n\n⚠️ Important:\n• Emails will be sent immediately\n• This action cannot be undone\n• Make sure the student data is correct\n\nDo you want to continue?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    this.notificationLoading = true;
    this.error = '';
    this.lastNotificationResult = null;

    this.studentService.notifySelectedStudents().subscribe({
      next: (response) => {
        this.notificationLoading = false;
        console.log('Notification response:', response);
        
        if (response.success) {
          const message = `✅ Email Notification Success!\n\n${response.details}\n\nSelected students: ${response.selectedCount || 'N/A'}`;
          this.lastNotificationResult = response.details;
          alert(message);
        } else {
          const errorMsg = response.message || 'Notification failed';
          this.error = errorMsg;
          alert(`⚠️ Notification Issue: ${errorMsg}`);
        }
      },
      error: (error) => {
        this.notificationLoading = false;
        this.error = error.message;
        console.error('Notification error:', error);
        
        let errorMessage = '❌ Failed to send notification emails\n\n';
        if (error.message.includes('timeout')) {
          errorMessage += 'The request timed out. The emails might still be processing in the background.';
        } else if (error.message.includes('Network')) {
          errorMessage += 'Network connection error. Please check your internet connection.';
        } else {
          errorMessage += `Error: ${error.message}`;
        }
        
        alert(errorMessage);
      }
    });
  }

  testApiConnection(): void {
    this.loading = true;
    this.error = '';

    this.studentService.testConnection().subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Test response:', response);
        
        if (response.success) {
          alert(`✅ API Connection Test Successful!\n\n${response.message}`);
        } else {
          alert(`⚠️ API Test Issue: ${response.message}`);
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message;
        console.error('Test error:', error);
        alert(`❌ API Connection Test Failed: ${error.message}`);
      }
    });
  }

  // 🚀 NEW: Utility methods for display
  getStatusBadgeClass(finalScore: number): string {
    return finalScore >= 3.1 ? 'badge-selected' : 'badge-not-selected';
  }

  getStatusText(finalScore: number): string {
    return finalScore >= 3.1 ? 'SELECTED' : 'Not Selected';
  }

  formatScore(score: number): string {
    return score.toFixed(2);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  // 🚀 NEW: Clear error message
  clearError(): void {
    this.error = '';
  }

  // 🚀 NEW: Get selected students count for display
  getSelectedCount(): number {
    return this.students.filter(s => s.finalScore >= 3.1).length;
  }

  // 🚀 NEW: Get total students count
  getTotalCount(): number {
    return this.students.length;
  }
}