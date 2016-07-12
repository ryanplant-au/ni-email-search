import * as React from 'react';
import {UserResponse} from '../interfaces/UserResponse';
import {ListState} from '../interfaces/ListState';
import {UserRow} from './UserRow.react';
import {User} from '../interfaces/User';

export class List extends React.Component<any, ListState> {
    constructor() {
        super();
        this.state = {
            users: [],
            authenticated: false,
            sessionKey: '',
        }

        this.authenticate = this.authenticate.bind(this);
        this.addUser = this.addUser.bind(this);
        this.reportStats = this.reportStats.bind(this);
        this.search = this.search.bind(this);
    }

    authenticate(): void {
        let username = (document.getElementById('login') as HTMLInputElement).value;
        let password = ((document.getElementById('password') as HTMLInputElement)).value;
        $.ajax('http://forums.ni.com/restapi/vc/authentication/sessions/login', {
            dataType: 'jsonp',
            data: {
                'restapi.response_format': 'json',
                'user.login': username,
                'user.password': password
            },
            success: (data, textStatus, jqXHR) => {
                if (data.response.status === 'success' && data.response.value.$.length > 5) {
                    $('#auth_button').css('background-color', '#00e673');
                    this.setState({
                        sessionKey: data.response.value.$,
                        authenticated: true
                    }, () => console.log("Got " + this.state.sessionKey));
                } else {
                    alert("Error while authenticating. Are you sure you're an admin?");
                }
            }
        });
    }

    reportStats(): void {
        let failures = this.state.users.filter(user => user.props.username === '----------').length;
        let successes = this.state.users.length - failures;
        Materialize.toast(
            this.state.users.length + ' users. ' + successes + ' successes, ' + failures + ' failures.',
            10000);
    }

    searchInput(): string[] {
        return (document.getElementById('emailSearchList') as HTMLInputElement)
            .value
            .split(',');
    }

    addUser(email: string, username: string, id: string): void {
        localStorage.setItem(email, username + ',' + id);
        let newState = this.state.users.concat(<UserRow email={email} username={username} id={id} />);
        this.setState({
            users: newState
        }, () => console.log(this.state.users.length));
    }

    fetchLocal(email: string): void {
        let username: string;
        let id: string;
        [username, id] = localStorage.getItem(email).split(',');
        console.log(`Fetchlocal. About to add ${username}, ${email}, ${id}.`);
        this.addUser(email, username, id);
    }

    fetchRemote(email: string): void {
        let username: string;
        let id: string;
        let options: any = { 'restapi.response_format': 'json' };
        if(this.state.authenticated) {
            options.session_key = this.state.sessionKey;
        }
        $.ajax('http://forums.ni.com/restapi/vc/users/email/' + email, {
            dataType: 'jsonp',
            data: options,
            success: (data: UserResponse, textStatus: string, jqXHR: any) => {
                if (data.response.status === 'success') {
                    username = data.response.user.login.$;
                    id = data.response.user.id.$.toString();
                } else {
                    username = '----------';
                    id = '----------';
                }
                this.addUser(email, username, id);
                console.log("Success with " + options.session_key);
            }
        });
    }

    search(): void {
        let results = this.searchInput();
        for (let email of results) {
            if (localStorage.getItem(email) !== null) {
                this.fetchLocal(email);
            } else {
                this.fetchRemote(email);
            }
        }
    }

    clearCache(): void {
        localStorage.clear();
        Materialize.toast('Local cache cleared', 3500);
    }

    render() {
        return (
            <div className="col l8 offset-l2">
                <div className="row">
                    <div className="col l4">
                        <input type="text" id="login" placeholder="Username" />
                    </div>
                    <div className="col l4">
                        <input type="password" id="password" placeholder="Password" />
                    </div>
                    <div className="col l4">
                        <a className="btn waves-efect waves-light" id="auth_button" onClick={this.authenticate}>Authenticate</a>
                    </div>
                </div>

                <div className="row">
                    <textarea className="materialize-textarea"
                        id="emailSearchList"
                        placeholder="Paste a comma-separated list of email addresses here"
                        defaultValue="dave_gahan@ryanplant.net,martin_gore@ryanplant.net,roigrenouilles@phunkatronixxx.net" />
                </div>

                <div className="row">
                    <div className="col l3">
                        <a className="btn waves-effect waves-light" id="search_button" onClick={this.search}>Search</a>
                    </div>
                    <div className="col l3">
                        <a className="btn waves-effect waves-light" id="download_button">Download CSV File</a>
                    </div>
                    <div className="col l3">
                        <a className="btn waves-effect waves-light" id="stats_button" onClick={this.reportStats}>Statistics</a>
                    </div>
                    <div className="col l3">
                        <a className="btn waves-effect waves-light" id="clear_button" onClick={this.clearCache}>Clear Cache</a>
                    </div>
                </div>

                <div className="row">
                    <table>
                        <thead>
                            <tr>
                                <td>Email</td>
                                <td>Username</td>
                                <td>ID</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.users}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}