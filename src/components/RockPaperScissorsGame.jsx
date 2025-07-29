import React, { useState, useRef } from 'react';
import './RockPaperScissorsGame.css'; // We will create this CSS file

  const choices = [
  { name: 'ຄ້ອນ', emoji: '✊', beats: 'ກັນໄກ' },
  { name: 'ເຈ້ຍ', emoji: '✋', beats: 'ຄ້ອນ' },
  { name: 'ກັນໄກ', emoji: '✌️', beats: 'ເຈ້ຍ' },
];

const RockPaperScissorsGame = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, computer: 0, draw: 0 });

  const handlePlay = (choiceName) => {
    const playerSelection = choices.find(c => c.name === choiceName);
    setPlayerChoice(playerSelection);

    const computerSelection = choices[Math.floor(Math.random() * choices.length)];
    setComputerChoice(computerSelection);

    determineWinner(playerSelection, computerSelection);
  };

  const determineWinner = (player, computer) => {
    if (player.name === computer.name) {
      setResult('ສະເໝີ!');
      setScore(prev => ({ ...prev, draw: prev.draw + 1 }));
    } else if (player.beats === computer.name) {
      setResult('ເຈົ້າຊະນະ!');
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else {
      setResult('ຄອມພິວເຕີຊະນະ!');
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
    }
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScore({ player: 0, computer: 0, draw: 0 });
  };

  return (
    <div className="rps-container">
      <h2>ເກມເປົ່າ-ຍິງ-ຊຸບ</h2>

      <div className="score-board mb-4">
        <p>ຜູ້ຫຼິ້ນ: {score.player} | ຄອມພິວເຕີ: {score.computer} | ສະເໝີ: {score.draw}</p>
      </div>

      <div className="choices-buttons mb-4">
        {choices.map((choice) => (
          <button
            key={choice.name}
            className="btn btn-outline-primary btn-lg mx-2"
            onClick={() => handlePlay(choice.name)}
          >
            {choice.emoji} {choice.name}
          </button>
        ))}
      </div>

      {playerChoice && computerChoice && (
        <div className="result-section text-center mt-4">
          <div className="d-flex justify-content-center mb-3">
            <div className="player-choice mx-3">
              <h4>ເຈົ້າເລືອກ:</h4>
              <p className="display-1">{playerChoice.emoji}</p>
              <p className="h4">{playerChoice.name}</p>
            </div>
            <div className="computer-choice mx-3">
              <h4>ຄອມພິວເຕີເລືອກ:</h4>
              <p className="display-1">{computerChoice.emoji}</p>
              <p className="h4">{computerChoice.name}</p>
            </div>
          </div>
          {result && <h3 className="display-4 text-success">{result}</h3>}
        </div>
      )}

      <button className="btn btn-secondary mt-4" onClick={resetGame}>
        ເລີ່ມເກມໃໝ່
      </button>
    </div>
  );
};

export default RockPaperScissorsGame;
