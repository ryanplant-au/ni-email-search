import {User} from './User'; 

export interface ListState {
    users?: JSX.Element[];
    authenticated?: boolean;
    sessionKey?: string;
}