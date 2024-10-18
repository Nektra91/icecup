import { Box, Typography } from "@mui/material";
import {
  AddClubStep,
  AddTeamMembersStep,
  AddTeamStep,
  Application,
  ReviewStep,
} from "../../models/interfaces";
import { ApplicationCard } from "../common/UI";
export interface ReviewApplicationProps {
  steps: [AddTeamStep, AddTeamMembersStep, AddClubStep, ReviewStep];
  submit: () => void;
}
function ReviewApplication({ steps, submit }: ReviewApplicationProps) {
  const teamName = steps[0]?.teamName?.value ?? "";
  const responsibleEmail = steps[0]?.responsibleEmail?.value ?? "";
  const responsibleName = steps[0]?.responsibleName?.value ?? "";
  const teamMembers = (steps[1]?.teamMembers?.value ?? []) as string[];
  const nationalities = (steps[1]?.nationalities?.value ?? []) as string[];
  const curlingsClubs = (steps[2]?.curlingsClubs?.value ?? []) as string[];
  const isValid = steps[0].isValid && steps[1].isValid && steps[2].isValid;
  const application = {
    id: "1",
    appliedOn: new Date().toISOString(),
    curlingsClubs: curlingsClubs,
    nationalities: nationalities,
    teamMembers: teamMembers,
    teamName: teamName,
    responsibleEmail: responsibleEmail,
    responsibleName: responsibleName,
    accepted: false,
  } as Application;
  function submitHandler(__: string) {
    if (isValid) {
      submit();
    }
  }
  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mt: 4, mb: 2 }}
      >
        Review Application
      </Typography>
      <Box
        sx={{
          width: "100%",
          height:
            "calc(100vh - 56px - 15px - 233px - 30px - 42px - 37px - 40px)",
          overflow: "auto",
        }}
      >
        <ApplicationCard
          application={application}
          canEdit={false}
          competitionId="1"
          approveApplication={submitHandler}
          isValid={isValid}
        />
      </Box>
    </>
  );
}
export default ReviewApplication;
