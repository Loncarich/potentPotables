import axios from 'axios';
import { browserHistory } from 'react-router';
import { joinRoom, createUserSockets, startGame, hostJoins } from '../sockets_client';

export const CREATE_SESSION = 'CREATE_SESSION';
export const SET_USER_TYPE = 'SET_USER_TYPE';
export const CREATE_USERNAME = 'CREATE_USERNAME';
export const LINK_CODE_AUTH = 'LINK_CODE_AUTH';
export const LINK_CODE_ERROR = 'LINK_CODE_ERROR';
export const START_GAME_ERROR = 'START_GAME_ERROR';
export const CREATE_GAME = 'CREATE_GAME';
export const ACTIVATE_GAME = 'ACTIVATE_GAME';
export const SET_ACTIVE_CLUE = 'SET_ACTIVE_CLUE';
export const SKIP = 'SKIP';

export function createSession() {
  return function(dispatch){
    axios.post('/create')
      .then( response => {
        dispatch({type: CREATE_SESSION, payload: response.data.session.code});
        browserHistory.push('/linklanding');
      })
  }
}

export function setUserType(value) {
  return {
    type: SET_USER_TYPE,
    payload: value
  }
}

export function linkCodeVerification({linkcode}) {
  return function(dispatch, getState){
    const currentState= getState();
    axios.post('/linkcode', {linkcode, user: currentState.user.userType})
      .then(response => {
        if(response.data.host){
          currentState.user.userType = 'player';
        }
        if(currentState.user.userType !== 'host') {
          browserHistory.push('/userconfig');
        } else {
          hostJoins(response.data.room);
          browserHistory.push('/hostgameplay');
        }
        joinRoom(response.data.room);
        dispatch({type: LINK_CODE_AUTH, payload: response.data.room});
      })
      .catch(response => {
        dispatch({type: LINK_CODE_ERROR, payload: response});
      })
  }
}

export function checkForHost(linkcode) {
  return function(dispatch) {
    axios.post('/check', { linkcode })
      .then(response => {
        browserHistory.push('/gameboard');
        const start = new Audio('http://www.qwizx.com/gssfx/usa/jboardfill.wav');
        start.play();
        startGame(response.data.room);
      })
      .catch(response => {
        dispatch({type: START_GAME_ERROR, payload: response})
      })
  }
}

export function createUser(username, photo) {
  return function(dispatch, getState){
        const currentState = getState();
        dispatch({type: CREATE_USERNAME, payload: {username: username, photo: photo}});
        createUserSockets(username, photo, currentState.linkAuth.linkCode);
        browserHistory.push('/usergameplay');
  }
}

export function fetchGame() {
  return function(dispatch){
    axios.post('/game')
      .then(response => {
        var tempClues= response.data.clues;
        for (var i= 0; i< tempClues.clues.length; i+=5){
          tempClues.clues[i].value= 200;
          tempClues.clues[i+1].value= 400;
          tempClues.clues[i+2].value= 600;
          tempClues.clues[i+3].value= 800;
          tempClues.clues[i+4].value= 1000;
        }
        dispatch({type: CREATE_GAME, payload: tempClues});
      })
      .catch(response => {
        console.log(response);
      })
  }
}

export function fetchRoundTwo() {
  return function(dispatch){
    axios.post('/game')
      .then(response => {
        var tempClues= response.data.clues;
        for (var i= 0; i< tempClues.clues.length; i+=5){
          tempClues.clues[i].value= 400;
          tempClues.clues[i+1].value= 800;
          tempClues.clues[i+2].value= 1200;
          tempClues.clues[i+3].value= 1600;
          tempClues.clues[i+4].value= 2000;
        }
        dispatch({type: CREATE_GAME, payload: tempClues});
      })
      .catch(response => {
        console.log(response);
      })
  }
}

export function setActiveClueGameboard(clue) {
  return {type: SET_ACTIVE_CLUE, payload: clue}
}

export function closeSession(linkcode) {
  return function() {
    axios.post('/close', {linkcode});
  }
}

export function skipClueLocal(){
  return {type: SKIP, payload: {activeUser: ''}}
}

export function createMessage(props, recipient) {
  return function() {
    props.recipient = recipient;
    axios.post('/hire', props);
  }
}