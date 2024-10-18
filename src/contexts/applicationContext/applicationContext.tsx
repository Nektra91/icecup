import React, { useState } from "react";

export type ApplicationContextType = {
  competitionId: string;
  curlingClub: string[];
  teamMembers: string[];
  nationalities: string[];
  teamName: string;
  responsibleName: string;
  responsibleEmail: string;
  setBaseInfo: (
    responsibleName: string,
    responsibleEmail: string,
    teamName: string
  ) => void;
  setCurlingClubs: (curlingClubs: string[]) => void;
  setTeamInfo: (teamMembers: string[], nationalities: string[]) => void;
  setCompetitionId: (competitionId: string) => void;
};

export const ApplicationContext =
  React.createContext<ApplicationContextType | null>({
    competitionId: "",
    curlingClub: [],
    teamMembers: [],
    nationalities: [],
    teamName: "",
    responsibleName: "",
    responsibleEmail: "",
    setBaseInfo: () => {},
    setCurlingClubs: () => {},
    setTeamInfo: () => {},
    setCompetitionId: () => {},
  });

function ApplicationContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [competitionId, setCompetitionId] = useState("");
  const [curlingClub, setCurlingClub] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [nationalities, setNationalities] = useState<string[]>([]);
  const [teamName, setTeamName] = useState("");
  const [responsibleName, setResponsibleName] = useState("");
  const [responsibleEmail, setResponsibleEmail] = useState("");

  function setBaseInfo(
    responsibleName: string,
    responsibleEmail: string,
    teamName: string
  ) {
    setResponsibleName(responsibleName);
    setResponsibleEmail(responsibleEmail);
    setTeamName(teamName);
  }

  function setCurlingClubs(curlingClubs: string[]) {
    setCurlingClub(curlingClubs);
  }

  function setTeamInfo(teamMembers: string[], nationalities: string[]) {
    setTeamMembers(teamMembers);
    setNationalities(nationalities);
  }

  function setCompetitionIdHandler(competitionId: string) {
    setCompetitionId(competitionId);
  }

  return (
    <ApplicationContext.Provider
      value={{
        competitionId,
        curlingClub,
        teamMembers,
        nationalities,
        teamName,
        responsibleName,
        responsibleEmail,
        setBaseInfo,
        setCurlingClubs,
        setTeamInfo,
        setCompetitionId: setCompetitionIdHandler,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export default ApplicationContextProvider;
