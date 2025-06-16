
export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  location?: string;
  created_at: string;
  services: {
    name: string;
  };
  profiles: {
    name: string;
  };
}

export interface ProjectApplication {
  id: string;
  status: string;
  proposed_price?: number;
  created_at: string;
  project_id: string;
  projects: {
    title: string;
    status: string;
  };
}

export interface PartnershipApplication {
  id: string;
  status: string;
  proposed_price?: number;
  created_at: string;
  partnership_demand_id: string;
  partnership_demands: {
    title: string;
    status: string;
  };
}

export interface ApplicationData {
  id: string;
  status: string;
  proposed_price?: number;
  created_at: string;
  type: 'project' | 'partnership';
  project_id?: string;
  partnership_demand_id?: string;
  projects?: {
    title: string;
    status: string;
  };
  partnership_demands?: {
    title: string;
    status: string;
  };
}

export interface ActiveProject {
  id: string;
  title: string;
  status: string;
  deadline?: string;
  client: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface ActivePartnership {
  id: string;
  title: string;
  status: string;
  deadline?: string;
  creator: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface DashboardData {
  projects: Project[];
  applications: ApplicationData[];
  activeProjects: ActiveProject[];
  activePartnerships: ActivePartnership[];
  partnershipsCount: number;
  partnershipApplicationsCount: number;
}
