export interface Environment extends EnvironmentCommon {
  createdOn: string;
}

export interface EnvironmentCommon {
  environmentId: string;
  projectId: string;
  organizationId: string;
  environmentName: string;
  domains: string[];
}
