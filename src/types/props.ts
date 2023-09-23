import { Publication, PublicationInput, TripInput, UserProfileData } from './types';
import { Column } from './types';
import { Trip, User } from './types'
export interface NewTripProps {
  inputs: TripInput[];
  title: string;
};

export interface NewTripFormProps {
    inputs: TripInput[];
};

export interface DayCardProps {
  day: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  trips: any[]
  setItems: any;
  handleDelete: any;
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
}

export interface DataTableProps  {
  columns: Column[];
  linkText: string;
};

export interface NewPassengerProps {
  title: string;
  columns: Column[];
};

export interface DataBoxProps {
  icon: any;
  text: string;
  children: React.ReactNode;
};
export interface OverviewChartProps {
  isDashboard?: boolean;
};

export interface ListProps {
  title: string;
  columns: Column[];
  linkText: string;
  icon: any;
};

export interface NewUserProps {
  title: string;
};
export interface NewTripFormProps  {
  inputs: TripInput[];
};
export interface MyTripsDataTableProps {
  columns: any;
  userTrips: Trip[];
  userData: User;
};
export interface DialogAnonPassengerProps  {
  id: string | undefined;
  setPassengers: any;
};

export interface UserDataTableProps  {
  columns: any;
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