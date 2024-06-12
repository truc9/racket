import { SelectOption } from "../common/models/select-option";

export interface ValueLabel {
  value: string;
  label: string;
}

export interface PlayerModel {
  id: number;
  firstName: string;
  lastName: string;
}

export interface MatchSummaryModel {
  matchId: number;
  sportCenterName: string;
  sportCenterId: number;
  court: string;
  start: Date;
  end: Date;
}

export interface CreateOrUpdateMatchModel {
  matchId: number | null;
  sportCenterId: string;
  start: Date;
  end: Date;
  court: string | null;
  customSection: number | null;
}

export interface RegistrationDetailModel {
  registrationId: number;
  matchId: number;
  playerId: number;
  playerName: string;
  isPaid: boolean;
}

export interface RegistrationModel {
  playerId: number;
  matchId: number;
}

export interface SportCenterModel {
  id: number;
  name: string;
  location: string;
  costPerSection: number;
  minutePerSection: number;
}

export interface AttendantRequestModel {
  matchId: number;
  playerId: number;
}

export type { AdditionalCost } from "./cost/additional-cost";
