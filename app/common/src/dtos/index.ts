export type OnboardNewUserDto = {
  organizationName: string;
  projectName: string;
  projectReleaseStrategy: string;
  environmentName: string;
  domainName: string;
};

export type Conf = {
  core: {
    environmentName: string;
    webSdkUrl: string;
  };
};
