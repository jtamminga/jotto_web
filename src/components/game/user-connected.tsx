import { SessionContext } from 'core/context';

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
      { contextUserId =>
        <div className="user">
          <div className={'status' + (connected ? ' connected' : '')}></div>

          { userId === contextUserId ?
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