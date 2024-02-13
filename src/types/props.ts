import { Income } from '@/context/AuthContext';
import { MonthlyIncome, Passenger, Publication, PublicationInput, TripInput, UserProfileData, UserTrips } from './types';
import { Trip, User } from './types'
import { ColumnDef } from '@tanstack/react-table';
export interface NewTripProps {
  inputs: TripInput[];
  title: string;
};

export interface NewTripFormProps {
    inputs: TripInput[];
};

export interface IncomeStatisticsProps {
    icon: any;
    title: string;
    error: boolean;
    loading: boolean;
    incomes: Income[]
}

export interface MyTripsDataTableProps {
  columns: ColumnDef<UserTrips>[]
  userId: string;
  userTrips: UserTrips[];
};

export interface TopMonthlyIncomesProps {
  incomes: MonthlyIncome[];
  loading: boolean;
  error: boolean;
}

export interface RecentIncomesProps {
  incomes: Income[];
  loading: boolean;
  error: boolean;
}

export interface DayCardProps {
  day: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  trips: any[]
  setItems: any;
  handleDelete: any;
  items: any[]
}

export interface IncomesProps {
  isLoading: boolean;
  error: boolean;
  incomes: Income[]
}

export interface NewPredefinedTripDialogProps {
  day: string;
  setItems: any;
}
export interface TripItemProps {
  name: string;
  id: string;
  day: string;
  from: string;
  to: string;
  price: number | undefined;
  maxCapacity: number | undefined;
  arrivalTime: string;
  handleDelete: any;
  departureTime: string;
  items: any;
  setItems: any;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  linkText: string;
};

export interface NewPassengerProps<TData, TValue> {
  title: string;
  columns: ColumnDef<TData, TValue>[]
};

export interface DataBoxProps {
  icon: any;
  text: string;
  children: React.ReactNode;
};
export interface OverviewChartProps {
  isDashboard?: boolean;
};

export interface ListProps<TData, TValue> {
  title: string;
  columns: ColumnDef<TData, TValue>[]
  linkText: string;
  icon: any;
};

export interface NewUserProps {
  title: string;
};
export interface NewTripFormProps  {
  inputs: TripInput[];
};

export interface DialogAnonPassengerProps  {
  id: string | undefined;
  setPassengers: any;
};

export interface UserDataTableProps<TData, TValue>  {
  columns: ColumnDef<TData, TValue>[];
  tripId: string | undefined;
};

export interface TotalCountCardProps {
  icon: any;
  title: string;
  value: any;
};

export interface PublicationCardProps {
  item: Publication;
  setList: (value: any) => void;
  list: Publication[];
}

export interface NewPublicationProps {
  inputs: PublicationInput[];
  title: string;
};

export interface NewPublicationFormProps {
  inputs: PublicationInput[];
};

export interface UserInfoProps {
  userData: UserProfileData;
}

export interface SearchUserInputProps {
  filter: string;
  setFilter: (value: string) => void;
};

export interface DatePickerProps {
  date: Date | undefined;
  isForm?: boolean,
  isModal?: boolean,
  setDate: (date: Date | undefined) => void;
}


export interface TripCardProps {
  data: Trip;
  register: any;
  handleOnSubmitEdit: any;
  departureTimeValue: string;
  isSubmitted: boolean;
  arrivalTimeValue: string;
  errors: any;
  setDepartureTimeValue: any;
  setIsDialogOpen: any;
  isDialogOpen: boolean;
  handleSubmit: any;
  setDate: (date: Date | undefined) => void;
  date: Date | undefined;
  passengers: Passenger[];
  setArrivalTimeValue: any;
};