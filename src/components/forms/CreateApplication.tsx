import {
  Box,
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import {
  Competition,
  ApplicationForm,
  AddTeamStep,
  AddTeamMembersStep,
  AddClubStep,
  ReviewStep,
  FormStep,
} from "../../models/interfaces";
import { useState } from "react";
import FormSections from "./FormSections";
import { db } from "../../firebase/firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

type ApplicationFormSteps =
  | "Add your team"
  | "Add team members"
  | "Add your club"
  | "Review and submit";

const steps: ApplicationFormSteps[] = [
  "Add your team",
  "Add team members",
  "Add your club",
  "Review and submit",
];

export interface CreateApplicationFormProps {
  competition: Competition;
}
function CreateApplication({
  competition,
}: CreateApplicationFormProps): React.ReactElement {
  const initialSteps: [
    AddTeamStep,
    AddTeamMembersStep,
    AddClubStep,
    ReviewStep
  ] = [
    {
      isValid: false,
      description: "Add your team information",
      error: undefined,
      teamName: {
        error: false,
        helperText: undefined,
        value: "",
      },
      responsibleEmail: {
        error: false,
        helperText: undefined,
        value: "",
      },
      responsibleName: {
        error: false,
        helperText: undefined,
        value: "",
      },
    },
    {
      isValid: false,
      description: "Add team members information",
      error: undefined,
      teamMembers: {
        error: false,
        helperText: undefined,
        value: [],
      },
      nationalities: {
        error: false,
        helperText: undefined,
        value: [],
      },
    },
    {
      isValid: false,
      error: undefined,
      description: "Add your club information",
      curlingsClubs: {
        error: false,
        helperText: undefined,
        value: [],
      },
    },
    {
      isValid: false,
      description: "Review and submit",
      form: null,
    },
  ];
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [availableClubs, setAvailableClubs] = useState<string[]>(
    Array.from(
      new Set(
        competition.applications
          .flatMap((app) => app.curlingsClubs)
          .filter((club) => !!club)
      )
    )
  );
  const [form, setForm] = useState<ApplicationForm>({
    isValid: false,
    steps: initialSteps,
  });

  function setNextStep() {
    if (activeStep < form.steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  }
  function setPreviousStep() {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }
  function handleFormStateChange(step: FormStep) {
    setForm((prevForm) => {
      let changedForm = {
        ...prevForm,
        steps: prevForm.steps.map((s, index) =>
          index === activeStep ? step : s
        ) as [AddTeamStep, AddTeamMembersStep, AddClubStep, ReviewStep],
      };
      changedForm.isValid = changedForm.steps.every((s) => s.isValid);
      return changedForm;
    });
  }

  async function submitHandler() {
    if (competition.applications.length === 0) {
      alert("No active competition available.");
      return;
    }

    const competitionId = competition.id;
    const competitionRef = doc(db, "competitions", competitionId);

    const applicationData = {
      teamName: form.steps[0].teamName.value,
      teamMembers: form.steps[1].teamMembers.value,
      nationalities: form.steps[1].nationalities.value,
      curlingsClubs: form.steps[2].curlingsClubs.value,
      responsibleName: form.steps[0].responsibleName.value,
      responsibleEmail: form.steps[0].responsibleEmail.value,
      appliedOn: new Date(Date.now()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      accepted: false,
      id: uuidv4(),
    };

    try {
      await updateDoc(competitionRef, {
        applications: arrayUnion(applicationData),
      });
      navigate("/");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application.");
    }
  }
  const formStepDescriptionElement =
    activeStep !== 3 ? (
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        {form.steps[activeStep].description}
      </Typography>
    ) : null;

  const formStepNavigationElement =
    activeStep !== 3 ? (
      <Box>
        <Button type="button" onClick={setNextStep}>
          Next
        </Button>
        <Button type="button" onClick={setPreviousStep}>
          Back
        </Button>
      </Box>
    ) : (
      <Box>
        <Button type="button" onClick={setPreviousStep}>
          Back
        </Button>
      </Box>
    );
  return (
    <Container
      maxWidth="sm"
      sx={{ height: "calc(100vh - 64px)", paddingTop: "15px" }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "calc(165px + 68px)",
        }}
      >
        <Stepper activeStep={activeStep} orientation="vertical">
          {form.steps.map((step, index) => {
            const labelProps: {
              optional?: React.ReactNode;
              error?: boolean;
            } = {};
            if (step.error) {
              labelProps.error = true;
            }
            return (
              <Step key={steps[index]}>
                <StepLabel {...labelProps}>{steps[index]}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "15px",
          height: "calc(100% - 232px - 30px)",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {formStepDescriptionElement}
          <Box>
            <FormSections
              submitTrigger={submitHandler}
              availableClubs={availableClubs}
              form={form}
              currentStep={form.steps[activeStep]}
              onFormStateChange={handleFormStateChange}
              onAvailableClubsChange={setAvailableClubs}
            />
          </Box>
        </Box>
        {formStepNavigationElement}
      </Box>
    </Container>
  );
}

export default CreateApplication;
