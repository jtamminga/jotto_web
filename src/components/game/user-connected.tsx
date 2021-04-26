import { SessionContext } from '../../game'

export type Props = {
  userId: string;
  username: string;
  connected: boolean;
  children?: React.ReactNode;
}

export default function UserConnected(
  { userId, username, connected, children }: Props
) {
  return (
    <SessionContext.Consumer>
      { context =>
        <div className="user">
          <div className={'status' + (connected ? ' connected' : '')}></div>

          { userId === context.userId ?
            <b className="username">{username}</b>
            :
            <span className="username">{username}</span>
          }

          {children}
        </div>
      }
    </SessionContext.Consumer>
  )
}