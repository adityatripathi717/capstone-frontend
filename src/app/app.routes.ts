import { Routes } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list.component';
import { SelectedStudentsComponent } from './components/selected-students/selected-students.component';
import { ImportStudentsComponent } from './components/import-students/import-students.component';

export const routes: Routes = [
  { path: '', redirectTo: '/students', pathMatch: 'full' },
  { path: 'students', component: StudentListComponent },
  { path: 'students/selected', component: SelectedStudentsComponent },
  { path: 'students/import', component: ImportStudentsComponent }
];