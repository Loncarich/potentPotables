import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendButtonClick } from '../sockets_client';
import Avatar from 'material-ui/Avatar';


import { Link } from 'react-router';

class UserGameplay extends Component {
  constructor(props){
    super(props);
    this.state = {score: null};
  }

  componentDidUpdate(){
    if(this.state.score != this.props.users[this.props.username].score){
      this.setState({score: this.props.users[this.props.username].score});
    }
  }

  componentWillMount() {
    if(this.props.users[this.props.username]){
      this.setState({score: this.props.users[this.props.username].score});
    }
  }

  handleBuzz(){
    const buzz = new Audio('../../public/game_buzz.wav');
    console.log('inside user gameplay handleBuzz');
    buzz.play();
    sendButtonClick(this.props.username, this.props.linkCode, this.props.activeClue);
  }

  render(){
    const buttonConfig= "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";
    return (
      <div className= 'user-gameplay'>
        <div className= 'score' >Score: ${this.state.score}</div>
        <div className= 'buzz-alert'>
          {this.props.activeUser && this.props.activeUser !== this.props.username ?
            <div>
              <div>{this.props.activeUser} buzzed in!</div>
              <div>Score: ${this.props.users[this.props.activeUser].score}</div>
            </div>:
            <div></div>
          }
        </div>
        <div className= 'btn-container'>
        {this.props.isGameActive === false ?
          <div>
            Waiting for game to Begin...
          </div> :
          this.props.isButtonDisabled ?
            <a id="gamebuttonDisabled" className= 'game-button' disabled= {true}>
                <span >{buttonConfig}</span>
            </a> :
            this.props.hasAnsweredUsers.indexOf(this.props.username) !== -1 ?
              <a id="gamebuttonDisabled" disabled= {true} >
                  <span>{buttonConfig}</span>
              </a> :
              <a id="gamebutton" >
                  <span onClick= {this.handleBuzz.bind(this)}>{buttonConfig}</span>
              </a>
        }
        </div>
        <div className= 'avatar'>
          <Avatar src= {this.props.userPhoto} size= {60}/>
          <div>{this.props.username}</div>
        </div>
        <div className= 'scoreboard'>
          <Link to="scoreboard">
            <button>Scoreboard</button>
          </Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  console.log('insideMapState', state.user.userPhoto);
  return {
    isButtonDisabled: state.gameplay.isButtonDisabled,
    username: state.user.username,
    users: state.gameplay.users,
    linkCode: state.linkAuth.linkCode,
    activeUser: state.gameplay.activeUser,
    isGameActive: state.gameplay.isGameActive,
    activeClue: state.gameplay.activeClue,
    hasAnsweredUsers: state.gameplay.hasAnsweredUsers,
    userPhoto: state.user.photo
  };
}

export default connect(mapStateToProps)(UserGameplay);


