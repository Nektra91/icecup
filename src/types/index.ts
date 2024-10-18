import {
  AddClubStep,
  AddTeamMembersStep,
  AddTeamStep,
  ReviewStep,
} from "../models/interfaces";

export type FormStep =
  | AddTeamStep
  | AddTeamMembersStep
  | AddClubStep
  | ReviewStep;

export type Country = {
  abbr: string;
  code: string;
  icon: string;
  name: string;
  suggested?: boolean;
};
