export interface InputValidation {
    required: {
      value: boolean;
      message: string;
    };
    minLength?: {
      value: number;
      message: string;
    };
    maxLength?: {
      value: number;
      message: string;
    };
    pattern?: {
      value: RegExp;
      message: string;
    };
  }
  
  export interface TripInput {
    id: any;
    label: string;
    type: string;
    name: any;
    icon?: any;
    placeholder?: string;
    validation?: InputValidation;
  }