import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormConfig, FormSubmitEvent, FormFieldConfig } from '../../../models/shared/form-field.model';
import { FormService } from '../../../services/shared/form.service';

@Component({
  selector: 'app-dynamic-form',
  standalone: false,
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() formConfig!: FormConfig;
  @Input() initialValues: any = {};
  @Input() submitInProgress = false;
  @Input() readOnly = false;

  @Output() formSubmit = new EventEmitter<FormSubmitEvent>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() fieldChange = new EventEmitter<{ field: string, value: any }>();

  form!: FormGroup;
  filteredOptions: { [key: string]: Observable<any[]> } = {};
  fieldGroups: { [key: string]: FormFieldConfig[] } = {};

  // Add this property to fix the hidePassword error
  hidePassword = true;

  constructor(private formService: FormService, private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formConfig'] && !changes['formConfig'].firstChange) {
      this.initForm();
    }

    if (changes['initialValues'] && this.form) {
      this.formService.updateFormValues(this.form, this.initialValues);
    }

    if (changes['readOnly'] && this.form) {
      this.updateFormReadOnly();
    }
  }

  private initForm() {
    if (!this.formConfig) {
      return;
    }

    this.form = this.formService.createFormGroup(this.formConfig);

    // Setup filtered options for autocomplete fields
    this.setupAutocompleteFields();

    // Initialize with initial values if provided
    if (this.initialValues) {
      this.formService.updateFormValues(this.form, this.initialValues);
    }

    // Setup form field groups if using fieldsets
    this.setupFieldGroups();

    // Update conditional fields visibility
    this.formService.updateConditionalFields(this.form, this.formConfig);

    // Subscribe to value changes for dependent and conditional fields
    this.setupDependentFields();

    // Apply read-only mode if needed
    if (this.readOnly) {
      this.updateFormReadOnly();
    }
  }

  private setupAutocompleteFields() {
    this.formConfig.fields
      .filter(field => field.type === 'autocomplete' && field.autocompleteItems)
      .forEach(field => {
        const control = this.form.get(field.key);
        if (control) {
          this.filteredOptions[field.key] = control.valueChanges.pipe(
            startWith(''),
            map(value => {
              const searchText = typeof value === 'string' ? value :
                (field.autocompleteDisplayFn ? field.autocompleteDisplayFn(value) : '');
              return this.filterAutocomplete(searchText, field.autocompleteItems || []);
            })
          );
        }
      });
  }

  private filterAutocomplete(value: string, options: any[]): any[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => {
      if (typeof option === 'string') {
        return option.toLowerCase().includes(filterValue);
      } else if (option.name) {
        return option.name.toLowerCase().includes(filterValue);
      } else if (option.label) {
        return option.label.toLowerCase().includes(filterValue);
      } else if (option.value) {
        return option.value.toLowerCase().includes(filterValue);
      }
      return false;
    });
  }

  private setupFieldGroups() {
    // If fieldset groups are defined, organize fields by group
    if (this.formConfig.fieldsetGroups && this.formConfig.fieldsetGroups.length > 0) {
      // Initialize each group
      this.formConfig.fieldsetGroups.forEach(group => {
        this.fieldGroups[group.key] = [];
      });

      // Assign fields to their respective groups
      this.formConfig.fields.forEach(field => {
        const group = this.formConfig.fieldsetGroups?.find(g =>
          g.fields.includes(field.key)
        );

        if (group) {
          this.fieldGroups[group.key].push(field);
        }
      });
    }
  }

  private setupDependentFields() {
    // Find all fields that are depended upon by other fields
    const dependencyFields = new Set<string>();
    this.formConfig.fields.forEach(field => {
      if (field.dependsOn) {
        dependencyFields.add(field.dependsOn);
      }
    });

    // Subscribe to changes in those fields
    dependencyFields.forEach(fieldKey => {
      const control = this.form.get(fieldKey);
      if (control) {
        control.valueChanges.subscribe(() => {
          this.formService.updateConditionalFields(this.form, this.formConfig);
        });
      }
    });
  }

  private updateFormReadOnly() {
    if (this.readOnly) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.disable();
      });
    } else {
      Object.keys(this.form.controls).forEach(key => {
        const field = this.formConfig.fields.find(f => f.key === key);
        if (field && !field.disabled) {
          this.form.get(key)?.enable();
        }
      });
    }
  }

  onSubmit(event: Event) {
    // Mark all controls as touched to trigger validation
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });

    if (this.form.valid) {
      this.formSubmit.emit({
        valid: true,
        values: this.form.getRawValue(), // Use getRawValue to include disabled controls
        originalEvent: event
      });
    } else {
      this.formSubmit.emit({
        valid: false,
        values: this.form.getRawValue(),
        originalEvent: event
      });
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  onFieldChange(fieldKey: string, event: any) {
    // Handle different types of events properly
    let value;

    if (event === null || event === undefined) {
      value = event;
    }
    // For MatSelect and similar components that emit objects with value property
    else if (event.value !== undefined) {
      value = event.value;
    }
    // For DOM events from standard inputs
    else if (event.target && event.target.value !== undefined) {
      value = event.target.value;
    }
    // For direct values (like from datepickers, boolean from checkboxes, etc.)
    else {
      value = event;
    }

    this.fieldChange.emit({ field: fieldKey, value });
  }

  hasError(fieldKey: string, errorType: string): boolean {
    return this.formService.hasError(this.form, fieldKey, errorType);
  }

  getErrorMessage(field: FormFieldConfig): string {
    const control = this.form.get(field.key);
    if (control?.errors) {
      const errorType = Object.keys(control.errors)[0];
      return this.formService.getErrorMessage(field, errorType);
    }
    return '';
  }

  displayFn(field: FormFieldConfig): (item: any) => string {
    return (item: any) => {
      if (field.autocompleteDisplayFn) {
        return field.autocompleteDisplayFn(item);
      }

      if (!item) {
        return '';
      }

      if (typeof item === 'string') {
        return item;
      }

      return item.name || item.label || item.value || '';
    };
  }

  // Helper method to check if a field is visible based on conditions
  isFieldVisible(field: FormFieldConfig): boolean {
    if (!field.conditionalFn && !field.dependsOn) {
      return true;
    }

    if (field.conditionalFn) {
      return field.conditionalFn(this.form.value);
    }

    if (field.dependsOn) {
      const dependsOnValue = this.form.get(field.dependsOn)?.value;
      return !!dependsOnValue;
    }

    return true;
  }

  // Helper method to get fieldset expanded state
  isFieldsetExpanded(groupKey: string): boolean {
    const group = this.formConfig.fieldsetGroups?.find(g => g.key === groupKey);
    return group?.expanded !== false; // Default to expanded if not specified
  }

  // Helper to toggle fieldset expanded state
  toggleFieldset(groupKey: string) {
    const group = this.formConfig.fieldsetGroups?.find(g => g.key === groupKey);
    if (group) {
      group.expanded = !group.expanded;
    }
  }

  // Helper to get column class based on layout and field config
  getColumnClass(field: FormFieldConfig): string {
    if (this.formConfig.layout === 'grid') {
      return `col-${field.cols || 12}`;
    }
    return 'col-12';
  }
}
