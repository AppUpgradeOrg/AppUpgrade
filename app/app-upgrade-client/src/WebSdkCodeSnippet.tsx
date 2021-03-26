import { buildWebSdkCodeSnippet } from '@app-upgrade/common';
import { Box } from '@material-ui/core';
// @ts-ignore
import Prism from 'prismjs'; // eslint-disable-line
import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { confSelectors } from './conf/conf.slice';
import { CopyButton } from './CopyButton';
import './prism.css';

export const WebSdkCodeSnippet: FC<{ environmentId: string }> = ({
  environmentId
}) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  const conf = useSelector(confSelectors.expectConf);

  return (
    <Box style={{ position: 'relative' }}>
      <pre style={{ borderRadius: 5 }}>
        <code className="language-markup">
          {buildWebSdkCodeSnippet(conf.core.webSdkUrl, environmentId, true)}
        </code>
      </pre>
      <Box position="absolute" bottom={0} right={0}>
        <CopyButton
          text={buildWebSdkCodeSnippet(
            conf.core.webSdkUrl,
            environmentId,
            false
          )}
        />
      </Box>
    </Box>
  );
};
