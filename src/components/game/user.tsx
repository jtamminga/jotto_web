import React from 'react';
import { SessionContext } from '../../game'

type Props = {
  userId: string;
  username: string;
  connected: boolean;
}

export default function User({ userId, username, connected }: Props) {
  return (
    <SessionContext.Consumer>
      { context =>
        <div className="user">
          <div className={'status' + (connected ? ' connected' : '')}></div>
          { userId === context.userId && <b>(Me)</b> }
          <span>{username}</span>
        </div>
      }
    </SessionContext.Consumer>
  )
}