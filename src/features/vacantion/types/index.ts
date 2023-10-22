import { ReactNode } from "react";

export interface PropsVacations {
  currentVacation: {
    startDate: string;
    endDate: string;
  };

  vacationsList: {
    startDate: string;
    endDate: string;
  }[];
}

export interface StepsProps {
  limit: number;
  data: PropsVacations;
}

export interface VacationData {
  startDate: string;
  endDate: string;
}

export interface StepItem {
  title: string;
  description: string | null | ReactNode;
}
export interface VacationProps {
  vacations: PropsVacations | undefined;
}
