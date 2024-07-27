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
