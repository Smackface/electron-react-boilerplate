/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {useState, useEffect, useRef} from 'react'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from "@mui/system";
import './App.css';
import { IconButton } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import AlarmIcon from '@mui/icons-material/Alarm';
import SettingsModal from "./ClockFunctions/SettingsModal";
import ClockFunctionsModal from "./ClockFunctions/ClockFunctionsModal";
import useIpcRenderer from "./hooks/useIpcRenderer";


function Clock() {
  const [renderedTime, setRenderedTime] = useState<string>("")
  const [renderedDate, setRenderedDate] = useState<string>("")
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [showFunctions, setShowFunctions] = useState<boolean>(false)
  const [timer, setTimer] = useState<number | undefined | null>()
  const [longPomo, setLongPomo] = useState<number | null>(null);
  const [shortPomo, setShortPomo] = useState<number | null>(null);
  const [pomodoroSetting, setPomodoroSetting] = useState<string>("")
  const [isPomodoro, setIsPomodoro] = useState<boolean>(false)
  const [isBreak, setIsBreak] = useState<boolean>(false)
  const runningClock = () => {
    const d = new Date()
    return d.toLocaleTimeString()
  }
  const runningDate = (): string => {
    const d = new Date()
    return d.toLocaleDateString()
  }
  const handleOptionsClick = (): void => {
    setShowSettings(true)
    useIpcRenderer('resize-me-pls', []);
  }
  const handleFunctionsClick = (): void => {
    setShowFunctions(true)
    useIpcRenderer('resize-me-pls', []);
  }
  const handleStopTimer = () => {
    timer ? setTimer(undefined) : null
    longPomo ? setLongPomo(null) : null
    shortPomo ? setShortPomo(null) : null
    isPomodoro ? setIsPomodoro(false) : null
    isBreak ? setIsBreak(false) : null
  }
  useEffect(() => {
    if (renderedDate === "") {
      let starterDate = new Date()
      setRenderedDate(starterDate.toLocaleDateString())
    }
    if (renderedTime === "") {
      let starterTime = new Date()
      setRenderedTime(starterTime.toLocaleTimeString())
    }
    const interval = setInterval(() => {
      setRenderedTime(runningClock())
    }, 1000)
    const newInterval = setInterval(() => {
      setRenderedDate(runningDate())
    }, 60000)
    function clearAllIntervals() {
      clearInterval(interval)
      clearInterval(newInterval)
    }
    return () => {
      clearAllIntervals()
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timer !== undefined) {
      if (timer ? timer > 0 : undefined) {
        interval = setInterval(() => {
          setTimer((timer) => timer ? timer - 1 : undefined);
        }, 1000)
      } else {
        if (isBreak) {
          setIsBreak(false);
          setTimer(longPomo ? longPomo : undefined);
          useIpcRenderer('play-alarm', []);
        } else {
          setIsBreak(true);
          setTimer(shortPomo ? shortPomo : undefined)
          useIpcRenderer('play-alarm', []);
        }
      }
    }
    return () => clearInterval(interval ? interval : undefined)
  }, [timer, isBreak, longPomo, shortPomo])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

      if (timer !== undefined) {
        if (!isPomodoro) {
          if (timer ? timer > 0 : undefined) {
            interval = setInterval(() => {
              const newTime = timer ? timer - 1 : undefined
              setTimer(newTime)
            }, 1000)
          } else if (timer === 0) {
            useIpcRenderer('play-alarm', []);
          }
        }
      }
    return () => clearInterval(interval ? interval : undefined)
  }, [timer])

  useEffect(() => {
    switch(pomodoroSetting) {
      case '15-5':
        setLongPomo(15*60)
        setTimer(longPomo)
        setShortPomo(5*60)
        setIsPomodoro(true)
        break;
      case '30-5':
        setLongPomo(30*60)
        setTimer(longPomo)
        setShortPomo(5*60)
        setIsPomodoro(true)
        break;
      case '45-10':
        setLongPomo(45*60)
        setTimer(longPomo)
        setShortPomo(10*60)
        setIsPomodoro(true)
        break;
      case '60-15':
        setLongPomo(60*60)
        setTimer(longPomo)
        setShortPomo(15*60)
        setIsPomodoro(true)
        break;
    }
  }, [pomodoroSetting])

  const containerStyle = "max-height: 60px; font-size: .8em; padding-bottom: 12.5%;"

  return (
    <Container css={css`${containerStyle}`} id="clock">
      {showSettings ? <SettingsModal setShowSettings={setShowSettings} /> : null}
      {showFunctions ? <ClockFunctionsModal pomodoroSetting={pomodoroSetting} setPomodoroSetting={setPomodoroSetting} setTimer={setTimer} setShowFunctions={setShowFunctions} /> : null}
      <IconButton onClick={() => {handleOptionsClick()}} css={css`position: absolute; top: 0; left: 0; max-width: 10px !important; height: 10px;`}>
        <SettingsIcon />
      </IconButton>
      <IconButton onClick={() => {handleFunctionsClick()}} css={css`position: absolute; top: 50vh; left: 0; max-width: 10px !important; height: 10px; color: green;`}>
        <AlarmIcon />
      </IconButton>
      <span css={css`display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; margin-top: -12px;`}>
      {timer ? (<span css={css`max-height: 1em;`}>{timer}</span>) : null}
      {timer ? (<div css={css`max-height: 1px; min-height: 1px; min-width: 100%; background: grey; margin-top: 3px; margin-bottom: 3px;`} />) : null}
      {renderedTime ? (<span css={css`max-height: 1em;`}>{renderedTime}</span>) : null}
      <br/>
      {renderedDate ? (<span css={css`max-height: 1em;`}>{renderedDate}</span>) : null}
      </span>
      <IconButton onClick={() => {handleStopTimer()}} css={css`position: absolute; top: 0; right: 0; max-width: 10px !important; height: 10px; color: red;`}>
        <AlarmIcon />
      </IconButton>
    </Container>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Clock />} />
      </Routes>
    </Router>
  );
}
