import { useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { GameStateContext } from '..';
import { ServerEvent } from '../types/serverEventTypes';
import { enumAsValues } from '../utils';

const useApi = (): SocketIOClient.Socket => {
  const socket = useRef<SocketIOClient.Socket>();
  const { dispatch } = useContext(GameStateContext);

  useEffect(() => {
    socket.current = io('http://localhost:8080');

    // Receive real-time events through Socket.io

    enumAsValues(ServerEvent).forEach(event => {
      socket.current?.on(event, (value: any) => {
        dispatch({
          name: event,
          value,
        });
      });
    });

    // socket.current.on(PlayerEvent.PlayedCard, (newCards: CardInHand[]) => {
    //   dispatch({
    //     name: ServerEvent.PlayerPlaysCard,
    //     value: { newCards },
    //   });
    // });
    // socket.current.on(PlayerEvent.PlayerInit, (initData: InitPlayerData) => {
    //   dispatch({
    //     name: ServerEvent.InitPlayer,
    //     value: { player: initData.newPlayer },
    //   });
    //   dispatch({
    //     name: ServerEvent.AddOpponents,
    //     value: { opponents: initData.opponents },
    //   });
    //   dispatch({
    //     name: ServerEvent.SetPlayerTurn,
    //     value: { position: initData.playerTurnPosition },
    //   });
    //   dispatch({
    //     name: ServerEvent.UpdateCardPile,
    //     value: { cards: initData.cardsInPile },
    //   });
    // });

    // socket.current.on(OpponentEvent.OpponentAdded, (opponent: Opponent) => {
    //   console.log(opponent);
    //   dispatch({
    //     name: ServerEvent.AddOpponent,
    //     value: { opponent },
    //   });
    // });

    // socket.current.on(OpponentEvent.OpponentRemoved, (id: string) => {
    //   dispatch({
    //     name: ServerEvent.RemoveOpponent,
    //     value: { id },
    //   });
    // });

    // socket.current.on(OpponentEvent.OpponentUpdate, (opponent: Opponent) => {
    //   dispatch({
    //     name: ServerEvent.UpdateOpponent,
    //     value: { opponent },
    //   });
    // });

    // socket.current.on(PlayerEvent.NextPlayerTurn, (position: number) => {
    //   dispatch({
    //     name: ServerEvent.SetPlayerTurn,
    //     value: { position },
    //   });
    // });

    // socket.current.on(PlayerEvent.PickedUpCard, (card: CardInHand) => {
    //   dispatch({
    //     name: ServerEvent.PlayerPickedUpCard,
    //     value: { card },
    //   });
    // });

    // socket.current.on(CardPileEvent.CardAddedToPile, (card: CardInPile) => {
    //   dispatch({
    //     name: ServerEvent.AddCardToPile,
    //     value: { card },
    //   });
    // });
  }, []);

  return socket.current as SocketIOClient.Socket;
};

export default useApi;
