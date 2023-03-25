/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from "@emotion/react";
import { Button, Card, CardActions, CardHeader, IconButton, TextField, Select, MenuItem } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import useIpcRenderer from '../hooks/useIpcRenderer';

function ClockFunctionsModal({setShowFunctions, setTimer, pomodoroSetting, setPomodoroSetting}) {
  const [timerValue, setTimerValue] = useState()
  const [pomoValue, setPomoValue] = useState()
  const handleClose = () => {
    setShowFunctions(false)
    useIpcRenderer('reshrink-me-pls', []);
  }
  const handleTimerSubmit = (e) => {
    e.preventDefault();
    setTimer(e.target[0].value)
    setTimerValue()
    setShowFunctions(false)
    useIpcRenderer('reshrink-me-pls');
    return false
  }
  const handleTimerChange = (e) => {
    setTimerValue(e.target.value)
  }
  const handlePomodoro = (e) => {
    console.log(e.target.value)
    setPomoValue(e.target.value)
  }
  const handleCustom = () => {
    console.log('does nothing for now.')
  }
  const handleConfirm = () => {
    setPomodoroSetting(pomoValue)
    setShowFunctions(false)
    useIpcRenderer('reshrink-me-pls');
  }
  const timerCard = "max-width: 75vw; min-height: 45vh; max-height: 75vh; display: flex; flex-direction: column; align-items: center; padding: 6px; justify-content: space-between;"
  return (
    <Card css={css`position: absolute; top: 0; min-width: 80vw; min-height: 80vh; left: 0; display: flex; flex-direction: column; align-items: center; z-index: 9;`}>
    <IconButton css={css`position: absolute; left: 2vw; top: 1vh; color: red;`} onClick={() => handleClose()}>
    <CloseIcon />
  </IconButton>
  <h3 css={css`margin-left: 12vw; margin-right: 12vw; font-size: 1em; text-align: center;`}>Set a timer, or pick a pomodoro!</h3>
  <CardActions>
    <Card css={css`${timerCard}`}>
    <CardHeader css={css`max-height: 2.5vh; margin: 3px;`} title="Timer" />
    <form css={css`display: flex; flex-direction: column; align-items: center;`} onSubmit={(e) => handleTimerSubmit(e)}>
      <label css={css`margin: 3px;`}>In seconds...</label>
      <input onChange={(e) => {handleTimerChange(e)}} css={css`background: lightgrey; border-color: rgb(0,0,0,0); border-radius: 12px; margin-bottom: 3px; margin-left: 3px; margin-right: 3px;`} type="number" />
      <Button type="submit" variant="text">Submit</Button>
      </form>
    </Card>
    <Card css={css`${timerCard}`}>
      <CardHeader css={css`max-height: 2.5vh; margin: 3px;`} title="Pomodoros" />
      <form css={css`display: flex; flex-direction: column; align-items: center;`} onSubmit={(e) => handleAlarmSubmit(e)}>
        <label css={css`margin: 3px;`}>Pick a pre-set...</label>
        <Select css={css`z-index: 99999999; max-height: 24px; min-width: 100%;`} value={pomodoroSetting} onChange={(e) => handlePomodoro(e)}>
          <MenuItem css={css`z-index: 9999999999; max-height: 12px;`} value={"15-5"}>15 on, 5 off</MenuItem>
          <MenuItem css={css`z-index: 9999999999; max-height: 12px;`} value={"30-5"}>30 on, 5 off</MenuItem>
          <MenuItem css={css`z-index: 9999999999; max-height: 12px;`} value={"45-10"}>45 on, 10 off</MenuItem>
          <MenuItem css={css`z-index: 9999999999; max-height: 12px;`} value={"60-15"}>60 on, 15 off</MenuItem>
        </Select>
      </form>
      <Button onClick={() => {handleConfirm()}}>Confirm</Button>
    </Card>
  </CardActions>
    </Card>
  )
}

export default ClockFunctionsModal
