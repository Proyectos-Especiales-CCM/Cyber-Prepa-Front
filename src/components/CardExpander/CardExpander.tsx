import { Box } from "@mui/material";
import { AddStudentButton, CollapsedStudents } from ".."
import { Game } from "../../services/types";
import { EndPlayForAllButton } from "../EndPlayForAllButton";
import './CardExpander.css';
import React, { CSSProperties } from 'react';

interface CardExpanderProps {
  cardGame: Game;
  shouldUpdate: boolean;
  onUpdated(): void;
  countdownStatus: string;
}

const CardExpander: React.FC<CardExpanderProps> = ({ cardGame, shouldUpdate, onUpdated, countdownStatus }) => {

  const isGameActive = countdownStatus !== "AGOTADO";
  const showEndPlayForAllButton = Array.isArray(cardGame.plays) && cardGame.plays.length >= 1;

  const fadedStyle: CSSProperties = {
    opacity: 0.5,
    pointerEvents: 'none',
  };

  const contentStyle: CSSProperties = !isGameActive ? fadedStyle : {};

  return (
    <div className="cyber__card__expander">
      <i className="fa fa-close [ js-collapser ]" style={contentStyle}></i>
      <Box className="box-row">
        <AddStudentButton cardGame={cardGame} style={contentStyle}/>
        {showEndPlayForAllButton && <EndPlayForAllButton cardGame={cardGame} />}
      </Box>
      <CollapsedStudents
        cardGame={cardGame}
        shouldUpdate={shouldUpdate}
        onUpdated={onUpdated}
        style={contentStyle}
      />
    </div>
  );
};

export default CardExpander
