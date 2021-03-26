import {
  AddNewEnvironmentDto,
  AddNewProjectDto,
  Conf,
  OnboardNewUserDto,
  Project
} from '@app-upgrade/common';
import { FirebaseApp, IApiClient } from '../types';

export class FirebaseApiClient implements IApiClient {
  constructor(private readonly firebaseApp: FirebaseApp) {}

  async onboardNewUser(onboardNewUserDto: OnboardNewUserDto): Promise<string> {
    const result = await this.firebaseApp
      .functions()
      .httpsCallable('onboardNewUser')(onboardNewUserDto);

    return (result.data as unknown) as string;
  }

  async getProjects(): Promise<Project[]> {
    const res = await this.firebaseApp
      .functions()
      .httpsCallable('getProjects')();

    return res.data as Project[];
  }

  async addNewProject(addNewProjectDto: AddNewProjectDto): Promise<Project> {
    const res = await this.firebaseApp
      .functions()
      .httpsCallable('addNewProject')(addNewProjectDto);

    return res.data as Project;
  }

  async addNewEnvironmentToProject(
    addNewEnvironmentDto: AddNewEnvironmentDto
  ): Promise<string> {
    const res = await this.firebaseApp
      .functions()
      .httpsCallable('addNewEnvironment')(addNewEnvironmentDto);

    return res.data as string;
  }

  async fetchConf(): Promise<Conf> {
    const res = await this.firebaseApp.functions().httpsCallable('fetchConf')();

    return res.data as Conf;
  }
}
