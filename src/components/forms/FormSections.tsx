import { useState } from "react";
import {
  AddClubStep,
  AddTeamMembersStep,
  AddTeamStep,
  ApplicationForm,
} from "../../models/interfaces";
import { FormStep } from "../../types";
import AddTeam from "./AddTeam";
import AddTeamMembers from "./AddTeamMembers";
import AddClubs from "./AddClubs";
import ReviewApplication from "./ReviewApplication";

function isAddClubStep(step: FormStep): step is AddClubStep {
  return (
    (step as AddClubStep).curlingsClubs !== undefined &&
    (step as AddClubStep).curlingsClubs !== null
  );
}

function isAddTeamMembersStep(step: FormStep): step is AddTeamMembersStep {
  return (
    (step as AddTeamMembersStep).teamMembers !== undefined &&
    (step as AddTeamMembersStep).teamMembers !== null
  );
}

function isAddTeamStep(step: FormStep): step is AddTeamStep {
  return (
    (step as AddTeamStep).teamName !== undefined &&
    (step as AddTeamStep).teamName !== null
  );
}
export interface FormSectionProps {
  currentStep: FormStep;
  form: ApplicationForm;
  onFormStateChange: (step: FormStep) => void;
  onAvailableClubsChange: (clubs: string[]) => void;
  availableClubs: string[];
  submitTrigger: () => void;
}

export function FormSections({
  currentStep,
  onFormStateChange,
  onAvailableClubsChange,
  availableClubs,
  form,
  submitTrigger,
}: FormSectionProps) {
  const [stepState, setStepState] = useState(currentStep);
  function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  function updateState(newStepState: FormStep) {
    newStepState.isValid = Object.values(newStepState).every((v) => !v?.error);
    newStepState.error = newStepState.isValid ? undefined : "Step is invalid";
    setStepState(newStepState);
    onFormStateChange(newStepState);
  }
  function setTeamName(name: string) {
    const isValid = !!name.length;
    const helperText = isValid ? undefined : "Team name is required";
    const newStepState = {
      ...stepState,
      teamName: { error: !name.length, helperText: helperText, value: name },
    };
    updateState(newStepState);
  }
  function setResponsibleName(name: string) {
    const isValid = !!name.length;
    const helperText = isValid ? undefined : "Responsible name is required";
    const newStepState = {
      ...stepState,
      responsibleName: {
        error: !name.length,
        helperText: helperText,
        value: name,
      },
    };
    updateState(newStepState);
  }
  function setResponsibleEmail(email: string) {
    const isValid = !!email.length && isValidEmail(email);
    const helperText = isValid ? undefined : "Invalid email address";
    const newStepState = {
      ...stepState,
      responsibleEmail: {
        error: !isValid,
        helperText: helperText,
        value: email,
      },
    };
    updateState(newStepState);
  }
  function setAvailableClubsHandler(clubs: string[]) {
    onAvailableClubsChange(clubs);
  }
  function submitHandler() {
    submitTrigger();
  }
  function setTeamMembersHandler(teamMembers: string[]) {
    const isTeamMembersValid = !!teamMembers.length;
    const nationalities =
      (currentStep as AddTeamMembersStep)?.nationalities?.value ?? [];
    const isNationalitiesValid = !!nationalities.length;
    const teamMembersHelperText = isTeamMembersValid
      ? undefined
      : "Team members are required";
    const nationalitiesHelperText = isNationalitiesValid
      ? undefined
      : "Nationalities are required";
    const newStepState = {
      ...stepState,
      teamMembers: {
        error: !isTeamMembersValid,
        helperText: teamMembersHelperText,
        value: teamMembers,
      },
      nationalities: {
        error: !isNationalitiesValid,
        helperText: nationalitiesHelperText,
        value: nationalities,
      },
    };
    updateState(newStepState);
  }
  function setNationalitiesHandler(nationalities: string[]) {
    const isNationalitiesValid = !!nationalities.length;
    const teamMembers =
      (currentStep as AddTeamMembersStep)?.teamMembers?.value ?? [];
    const isTeamMembersValid = !!teamMembers.length;
    const teamMembersHelperText = isTeamMembersValid
      ? undefined
      : "Team members are required";
    const helperText = isNationalitiesValid
      ? undefined
      : "Nationalities are required";
    const newStepState = {
      ...stepState,
      nationalities: {
        error: !isNationalitiesValid,
        helperText: helperText,
        value: nationalities,
      },
      teamMembers: {
        error: !isTeamMembersValid,
        helperText: teamMembersHelperText,
        value: teamMembers,
      },
    };
    updateState(newStepState);
  }
  function setClubsHandler(clubs: string[]) {
    const isValid = !!clubs.length;
    const helperText = isValid ? undefined : "Clubs are required";
    const newStepState = {
      ...stepState,
      curlingsClubs: {
        error: !isValid,
        helperText: helperText,
        value: clubs,
      },
    };
    updateState(newStepState);
  }
  if (isAddClubStep(currentStep)) {
    return (
      <AddClubs
        setAvailableClubsHandler={setAvailableClubsHandler}
        currentStep={currentStep}
        setClubsHandler={setClubsHandler}
        availableClubs={availableClubs ?? []}
      />
    );
  } else if (isAddTeamMembersStep(currentStep)) {
    return (
      <AddTeamMembers
        currentStep={stepState as AddTeamMembersStep}
        setTeamMembersHandler={setTeamMembersHandler}
        setNationalitiesHandler={setNationalitiesHandler}
      />
    );
  } else if (isAddTeamStep(currentStep)) {
    return (
      <AddTeam
        currentStep={stepState as AddTeamStep}
        setResponsibleEmail={setResponsibleEmail}
        setResponsibleName={setResponsibleName}
        setTeamName={setTeamName}
      />
    );
  } else {
    return <ReviewApplication steps={form.steps} submit={submitHandler} />;
  }
}

export default FormSections;
