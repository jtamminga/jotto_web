import React from 'react';
import { User } from './types';

export const DeductionContext = React.createContext({
  found: [],
  eliminated: []
});

export const SessionContext = React.createContext<string | undefined>(undefined);

export const UsersContext = React.createContext<User[]>([]);

export const WaitingContext = React.createContext<boolean>(false);
