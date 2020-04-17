export enum Channels {
  CardPile = 'cardpile',
}

// export default (app: Api): void => {
//   app.service(Service.Player).publish(
//     PlayerEvent.PlayerAdded,
//     (newPlayer: Player, context): Channel => {
//       const opponent: Opponent = {
//         ...newPlayer,
//         cards: [null, null, null, null, null, null, null],
//       };

//       const otherPlayersChannels = getOtherPlayersChannels(app, newPlayer.id);
//       return otherPlayersChannels.send(opponent);
//     },
//   );
//   app.service(Service.Player).publish(
//     PlayerEvent.PlayerInit,
//     (data: InitPlayerData, context): Channel => {
//       const opponents: Opponent[] = data.otherPlayers.map(player => {
//         return { ...player, cards: player.cards.map(() => null) };
//       });

//       return app.channel(data.newPlayer.id).send(opponents);
//     },
//   );

//   app.service(Service.Player).publish(
//     PlayerEvent.PlayerRemoved,
//     (userId, context): Channel => {
//       const otherPlayersChannels = getOtherPlayersChannels(app, userId);
//       return otherPlayersChannels.send(userId);
//     },
//   );
// };
