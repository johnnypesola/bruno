import React, { useContext } from 'react';
import Card from './components/Card';
import OnTable from './components/OnTable';
import CardDeck from './components/CardDeck';
import { CardInHand, Opponent, CardColor, NumericCardValue } from './types/commonTypes';
import { GameStateContext } from '.';
import Hand from './components/Hand';
import CardPile from './components/CardPile';
import { ClientEvent } from './types/clientEventTypes';
import Toaster from './components/Toaster';
import styled from 'styled-components';
import Menu from './components/Menu';
import { Character } from './components/Characters';

const CssContainer = styled.div`
  backface-visibility: visible;
  perspective-origin: 50% 100%;
  transform-style: preserve-3d;
  perspective: 1000px;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: 13vh 2% 0 2%;
`;

const OpponentsContainer = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
`;

const App: React.FC = () => {
  const { state, socket } = useContext(GameStateContext);
  const canPlay = (): boolean => {
    const isPlayersTurn = state.playerTurn === state.player.position;
    const isPlayerInGame = !state.player.hasExitedGame;
    return isPlayerInGame && isPlayersTurn;
  };

  const pickUpCard = (): void => {
    if (!canPlay()) return;
    socket.emit(ClientEvent.PickUpCard);
  };

  const playCard = (cardInHand: CardInHand, cardIndex: number): void => {
    if (!canPlay()) return;

    socket.emit(ClientEvent.PlayCard, cardIndex);
  };

  const playSelectedCards = (): void => {
    if (!canPlay()) return;
    socket.emit(ClientEvent.PlaySelectedCards);
  };

  const selectCard = (isSelected: boolean, cardInHand: CardInHand, cardIndex: number): void => {
    if (!canPlay()) return;

    socket.emit(ClientEvent.SelectCard, cardIndex, isSelected);
  };

  return (
    <>
      <Menu />
      <CssContainer>
        <OpponentsContainer>
          {state.opponents.map((opponent: Opponent, index) => (
            <>
              {opponent.position && (
                <Hand
                  key={index}
                  isHighlighted={state.gameStage === 'started' && state.playerTurn === opponent.position}
                  tablePosition={opponent.position}
                  cardsCount={opponent.cards.length}
                  numberOfPlayers={state.opponents.length + 1}
                >
                  {opponent.cards.map((card, index) => (
                    <Card
                      key={index}
                      color={CardColor.Blue}
                      value={NumericCardValue.Eight}
                      isConcealed={true}
                      isSelected={card.isSelected}
                      characterId={opponent.characterId}
                    />
                  ))}
                </Hand>
              )}
            </>
          ))}
        </OpponentsContainer>

        {state.gameStage !== 'characterSelection' && (
          <OnTable>
            <CardDeck onClick={() => pickUpCard()} />
            <CardPile />
          </OnTable>
        )}

        <Hand
          isHighlighted={state.gameStage === 'started' && state.playerTurn === state.player.position}
          tablePosition={0}
          cardsCount={state.player.cards.length}
          numberOfPlayers={state.opponents.length + 1}
        >
          {state.player.characterId && <Character isPlayer characterId={state.player.characterId} />}

          {state.player.cards.map((card, index) => (
            <Card
              key={index}
              color={card.color}
              value={card.value}
              isConcealed={card.isConcealed}
              onClick={() => (card.isSelected ? playSelectedCards() : playCard(card, index))}
              onDragUp={() => !card.isSelected && selectCard(true, card, index)}
              onDragDown={() => card.isSelected && selectCard(false, card, index)}
              isSelected={card.isSelected}
            />
          ))}
        </Hand>
        <Toaster message={state.toasterMessage} />
      </CssContainer>
    </>
  );
};

export default App;
