import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  changeRoleForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.changeRoleForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newRole: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.changeRoleForm.valid) {
      const { email, newRole } = this.changeRoleForm.value;
      this.userService.changeUserRole(email, newRole).subscribe({
        next: () => {
          this.snackBar.open('User role updated successfully!', 'Close', {
            duration: 3000
          });
          this.changeRoleForm.reset();
        },
        error: (err) => {
          this.error = 'Failed to update user role. Please try again.';
          console.error(err);
        }
      });
    }
  }
}
