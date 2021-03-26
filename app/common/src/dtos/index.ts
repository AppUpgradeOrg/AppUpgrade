export type OnboardNewUserDto = {
  organizationName: string;
  projectName: string;
  projectReleaseStrategy: string;
  environmentName: string;
  domainName: string;
};

export type AddNewProjectDto = {
  projectName: string;
  projectReleaseStrategy: string;
  environmentName: string;
  domainName: string;
};

export type AddNewEnvironmentDto = {
  projectId: string;
  environmentName: string;
  domainName: string;
};

export type Conf = {
  core: {
    environmentName: string;
    webSdkUrl: string;
  };
};
