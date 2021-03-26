import { Button } from '@material-ui/core';
import { CheckSharp, FileCopyOutlined } from '@material-ui/icons';
import React, { FC, useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export type CopyButtonProps = { text: string };
export const CopyButton: FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const copyClicked = () => {
    setCopied(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
      timeoutRef.current = undefined;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <CopyToClipboard text={text} onCopy={() => copyClicked()}>
      <Button
        startIcon={copied ? <CheckSharp /> : <FileCopyOutlined />}
        color="primary"
      >
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </CopyToClipboard>
  );
};
