import { Injectable } from "@angular/core";
import { FormConfig, FormErrorState, FormFieldConfig, FormValueState, ValidatorConfig } from "../../models/shared/form-field.model";
import { BehaviorSubject } from "rxjs";
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";


@Injectable({
  providedIn: 'root'
})
export class FormService {
  private formErrorSubject = new BehaviorSubject<FormErrorState>({});
  private formValueSubject = new BehaviorSubject<FormValueState>({});

  public formErrors$ = this.formErrorSubject.asObservable();
  public formValues$ = this.formValueSubject.asObservable();

  constructor(private fb: FormBuilder) { }

  /**
   * Create a form group based on a form configuration
   */
  createFormGroup(config: FormConfig): FormGroup {
    const formGroup = this.fb.group({});

    config.fields.forEach(field => {
      if (field.type === 'divider' || field.type === 'heading') {
        // Skip dividers and headings as they don't need form controls
        return;
      }

      // Create validators array
      const validators: ValidatorFn[] = [];

      // Add required validator if field is required
      if (field.required) {
        validators.push(Validators.required);
      }

      // Add email validator for email fields
      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      // Add min/max validators for number fields
      if (field.type === 'number') {
        if (field.min !== undefined) {
          validators.push(Validators.min(+field.min));
        }
        if (field.max !== undefined) {
          validators.push(Validators.max(+field.max));
        }
      }

      // Add pattern validator if pattern is provided
      if (field.pattern) {
        validators.push(Validators.pattern(field.pattern));
      }

      // Add custom validators
      if (field.validators && field.validators.length > 0) {
        field.validators.forEach(validator => {
          validators.push(this.getValidator(validator));
        });
      }

      // Create form control
      const control = new FormControl(
        { value: field.value || '', disabled: field.disabled },
        validators
      );

      // Add control to form group
      formGroup.addControl(field.key, control);
    });

    // Set up the error and value subscribers
    this.setupFormValueChanges(formGroup);
    this.setupFormStatusChanges(formGroup, config);

    return formGroup;
  }

  /**
   * Reset a form to its initial state
   */
  resetForm(form: FormGroup, config: FormConfig): void {
    const initialValues: any = {};

    config.fields.forEach(field => {
      if (field.type !== 'divider' && field.type !== 'heading') {
        initialValues[field.key] = field.value || '';
      }
    });

    form.reset(initialValues);
  }

  /**
   * Update form values programmatically
   */
  updateFormValues(form: FormGroup, values: any): void {
    Object.keys(values).forEach(key => {
      if (form.contains(key)) {
        form.get(key)?.setValue(values[key]);
      }
    });
  }

  /**
   * Enable or disable a specific form field
   */
  setFieldState(form: FormGroup, fieldKey: string, disabled: boolean): void {
    const control = form.get(fieldKey);
    if (control) {
      if (disabled) {
        control.disable();
      } else {
        control.enable();
      }
    }
  }

  /**
   * Set the visibility of conditional fields based on other field values
   */
  updateConditionalFields(form: FormGroup, config: FormConfig): void {
    config.fields.forEach(field => {
      if (field.conditionalFn) {
        const shouldShow = field.conditionalFn(form.value);
        this.setFieldState(form, field.key, !shouldShow);
      }

      if (field.dependsOn) {
        const dependsOnValue = form.get(field.dependsOn)?.value;
        if (!dependsOnValue) {
          this.setFieldState(form, field.key, true);
        } else {
          this.setFieldState(form, field.key, false);
        }
      }
    });
  }

  /**
   * Get custom validator based on validator config
   */
  private getValidator(validatorConfig: ValidatorConfig): ValidatorFn {
    switch (validatorConfig.name) {
      case 'minLength':
        return Validators.minLength(validatorConfig.args);
      case 'maxLength':
        return Validators.maxLength(validatorConfig.args);
      case 'pattern':
        return Validators.pattern(validatorConfig.args);
      case 'email':
        return Validators.email;
      // Add more custom validators as needed
      default:
        return () => null;
    }
  }

  /**
   * Subscribe to form value changes to update the value state
   */
  private setupFormValueChanges(form: FormGroup): void {
    form.valueChanges.subscribe(values => {
      this.formValueSubject.next(values);
    });
  }

  /**
   * Subscribe to form status changes to update the error state
   */
  private setupFormStatusChanges(form: FormGroup, config: FormConfig): void {
    form.statusChanges.subscribe(() => {
      const errorState: FormErrorState = {};

      config.fields.forEach(field => {
        if (field.type !== 'divider' && field.type !== 'heading') {
          const control = form.get(field.key);
          if (control && control.errors) {
            errorState[field.key] = {};
            Object.keys(control.errors).forEach(errorKey => {
              errorState[field.key][errorKey] = true;
            });
          }
        }
      });

      this.formErrorSubject.next(errorState);
    });
  }

  /**
   * Get error message for field and error type
   */
  getErrorMessage(field: FormFieldConfig, errorType: string): string {
    if (field.errorMessages && field.errorMessages[errorType]) {
      return field.errorMessages[errorType];
    }

    // Default error messages
    switch (errorType) {
      case 'required':
        return `${field.label} is required.`;
      case 'email':
        return `Please enter a valid email address.`;
      case 'minlength':
        const minLength = field.validators?.find(v => v.name === 'minLength')?.args;
        return `Minimum length is ${minLength} characters.`;
      case 'maxlength':
        const maxLength = field.validators?.find(v => v.name === 'maxLength')?.args;
        return `Maximum length is ${maxLength} characters.`;
      case 'pattern':
        return `Please enter a valid value.`;
      case 'min':
        return `Minimum value is ${field.min}.`;
      case 'max':
        return `Maximum value is ${field.max}.`;
      default:
        return 'Invalid value.';
    }
  }

  /**
   * Check if a form control has a specific error
   */
  hasError(form: FormGroup, fieldKey: string, errorType: string): boolean {
    const control = form.get(fieldKey);
    return control?.errors?.[errorType] && control.touched;
  }
}
