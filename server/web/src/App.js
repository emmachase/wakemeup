import React, { useState } from 'react';
import './App.css';
import { Button, Snackbar, Slider, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';


function sendRequest(len) {
  return fetch('https://wakemeup.its-em.ma/annoy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ len })
  });
}

function App() {
  const [ len, setLen ] = useState(5);
  const [ btnDisabled, setDisabled ] = useState(false);
  const [ snackOpen, setSnackOpen ] = useState(false);
  const [ snackMessage, setSnackMessage ] = useState("");

  return (
    <div className="App">
      <header className="App-header">
        <p>
          How badly do you want me to wake up?
        </p>
        <div className="mslider">
          <Slider
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={10}
            value={len}
            onChange={(_e, val) => setLen(val)}
          />
        </div>
        <Button
          onClick={() => {
            sendRequest(len).then(resp => {
              if (resp.ok) {
                setSnackMessage("Successfully annoyed me.");
              } else {
                setSnackMessage("Something went wrong.");
              }
              setSnackOpen(true);
            });
            setDisabled(true);
            setTimeout(() => setDisabled(false), 10000);
          }}
          disabled={btnDisabled}
          size="large" 
          variant="contained" 
          color="secondary">WAKE UP</Button>
      </header>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackOpen}
        onClose={()=>setSnackOpen(false)}
        autoHideDuration={6000}
        message={snackMessage}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={()=>setSnackOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}

export default App;
