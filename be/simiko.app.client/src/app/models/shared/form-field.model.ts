export interface FormFieldConfig {
  key: string;
  label?: string;
  type: FormFieldType;
  value?: any;
  required: boolean | string;
  disabled?: boolean;
  placeholder?: string;
  validators?: ValidatorConfig[];
  errorMessages?: { [key: string]: string };
  options?: OptionConfig[];
  cols?: number;
  rows?: number;
  min: number | string;
  max: number | string;
  step?: number;
  pattern?: string;
  multiple?: boolean;
  fileTypes?: string;
  maxFileSize?: number;
  hint?: string;
  icon?: string;
  iconPosition?: 'prefix' | 'suffix';
  classes?: string;
  dependsOn?: string;
  conditionalFn?: (formValues: any) => boolean;
  autocompleteItems?: any[];
  autocompleteDisplayFn?: (item: any) => string;
}

export type FormFieldType =
  'text' |
  'number' |
  'email' |
  'password' |
  'textarea' |
  'select' |
  'multiselect' |
  'radio' |
  'checkbox' |
  'checkboxGroup' |
  'date' |
  'datetime' |
  'time' |
  'file' |
  'toggle' |
  'autocomplete' |
  'hidden' |
  'divider' |
  'heading';

export interface ValidatorConfig {
  name: string;
  args?: any;
  message?: string;
}

export interface OptionConfig {
  key: string | number;
  value: string;
  disabled?: boolean;
  group?: string;
}

export interface FormConfig {
  id: string;
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
  submitButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  layout?: 'column' | 'row' | 'grid';
  columnsCount?: number; // For grid layout
  fieldsetGroups?: FieldsetGroup[];
}

export interface FieldsetGroup {
  title?: string;
  description?: string;
  key: string;
  fields: string[]; // Array of field keys that belong to this fieldset
  expanded?: boolean;
}

export interface FormErrorState {
  [key: string]: {
    [validatorName: string]: boolean;
  };
}

export interface FormValueState {
  [key: string]: any;
}

export interface FormSubmitEvent {
  valid: boolean;
  values: FormValueState;
  originalEvent?: Event;
}
