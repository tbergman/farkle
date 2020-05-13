import React from 'react';
import { FarkleLogic } from '../../../game/FarkleLogic';
import './GameInstructions.styles.scss';

const GameInstructions = () => (
  <section className="instructions">
    <h2 className="intro-subheader">Your goal</h2>
    <p>Get the highest score over {FarkleLogic.END_GAME_POINTS}</p>
    <h2 className="intro-subheader">How to play</h2>
    <p>
      Every player rolls and takes as many points as they want from the dice on
      the table. Then you can roll again with the leftover dice, but be careful
      not to Farkle! A player Farlkes when they can't score any points off the
      dice they just rolled.
    </p>
    <p>
      You need to score at least {FarkleLogic.REQUIRED_POINTS_ON_BOARD} points
      to get on the board. After that you can take as few or as many points as
      you want. But be carefult not to Farkle!
    </p>
    <h2 className="intro-subheader">Scoring</h2>
    <table className="scoring-table">
      <thead>
        <tr>
          <th>Roll</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>

        <tr>
          <th>5</th>
          <td>50 points</td>
        </tr>
        <tr>
          <th>1</th>
          <td>100 points</td>
        </tr>
        <tr>
          <th>Three 1s</th>
          <td>1000 points</td>
        </tr>
        <tr>
          <th>Three 2s</th>
          <td>200 points</td>
        </tr>
        <tr>
          <th>Three 3s</th>
          <td>300 points</td>
        </tr>
        <tr>
          <th>Three 4s</th>
          <td>400 points</td>
        </tr>
        <tr>
          <th>Three 5s</th>
          <td>500 points</td>
        </tr>
        <tr>
          <th>Three 6s</th>
          <td>600 points</td>
        </tr>
        <tr>
          <th>4+-of-a-kind</th>
          <td>Add the 3-of-a-kind score for each each extra die</td>
        </tr>
        <tr>
          <th>Straight</th>
          <td>1000 points</td>
        </tr>
        <tr>
          <th>3-pairs</th>
          <td>1000 points</td>
        </tr>
      </tbody>
    </table>
  </section>
);

GameInstructions.propTypes = {
  // bla: PropTypes.string,
};

GameInstructions.defaultProps = {
  // bla: 'test',
};

export default GameInstructions;
