import UserConnected, { Props as ConnectedProps } from './user-connected'

type Props = {
  ready: boolean;
} & ConnectedProps;

export default function UserReady({ ready, ...props}: Props) {
  return (
    <UserConnected {...props}>
      { ready ?
        <i className="ready">ready</i>
        :
        <i className="waiting">waiting...</i>
      }
    </UserConnected>
  );
}