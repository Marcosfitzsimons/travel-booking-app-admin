export type InputValidation = {
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

export type Trip = {
  _id?: string;
  name: string;
  date: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  maxCapacity: number | undefined;
  price: number | undefined;
  available?: boolean;
  passengers?: any[];
}

export type PredefinedTrip = {
  name: string;
  from: string;
  to: string;
  departureTime?: string;
  arrivalTime?: string;
  maxCapacity: number | undefined;
  price: number | undefined;
}
  
export type TripInput = {
    id: any;
    label: string;
    type: string;
    name: any;
    icon?: any;
    placeholder?: string;
    validation?: InputValidation;
}

export type SpecialTrip = {
  name: string;
  date: Date | null | undefined;
  from: string;
  departureTime: string;
  to: string;
  maxCapacity: string;
  price: string;
};


export type UserInput = {
  id: any;
  label: string;
  type: string;
  placeholder?: string;
  validation?: InputValidation;
  icon?: any;
}

export type addressCda = {
  street: string;
  streetNumber: any;
  crossStreets: string;
};

export type User = {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    phone: number | undefined;
    image?: string;
    addressCda: addressCda;
    addressCapital: string;
    dni: number | undefined;
    status: "Pending" | "Active" | undefined;
    myTrips: [];
};

export type UserFormData = {
  _id?: string;
  fullName: string;
  username: string;
  addressCda: addressCda;
  addressCapital: string;
  dni: number | undefined;
  phone: undefined | number;
  email: string;
  image?: string;
};

export type UserProfileData = {
  _id?: string;
  fullName: string;
  username: string;
  addressCda: addressCda;
  addressCapital?: string;
  dni: number | undefined;
  phone: undefined | number;
  email: string;
  image?: string;
  status?: string;
}

export type Publication = {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  createdAt: string;
};

export type PublicationFormData = {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
}


export type PublicationInput = {
  id: any;
  label: string;
  type: string;
  name: any;
  placeholder?: string;
  validation?: InputValidation;
}

export type Passenger = {
  _id?: string;
  createdBy?: UserFormData;
  addressCda?: addressCda;
  addressCapital?: string;
  fullName?: string;
  isPaid?: boolean;
  dni?: string;
};

export type NewSpecialTrip = {
  name: string;
  date: Date | null;
  from: string;
  departureTime: string; // or number
  maxCapacity: number;
  price: string;
  defaultPassengerCount: number;
};

export type DayCardType = {
  _id: string;
  dayOfWeek: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  trips: any[]
}

export type SpecialPassenger = {
  _id?: string;
  fullName?: string;
  dni?: number | undefined;
};

export type Column = {
  field: string;
  headerName: string;
  width?: number;
  flex?: number;
  renderCell?: (params: any) => any;
}

export type ExtendedColumn = Column & {
  renderCell?: (params: any) => JSX.Element;
};

export type ChangePasswordData = {
  password: string;
  cpassword: string;
}