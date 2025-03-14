import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FormConfig, FormSubmitEvent } from '../../models/shared/form-field.model';
import { PeriodeService, Periode } from '../../services/cores/periode.service';

@Component({
  selector: 'app-periode-form',
  standalone: false,
  templateUrl: './periode-form.component.html',
  styleUrl: './periode-form.component.css'
})
export class PeriodeFormComponent implements OnInit {
  formConfig!: FormConfig;
  initialValues: any = {};
  submitInProgress = false;
  periodeId: number | null = null;
  isEditMode = false;
  errorMessage: string | null = null;

  constructor(
    private periodeService: PeriodeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Check if we're in edit mode by looking for an ID in the route params
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.periodeId = +params['id'];
        this.isEditMode = true;
        this.loadPeriodeData();
      }

      // Get form configuration
      this.formConfig = this.periodeService.getFormConfig(this.isEditMode);
    });
  }

  async loadPeriodeData() {
    if (!this.periodeId) return;

    try {
      // Use firstValueFrom to convert observable to promise
      const data = await firstValueFrom(this.periodeService.getPeriode(this.periodeId));

      // Format dates for the date picker (assumes date format YYYY-MM-DD from API)
      this.initialValues = {
        periode: data.periode,
        startDate: data.startDate, // Angular Material date picker expects Date object or ISO string
        endDate: data.endDate,
        aktif: data.aktif
      };
    } catch (error: any) {
      this.errorMessage = 'Error loading data: ' + (error.message || 'Unknown error');
      this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
    }
  }

  async onFormSubmit(event: FormSubmitEvent) {
    if (!event.valid) {
      this.snackBar.open('Form is invalid. Please correct the errors.', 'Close', { duration: 3000 });
      return;
    }

    this.submitInProgress = true;
    this.errorMessage = null;

    try {
      const formData: Periode = {
        periode: event.values['periode'],
        startDate: event.values['startDate'],
        endDate: event.values['endDate'],
        aktif: event.values['aktif']
      };

      if (this.isEditMode && this.periodeId) {
        // Update existing periode
        await firstValueFrom(this.periodeService.updatePeriode(this.periodeId, formData));
        this.snackBar.open('Periode berhasil diperbarui', 'Close', { duration: 3000 });
      } else {
        // Create new periode
        await firstValueFrom(this.periodeService.createPeriode(formData));
        this.snackBar.open('Periode baru berhasil dibuat', 'Close', { duration: 3000 });
      }

      // Redirect to periode list
      this.router.navigate(['/periodes']);

    } catch (error: any) {
      this.errorMessage = 'Error submitting form: ' + (error.message || 'Unknown error');
      this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
    } finally {
      this.submitInProgress = false;
    }
  }

  onFormCancel() {
    // Navigate back to list page
    this.router.navigate(['/periodes']);
  }
}
