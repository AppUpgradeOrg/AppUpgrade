import { OnboardNewUserDto, Project } from '@app-upgrade/common';
import { FirebaseApp, IApiClient } from './types';

export class FirebaseApiClient implements IApiClient {
  constructor(private readonly firebaseApp: FirebaseApp) {}

  async onboardNewUser(onboardNewUserDto: OnboardNewUserDto): Promise<void> {
    await this.firebaseApp.functions().httpsCallable('onboardNewUser')(
      onboardNewUserDto
    );

    return;
  }

  async getProjects(): Promise<Project[]> {
    const res = await this.firebaseApp
      .functions()
      .httpsCallable('getProjects')();

    return res.data as Project[];
  }
}
