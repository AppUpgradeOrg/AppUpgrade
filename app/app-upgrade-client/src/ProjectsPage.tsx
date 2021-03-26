import { Project } from '@app-upgrade/common';
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  Modal,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AddCircle } from '@material-ui/icons';
import { format } from 'date-fns';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router';
import { AddNewEnvironmentFormModal } from './AddNewEnvironmentFormModal';
import { AddNewProjectFormModal } from './AddNewProjectFormModal';
import { LoadingSpinner } from './LoadingSpinner';
import { OnboardingForm } from './OnboardingForm';
import { fetchProjects } from './projects/projects.slice';
import { RootState } from './root-reducer';
import { ROUTES } from './routes';
import { theme } from './theme';
import { RequestState } from './types';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

export const EnvironmentsPage: FC = () => {
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();

  const params = useMemo(() => new URLSearchParams(location.search), [
    location.search
  ]);

  const { projects, fetchProjectsState } = useSelector(
    (rootState: RootState) => {
      return {
        projects: rootState.projects.projects,
        fetchProjectsState: rootState.projects.fetchProjectsState
      };
    }
  );

  const [hasProjects] = useState(projects.length);

  const [isOnboarding, setOnboarding] = useState(
    Boolean(params.get('onboarding'))
  );

  const endOnboarding = () => {
    setOnboarding(false);
    dispatch(fetchProjects());
  };

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const onCreateFirstProjectClicked = () => {
    setOnboarding(true);
  };

  const [addNewProject, setAddNewProject] = useState(false);

  const endAddNewProject = () => {
    setAddNewProject(false);
    dispatch(fetchProjects());
  };

  const [
    projectIdToAddNewEnvironmentTo,
    setProjectIdToAddNewEnvironmentTo
  ] = useState<string | undefined>(undefined);

  const endAddNewEnvironment = () => {
    setProjectIdToAddNewEnvironmentTo(undefined);
    dispatch(fetchProjects());
  };

  if (!isOnboarding && Boolean(params.get('onboarding'))) {
    return <Redirect to={ROUTES.PROJECTS} />;
  }

  return (
    <>
      <Container className={classes.root}>
        <Box marginTop={5} marginBottom={5}>
          <Box
            padding={3}
            style={{
              backgroundColor: 'white',
              border: '1px solid #E5E5E5',
              borderTopLeftRadius: '5px',
              borderTopRightRadius: '5px'
            }}
          >
            <Grid container justify="space-between">
              <Box display="flex" flexDirection="row" alignItems="center">
                <Typography variant="h6">Projects</Typography>
                <Chip
                  style={{ marginLeft: theme.spacing(1) }}
                  variant="outlined"
                  size="small"
                  label={projects.length}
                />
              </Box>
              {projects.length > 0 && (
                <Button
                  startIcon={<AddCircle />}
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => setAddNewProject(true)}
                >
                  Add New Project
                </Button>
              )}
            </Grid>
          </Box>
          <Box
            padding={3}
            style={{
              backgroundColor: 'white',
              borderLeft: '1px solid #E5E5E5',
              borderRight: '1px solid #E5E5E5',
              borderBottom: '1px solid #E5E5E5',
              borderBottomLeftRadius: '5px',
              borderBottomRightRadius: '5px',
              flexGrow: 1
            }}
          >
            {/* Loading projects */}
            {fetchProjectsState === RequestState.FETCHING ? (
              <LoadingSpinner />
            ) : null}

            {/* Projects Grid */}
            {projects.length > 0 &&
            fetchProjectsState === RequestState.SUCCESS ? (
              <ProjectsGrid
                projects={projects}
                onAddNewEnvironment={(project) =>
                  setProjectIdToAddNewEnvironmentTo(project.projectId)
                }
              />
            ) : null}

            {/* User has no projects and they are not onboarding */}
            {projects.length === 0 &&
            fetchProjectsState === RequestState.SUCCESS &&
            !isOnboarding ? (
              <CreateYourFirstProjectView
                onCreateFirstProjectClicked={onCreateFirstProjectClicked}
              />
            ) : null}
          </Box>
        </Box>
      </Container>
      <Modal
        open={isOnboarding && !hasProjects}
        aria-labelledby="onboarding-form-title"
        aria-describedby="onboarding-form-description"
        onBackdropClick={() => endOnboarding()}
      >
        <div>
          <OnboardingForm onOnboardingCompleted={() => endOnboarding()} />
        </div>
      </Modal>
      <Modal
        open={addNewProject}
        aria-labelledby="new-project-form-title"
        aria-describedby="new-project-form-description"
        onBackdropClick={() => endAddNewProject()}
      >
        <div>
          <AddNewProjectFormModal
            addNewProjectCompleted={() => endAddNewProject()}
          />
        </div>
      </Modal>
      <Modal
        open={projectIdToAddNewEnvironmentTo !== undefined}
        aria-labelledby="new-environment-title"
        aria-describedby="new-environment-description"
        onBackdropClick={() => endAddNewEnvironment()}
      >
        <div>
          {projectIdToAddNewEnvironmentTo !== undefined ? (
            <AddNewEnvironmentFormModal
              projectId={projectIdToAddNewEnvironmentTo}
              addNewEnvironmentCompleted={() => endAddNewEnvironment()}
            />
          ) : null}
        </div>
      </Modal>
    </>
  );
};

export const ProjectsGrid: FC<{
  projects: Project[];
  onAddNewEnvironment: (project: Project) => void;
}> = ({ projects, onAddNewEnvironment }) => {
  return (
    <Grid container spacing={5}>
      {projects.map((project) => {
        return (
          <Grid key={project.projectId} item xs={12}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography variant="h6">{project.projectName}</Typography>
              <Chip
                style={{ marginLeft: theme.spacing(1) }}
                variant="outlined"
                size="small"
                label={project.environments.length}
              />
            </Box>
            <Grid
              container
              item
              xs={12}
              spacing={3}
              style={{ marginTop: theme.spacing(1) }}
            >
              {project.environments.map((environment) => {
                return (
                  <React.Fragment key={environment.environmentId}>
                    <Grid item xs={4}>
                      <ProjectCardContainer>
                        <Grid item xs={12}>
                          <Typography variant="h6">
                            {environment.environmentName}
                          </Typography>
                          <Typography
                            variant="body1"
                            style={{ marginTop: theme.spacing(1) }}
                          >
                            <strong>Domains:</strong> {environment.domains}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Created on:</strong>{' '}
                            {format(
                              new Date(environment.createdOn),
                              'MMMM do, yyyy h:mmaaa'
                            )}
                          </Typography>
                        </Grid>
                      </ProjectCardContainer>
                    </Grid>
                  </React.Fragment>
                );
              })}
              <React.Fragment>
                <Grid item xs={4}>
                  <ProjectCardContainer>
                    <Grid container justify="center" alignContent="center">
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        startIcon={<AddCircle />}
                        onClick={() => onAddNewEnvironment(project)}
                      >
                        Add New Environment
                      </Button>
                    </Grid>
                  </ProjectCardContainer>
                </Grid>
              </React.Fragment>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};

const CreateYourFirstProjectView: FC<{
  onCreateFirstProjectClicked: () => void;
}> = ({ onCreateFirstProjectClicked }) => {
  return (
    <Grid
      container
      justify="center"
      alignContent="center"
      alignItems="center"
      direction="column"
      spacing={2}
      style={{ marginTop: theme.spacing(10), marginBottom: theme.spacing(10) }}
    >
      <Grid item xs={12}>
        <Typography>You currently do not have any projects setup.</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onCreateFirstProjectClicked()}
        >
          Create your first project
        </Button>
      </Grid>
    </Grid>
  );
};

const ProjectCardContainer: FC = ({ children }) => {
  return (
    <Card elevation={2}>
      <Box padding={2} height="298px" display="flex">
        {children}
      </Box>
    </Card>
  );
};
