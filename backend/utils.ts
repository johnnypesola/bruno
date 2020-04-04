export const getUserId = (connection):string => (connection as any).headers.cookie;

export const getUserIdsInChannel = (app, channel: string):string[] => {
  return app.channel(channel).connections.map(conn =>  conn.headers.cookie)
}