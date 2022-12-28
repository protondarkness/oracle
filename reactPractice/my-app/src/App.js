import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {teams} from './teams.js'





function Round_1(props){
    return(
    <>
      <li class='spacer'>&nbsp;</li>
      <li class='game-left game-top'>
        <span>{props.seedA}</span>
        <span>{props.teamA}</span>
      </li>
      <li class='game-left game-bottom'>
        <span>{props.seedB}</span>
        <span>{props.teamB}</span>
      </li>
      </>
    )

}
function Round_2(props){
    return(
     <ul class="matchup">
        <li class="team team-top">{props.home}</li>
        <li class="team team-bottom">{props.away}</li>
      </ul>
    )

}

function Round_3(props){
    return(
     <ul class="matchup">
        <li class="team team-top">{props.home}</li>
        <li class="team team-bottom">{props.away}</li>
      </ul>
    )

}

function Round_4(props){

    return(
     <ul class="matchup">
        <li class="team team-top">{props.home}</li>
        <li class="team team-bottom">{props.away}</li>
      </ul>
    )

}


class Bracket extends React.Component{
        constructor(props){
    super(props);

    }

    renderBracket(i){

       return(<Round_1
          seedA={'1'}
          teamA={teams[0]}
          seedB={'16'}
          teamB={'New Orleans / Mount&hellip'}
        />
        )
    }
   render(){
    return(
    <>
    <div class='tournament tournament-header'>
      <ul class='round'>
        <li>First Round</li>
        <li>Mar 16-18</li>
      </ul>
      <ul class='round'>
        <li>Second Round</li>
        <li>Mar 17-19</li>
      </ul>
      <ul class='round'>
        <li>Sweet 16</li>
        <li>Mar 23-25</li>
      </ul>
      <ul class='round'>
        <li>Elite 8</li>
        <li>Mar 24-26</li>
      </ul>
      <ul class='round'>
        <li>Final 4</li>
        <li>Apr 1 at Phoenix, AZ</li>
      </ul>
      <ul class='round'>
      </ul>
      <ul class='round'>
        <li>National Championship</li>
        <li>Apr 3 at Phoenix, AZ</li>
      </ul>
      <ul class='round'>
      </ul>
      <ul class='round'>
        <li>Final 4</li>
        <li>Apr 1 at Phoenix, AZ</li>
      </ul>
      <ul class='round'>
        <li>Elite 8</li>
        <li>Mar 24-26</li>
      </ul>
      <ul class='round'>
        <li>Sweet 16</li>
        <li>Mar 23-25</li>
      </ul>
      <ul class='round'>
        <li>Second Round</li>
        <li>Mar 17-19</li>
      </ul>
      <ul class='round'>
        <li>First Round</li>
        <li>Mar 16-18</li>
      </ul>
    </div>
    <div class='tournament'>
      <ul class='round seed'>
        <li class='spacer'>&nbsp;</li>
        {this.renderBracket(0)}
        <Round_1
          seedA={'8'}
          teamA={'wisconsin'}
          seedB={'9'}
          teamB={'Virginnie tech'}
        />
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>
          <span>5</span>
          <span>Virginia</span>
        </li>
        <li class='game-left game-bottom'>
          <span>12</span>
          <span>North Carolina - Wil&hellip;</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>
          <span>4</span>
          <span>Florida</span>
        </li>
        <li class='game-left game-bottom'>
          <span>13</span>
          <span>East Tennessee State</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>
          <span>6</span>
          <span>Southern Methodist</span>
        </li>
        <li class='game-left game-bottom'>
          <span>11</span>
          <span>Southern California &hellip;</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>
          <span>3</span>
          <span>Baylor</span>
        </li>
        <li class='game-left game-bottom'>
          <span>14</span>
          <span>New Mexico State</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>
          <span>7</span>
          <span>South Carolina</span>
        </li>
        <li class='game-left game-bottom'>
          <span>10</span>
          <span>Marquette</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>
          <span>2</span>
          <span>Duke</span>
        </li>
        <li class='game-left game-bottom'>
          <span>15</span>
          <span>Troy</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>
          <span>1</span>
          <span>Gonzaga</span>
        </li>
        <li class='game-left game-bottom'>
          <span>16</span>
          <span>South Dakota State</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>
          <span>8</span>
          <span>NorthWestern</span>
        </li>
        <li class='game-left game-bottom'>
          <span>9</span>
          <span>Vanderbilt</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>
          <span>5</span>
          <span>Notre Dame</span>
        </li>
        <li class='game-left game-bottom'>
          <span>12</span>
          <span>Princeton</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>
          <span>4</span>
          <span>West Virginia</span>
        </li>
        <li class='game-left game-bottom'>
          <span>13</span>
          <span>Bucknell</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>
          <span>6</span>
          <span>Maryland</span>
        </li>
        <li class='game-left game-bottom'>
          <span>11</span>
          <span>Xavier</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>
          <span>3</span>
          <span>Florida State</span>
        </li>
        <li class='game-left game-bottom'>
          <span>14</span>
          <span>FLorida Gulf Coast</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>
          <span>7</span>
          <span>Saint Marys</span>
        </li>
        <li class='game-left game-bottom'>
          <span>10</span>
          <span>Virginia Commonwealt&hellip;</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>
          <span>2</span>
          <span>Arizona</span>
        </li>
        <li class='game-left game-bottom'>
          <span>15</span>
          <span>North Dakota</span>
        </li>
        <li class='spacer'>&nbsp;</li>
      </ul>
      <ul class='round round-1'>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Villanova</li>
        <li class='game-left spacer'>&nbsp;</li>
        <li class='game-left game-bottom'>Wisconsin</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Virginia</li>
        <li class='game-left spacer'>&nbsp;</li>
        <li class='game-left game-bottom'>Florida</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Southern California ...</li>
        <li class='game-left spacer'>&nbsp;</li>
        <li class='game-left game-bottom'>Baylor</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Southern Carolina</li>
        <li class='game-left spacer'>&nbsp;</li>
        <li class='game-left game-bottom'>Duke</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Gonzaga</li>
        <li class='game-left spacer'>&nbsp;</li>
        <li class='game-left game-bottom'>NorthWestern</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Notre Dame</li>
        <li class='game-left spacer'>&nbsp;</li>
        <li class='game-left game-bottom'>West Virginia</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Xavier</li>
        <li class='game-left spacer'>&nbsp;</li>
        <li class='game-left game-bottom'>Florida State</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Saint Marys</li>
        <li class='game-left spacer'>&nbsp;</li>
        <li class='game-left game-bottom'>Arizona</li>
        <li class='spacer'>&nbsp;</li>
      </ul>
      <ul class='round round-2'>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Wisconsin</li>
        <li class='game-left spacer'>&nbsp;</li>
        <li class='game-left game-bottom'>Florida</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Baylor</li>
        <li class='game-left spacer'>&nbsp;</li>
        <li class='game-left game-bottom'>South Carolina</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Gonzaga</li>
        <li class='game-left spacer'>&nbsp;</li>
        <li class='game-left game-bottom'>West Virginia</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Xavier</li>
        <li class='game-left spacer'>&nbsp;</li>
        <li class='game-left game-bottom'>Arizona</li>
        <li class='spacer'>&nbsp;</li>
      </ul>
      <ul class='round round-3'>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Florida</li>
        <li class='game-left spacer region region-right'>East</li>
        <li class='game-left game-bottom'>South Carolina</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Gonzaga</li>
        <li class='game-left spacer region region-right'>West</li>
        <li class='game-left game-bottom'>Xavier</li>
        <li class='spacer'>&nbsp;</li>
      </ul>
      <ul class='round round-4'>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>South Carolina</li>
        <li class='game-left spacer'>&nbsp;</li>
        <li class='game-left game-bottom'>Gonzaga</li>
        <li class='spacer'>&nbsp;</li>
      </ul>
      <ul class='round semi-final'>
        <li class='spacer'>&nbsp;</li>
        <li class='game-left game-top'>Gonzaga</li>
        <li class='spacer'>&nbsp;</li>
      </ul>
      <ul class='round finals'>
        <li class='spacer'>&nbsp;</li>
        <li class='game final'>North Carolina</li>
        <li class='spacer'>&nbsp;</li>
      </ul>
      <ul class='round semi-final'>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>North Carolina</li>
        <li class='spacer'>&nbsp;</li>
      </ul>
      <ul class='round round-4'>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>Oregon</li>
        <li class='game-right spacer'>&nbsp;</li>
        <li class='game-right game-bottom'>North Carolina</li>
        <li class='spacer'>&nbsp;</li>
      </ul>
      <ul class='round round-3'>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>Kansas</li>
        <li class='game-right spacer region region-left'>Midwest</li>
        <li class='game-right game-bottom'>Oregon</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>North Carolina</li>
        <li class='game-right spacer region region-left'>South</li>
        <li class='game-right game-bottom'>Kentucky</li>
        <li class='spacer'>&nbsp;</li>
      </ul>
      <ul class='round round-2'>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>Kansas</li>
        <li class='game-right spacer'>&nbsp;</li>
        <li class='game-right game-bottom'>Purdue</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>Oregon</li>
        <li class='game-right spacer'>&nbsp;</li>
        <li class='game-right game-bottom'>Michigan</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>North Carolina</li>
        <li class='game-right spacer'>&nbsp;</li>
        <li class='game-right game-bottom'>Butler</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>UCLA</li>
        <li class='game-right spacer'>&nbsp;</li>
        <li class='game-right game-bottom'>Kentucky</li>
        <li class='spacer'>&nbsp;</li>
      </ul>
      <ul class='round round-1'>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>Kansas</li>
        <li class='game-right spacer'>&nbsp;</li>
        <li class='game-right game-bottom'>Michigan State</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>Iowa State</li>
        <li class='game-right spacer'>&nbsp;</li>
        <li class='game-right game-bottom'>Purdue</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>Rhode Island</li>
        <li class='game-right spacer'>&nbsp;</li>
        <li class='game-right game-bottom'>Oregon</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>Michigan</li>
        <li class='game-right spacer'>&nbsp;</li>
        <li class='game-right game-bottom'>Louisville</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>North Carolina</li>
        <li class='game-right spacer'>&nbsp;</li>
        <li class='game-right game-bottom'>Arkansas</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>Middle Tennessee Sta&hellip;</li>
        <li class='game-right spacer'>&nbsp;</li>
        <li class='game-right game-bottom'>Butler</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>Cincinnati</li>
        <li class='game-right spacer'>&nbsp;</li>
        <li class='game-right game-bottom'>UCLA</li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>Wichita State</li>
        <li class='game-right spacer'>&nbsp;</li>
        <li class='game-right game-bottom'>Kentucky</li>
        <li class='spacer'>&nbsp;</li>
      </ul>
      <ul class='round seed'>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>Kansas</span>
          <span>1</span>
        </li>
        <li class='game-right game-bottom'>
          <span>UC Davis / North Car&hellip;</span>
          <span>16</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>Miami</span>
          <span>8</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Michigan State</span>
          <span>9</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>Iowa State</span>
          <span>5</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Nevada</span>
          <span>12</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>Purdue</span>
          <span>4</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Vermont</span>
          <span>13</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>Creighton</span>
          <span>6</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Rhode Island</span>
          <span>11</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>Oregon</span>
          <span>3</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Iona</span>
          <span>14</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>Michigan</span>
          <span>7</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Oklahoma State</span>
          <span>10</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>Louisville</span>
          <span>2</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Jacksonville State</span>
          <span>15</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>North Carolina</span>
          <span>1</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Texas Southern</span>
          <span>16</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>Arkansas</span>
          <span>8</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Seton Hall</span>
          <span>9</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>Minnesota</span>
          <span>5</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Middle Tennessee Sta&hellip;</span>
          <span>12</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>Butler</span>
          <span>4</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Winthrop</span>
          <span>13</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>Cincinnati</span>
          <span>6</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Wake Forest / Kansas&hellip;</span>
          <span>11</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>UCLA</span>
          <span>3</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Kent State</span>
          <span>14</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>Dayton</span>
          <span>7</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Wichita State</span>
          <span>10</span>
        </li>
        <li class='spacer'>&nbsp;</li>
        <li class='game-right game-top'>
          <span>Kentucky</span>
          <span>2</span>
        </li>
        <li class='game-right game-bottom'>
          <span>Northern Kentucky</span>
          <span>15</span>
        </li>
        <li class='spacer'>&nbsp;</li>
      </ul>
    </div>
    </>
    );
    }
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Bracket />);
