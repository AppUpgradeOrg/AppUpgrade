import { Environment, Project } from '@app-upgrade/common';
import { AccountRecord, EnvironmentRecord, ProjectRecord } from './records';
import { FirebaseAdmin } from './types';
import { identityConverter } from './utils';
export const getProjects = async (admin: FirebaseAdmin, accountId: string) => {
  // Find account by id
  const accountDoc = await admin
    .firestore()
    .collection('accounts')
    .withConverter(identityConverter<AccountRecord>())
    .doc(accountId)
    .get();

  if (!accountDoc.exists) return []; // If not account exists, return empty list

  // An organizationId is not guaranteed to be present, return empty list if not set.
  const organizationId = accountDoc.data()?.organizationId;
  if (!organizationId) return [];

  // Fetch data necessary to built Projects
  const [projectIdToEnvironments, projectRecords] = await Promise.all([
    getProjectIdToEnvironmentRecordsMap(admin, organizationId),
    getProjectRecords(admin, organizationId)
  ]);

  // Return & transform projectRecord into a project.
  return projectRecords.map((projectRecord) => {
    return {
      ...projectRecord,
      createdOn: projectRecord.createdOn.toDate().toISOString(),
      environments: projectIdToEnvironments[projectRecord.projectId] || []
    } as Project;
  });
};

async function getProjectRecords(admin: FirebaseAdmin, organizationId: string) {
  const projectsQuerySnapshot = await admin
    .firestore()
    .collection('projects')
    .withConverter(identityConverter<ProjectRecord>())
    .where('organizationId', '==', organizationId)
    .get();

  return projectsQuerySnapshot.docs.map((d) => d.data());
}

async function getProjectIdToEnvironmentRecordsMap(
  admin: FirebaseAdmin,
  organizationId: string
) {
  const environmentQuerySnapshot = await admin
    .firestore()
    .collection('environments')
    .withConverter(identityConverter<EnvironmentRecord>())
    .where('organizationId', '==', organizationId)
    .get();

  const projectIdToEnvironments = environmentQuerySnapshot.docs.reduce(
    (m, r) => {
      const environmentData = r.data();
      const environment: Environment = {
        ...environmentData,
        createdOn: environmentData.createdOn.toDate().toISOString()
      };
      return {
        ...m,
        [environment.projectId]: [
          ...(m[environment.projectId] || []),
          environment
        ]
      };
    },
    {} as { [s: string]: Environment[] }
  );
  return projectIdToEnvironments;
}
