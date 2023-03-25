/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Card, CardActions, CardHeader, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'

function SettingsModal({setShowSettings}) {
  const handleClose = () => {
    setShowSettings(false)
    window.electron.ipcRenderer.sendMessage('reshrink-me-pls', []);
  }
  return (
    <Card css={css`position: absolute; top: 0; min-width: 50vw; left: 25vw; display: flex; flex-direction: column; align-items: center; z-index: 9999;`}>
    <IconButton css={css`position: absolute; left: 2vw; top: 1vh; color: red;`} onClick={() => handleClose()}>
      <CloseIcon />
    </IconButton>
    <CardHeader title="Options" />
      <CardActions>
        Test
      </CardActions>
    </Card>
  )
}

export default SettingsModal
