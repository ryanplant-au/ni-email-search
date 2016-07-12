import * as React from 'react';
import {User} from '../interfaces/User';

export class UserRow extends React.Component<User, any> {
    render () {
        return(<tr>
            <td>{this.props.email}</td>
            <td>{this.props.username}</td>
            <td>{this.props.id}</td>
        </tr>);
    }
}