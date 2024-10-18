export interface Application {
  id: string;
  accepted: boolean;
  appliedOn: string;
  curlingsClubs: string[];
  nationalities: string[];
  responsibleEmail: string;
  responsibleName: string;
  teamMembers: string[];
  teamName: string;
}

export interface Competition {
  id: string;
  isActive: boolean;
  maxTeams: number;
  name: string;
  applications: Application[];
  curlingsClubs: any[];
  waitingList: any[];
}

export interface MultiStepForm {
  isValid: boolean;
  steps: FormStep[];
}

export interface FormStep {
  isValid: boolean;
  error?: string;
  description: string;
}

export interface AddTeamStep extends FormStep {
  teamName: BaseFormControl;
  responsibleEmail: BaseFormControl;
  responsibleName: BaseFormControl;
}

export interface AddTeamMembersStep extends FormStep {
  teamMembers: BaseFormControl;
  nationalities: BaseFormControl;
}

export interface AddClubStep extends FormStep {
  curlingsClubs: BaseFormControl;
}
export interface ReviewStep extends FormStep {
  form: ApplicationForm | null;
}

export interface ApplicationForm extends MultiStepForm {
  steps: [AddTeamStep, AddTeamMembersStep, AddClubStep, ReviewStep];
}

export interface BaseFormControl {
  error: boolean;
  helperText: string | undefined;
  value: string | string[];
}
