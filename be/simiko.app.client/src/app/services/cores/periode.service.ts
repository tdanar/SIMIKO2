import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormConfig } from '../../models/shared/form-field.model';


export interface Periode {
  id?: number;
  periode: string;
  startDate: string;
  endDate: string;
  aktif: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PeriodeService {
  private apiUrl = 'api/Periode';

  constructor(private http: HttpClient) { }

  // Get all periods
  getPeriodes(): Observable<Periode[]> {
    return this.http.get<Periode[]>(this.apiUrl);
  }

  // Get a specific period
  getPeriode(id: number): Observable<Periode> {
    return this.http.get<Periode>(`${this.apiUrl}/${id}`);
  }

  // Create a new period
  createPeriode(data: Periode): Observable<Periode> {
    return this.http.post<Periode>(this.apiUrl, data);
  }

  // Update an existing period
  updatePeriode(id: number, data: Periode): Observable<Periode> {
    return this.http.put<Periode>(`${this.apiUrl}/${id}`, data);
  }

  // Delete a period
  deletePeriode(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Activate a period
  activatePeriode(id: number): Observable<Periode> {
    return this.http.put<Periode>(`${this.apiUrl}/${id}/activate`, {});
  }

  // Activate a period
  deactivatePeriode(id: number): Observable<Periode> {
    return this.http.put<Periode>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  // Get form configuration for periode
  getFormConfig(isEdit: boolean = false): FormConfig {
    return {
      id: 'periode-form',
      title: isEdit ? 'Edit Periode' : 'Tambah Periode Baru',
      description: 'Silakan lengkapi informasi periode di bawah ini',
      submitButtonText: isEdit ? 'Simpan Perubahan' : 'Buat Periode',
      cancelButtonText: 'Batal',
      showCancelButton: true,
      layout: 'column',
      fields: [
        {
            key: 'Periode',
            label: 'Nama Periode',
            type: 'text',
            required: true,
            placeholder: 'Contoh: Periode 2025',
            validators: [
                { name: 'minLength', args: 3, message: 'Nama periode minimal 3 karakter' }
            ],
            icon: 'event',
            iconPosition: 'prefix',
            min: '',
            max: ''
        },
        {
            key: 'StartDate',
            label: 'Tanggal Mulai',
            type: 'date',
            required: true,
            hint: 'Format: DD/MM/YYYY',
            min: '',
            max: ''
        },
        {
            key: 'EndDate',
            label: 'Tanggal Selesai',
            type: 'date',
            required: true,
            hint: 'Format: DD/MM/YYYY',
            min: '',
            max: ''
        },
        {
            key: 'Aktif',
            label: 'Aktifkan Periode Ini',
            type: 'toggle',
            value: false,
            hint: 'Periode aktif akan digunakan sebagai periode default',
            required: '',
            min: '',
            max: ''
        }
      ]
    };
  }
}
