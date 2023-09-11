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

export interface DataTableProps  {
  columns: Column[];
  linkText: string;
};

export type NewPassengerProps = {
  title: string;
  columns: Column[];
};

export interface OverviewChartProps  {
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