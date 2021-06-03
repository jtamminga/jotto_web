import { SessionContext, UsersContext } from "core/context";
import { User } from "core/types";

type UserListProps = {
  showReadyState?: boolean
};

export default function UserList({ showReadyState}: UserListProps) {
  return (
    <UsersContext.Consumer>
      { users =>
        <SessionContext.Consumer>
          { userId =>
            <div className="user-list">
              { users.map((user, i) =>
                <UserItem
                  key={i}
                  user={user}
                  sessionUserId={userId}
                  showReadyState={showReadyState}
                />
              )}
            </div>
          }
        </SessionContext.Consumer>
      }
    </UsersContext.Consumer>
  ); 
}

// User Item

type UserItemProps = {
  user: User,
  sessionUserId?: string,
  showReadyState?: boolean
};

function UserItem({
  user,
  sessionUserId,
  showReadyState
}: UserItemProps) {
  return (
    <div className="user">
      <div className={'status' + (user.connected ? ' connected' : '')}></div>

      { user.userId === sessionUserId ?
        <b className="username">{user.username}</b>
        :
        <span className="username">{user.username}</span>
      }

      { showReadyState && user.ready &&
          <i className="ready">ready</i> 
      }
      
      { showReadyState && !user.ready &&
          <i className="waiting">waiting...</i>
      }
    </div>
  );
}