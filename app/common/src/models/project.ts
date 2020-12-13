import { Environment } from "./environment";

export interface Project extends ProjectCommon {
  createdOn: string;
  environments: Environment[];
}

export interface ProjectCommon {
  projectId: string;
  organizationId: string;
  projectName: string;
  projectReleaseStrategy: string;
}
