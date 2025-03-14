import { Injectable } from '@angular/core';
import { FormGroup, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormConfig, FormFieldConfig } from '../../models/shared/form-field.model';


@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  constructor() { }

  /**
   * Mengekstrak field error berdasarkan kode error
   */
  getFieldError(form: FormGroup, fieldName: string, errorCode: string): any {
    const control = form.get(fieldName);
    if (control && control.errors && control.errors[errorCode]) {
      return control.errors[errorCode];
    }
    return null;
  }

  /**
   * Mendapatkan semua error dari form
   */
  getAllFormErrors(form: FormGroup): { [key: string]: any } {
    const errors: { [key: string]: any } = {};

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control instanceof FormGroup) {
        const nestedErrors = this.getAllFormErrors(control);
        if (Object.keys(nestedErrors).length > 0) {
          errors[key] = nestedErrors;
        }
      } else if (control instanceof FormArray) {
        const arrayErrors: any[] = [];
        control.controls.forEach((arrayControl, index) => {
          if (arrayControl instanceof FormGroup) {
            const nestedErrors = this.getAllFormErrors(arrayControl);
            if (Object.keys(nestedErrors).length > 0) {
              arrayErrors[index] = nestedErrors;
            }
          } else if (arrayControl.errors) {
            arrayErrors[index] = arrayControl.errors;
          }
        });
        if (arrayErrors.length > 0) {
          errors[key] = arrayErrors;
        }
      } else if (control && control.errors) {
        errors[key] = control.errors;
      }
    });

    return errors;
  }

  /**
   * Mark semua field form sebagai touched
   */
  markFormGroupTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      } else if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Mendapatkan form data yang sudah di-clean (tanpa field tidak valid)
   */
  getCleanFormData(form: FormGroup): any {
    const formData: any = {};

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control instanceof FormGroup) {
        formData[key] = this.getCleanFormData(control);
      } else if (control instanceof FormArray) {
        formData[key] = control.controls.map(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            return this.getCleanFormData(arrayControl);
          }
          return arrayControl.value;
        });
      } else if (control && !control.errors) {
        formData[key] = control.value;
      }
    });

    return formData;
  }

  /**
   * Validasi file type
   */
  validateFileType(file: File, allowedTypes: string): boolean {
    // Contoh allowedTypes: 'image/*' atau '.pdf,.doc'
    if (!allowedTypes) {
      return true;
    }

    const fileType = file.type;
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (allowedTypes.includes('*')) {
      // Handle wildcard types (e.g., image/*)
      const mainType = allowedTypes.split('/')[0];
      return fileType.startsWith(mainType + '/');
    } else {
      // Handle specific extensions
      const types = allowedTypes.split(',');
      return types.some(type => {
        type = type.trim();
        if (type.startsWith('.')) {
          // Check extension
          return fileExtension === type.toLowerCase();
        } else {
          // Check MIME type
          return fileType === type;
        }
      });
    }
  }

  /**
   * Validasi file size
   */
  validateFileSize(file: File, maxSize: number): boolean {
    if (!maxSize) {
      return true;
    }

    return file.size <= maxSize;
  }

  /**
   * Format file size untuk tampilan
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Membuat custom validator untuk perbandingan field
   */
  createCompareValidator(targetKey: string, compareType: 'equal' | 'notEqual' | 'greaterThan' | 'lessThan'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }

      const targetControl = control.parent.get(targetKey);
      if (!targetControl) {
        return null;
      }

      const targetValue = targetControl.value;
      const currentValue = control.value;

      switch (compareType) {
        case 'equal':
          return targetValue === currentValue ? null : { 'equal': { targetValue, currentValue } };
        case 'notEqual':
          return targetValue !== currentValue ? null : { 'notEqual': { targetValue, currentValue } };
        case 'greaterThan':
          return currentValue > targetValue ? null : { 'greaterThan': { targetValue, currentValue } };
        case 'lessThan':
          return currentValue < targetValue ? null : { 'lessThan': { targetValue, currentValue } };
        default:
          return null;
      }
    };
  }

  /**
   * Mendapatkan field config berdasarkan key
   */
  getFieldConfig(formConfig: FormConfig, fieldKey: string): FormFieldConfig | undefined {
    return formConfig.fields.find(field => field.key === fieldKey);
  }

  /**
   * Membuat validasi untuk maximum date (tidak boleh melebihi tanggal tertentu)
   */
  createMaxDateValidator(maxDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const controlDate = new Date(control.value);
      if (controlDate > maxDate) {
        return { 'maxDate': { max: maxDate, actual: controlDate } };
      }

      return null;
    };
  }

  /**
   * Membuat validasi untuk minimum date (tidak boleh kurang dari tanggal tertentu)
   */
  createMinDateValidator(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const controlDate = new Date(control.value);
      if (controlDate < minDate) {
        return { 'minDate': { min: minDate, actual: controlDate } };
      }

      return null;
    };
  }

  /**
   * Mengubah date string ke format yang sesuai
   */
  formatDate(date: Date | string, format: string = 'yyyy-MM-dd'): string {
    // Ini adalah implementasi sederhana, untuk produksi gunakan DatePipe atau library lain
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    if (format === 'yyyy-MM-dd') {
      return `${year}-${month}-${day}`;
    } else if (format === 'dd/MM/yyyy') {
      return `${day}/${month}/${year}`;
    } else if (format === 'MM/dd/yyyy') {
      return `${month}/${day}/${year}`;
    }

    return `${year}-${month}-${day}`;
  }

  /**
   * Convert FormData object untuk upload file
   */
  toFormData(data: any): FormData {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
      const value = data[key];

      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (Array.isArray(value) && value[0] instanceof File) {
        // Handle array of files
        value.forEach((file: File) => {
          formData.append(`${key}[]`, file, file.name);
        });
      } else if (value === null || value === undefined) {
        // Skip null or undefined values
      } else if (typeof value === 'object' && !(value instanceof File)) {
        // Handle nested objects
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });

    return formData;
  }
}
