import { CircularProgress } from '@material-ui/core';
import React, { CSSProperties, FC } from 'react';

type LoadingSpinnerProps = {
  withText?: string;
  hideText?: boolean;
};

const defaultProps: LoadingSpinnerProps = {
  withText: 'Loading',
  hideText: false
};

const styles: { [s: string]: CSSProperties } = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  }
};

export const TEST_ID = 'loading-spinner-text';

export const LoadingSpinner: FC<LoadingSpinnerProps> = (props) => {
  const effectiveProps = {
    ...defaultProps,
    ...props
  };

  return (
    <div style={styles.root}>
      <div>
        <CircularProgress />
      </div>
      {!effectiveProps.hideText && (
        <div data-testid={TEST_ID} style={{ marginTop: 10 }}>
          {effectiveProps.withText}
        </div>
      )}
    </div>
  );
};
