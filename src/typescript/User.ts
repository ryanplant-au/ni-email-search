import {UserResponse} from './interfaces/UserResponse.interface';

export class User {
    username: string;
    id: string;
    email: string;
    sessionKey: string;
    firstName: string;
    lastName: string;

    constructor(email: string, sessionKey: string) {
        this.email = email;
        this.sessionKey = sessionKey;
    }

    fetchLocal(): Promise<{}> {
        return new Promise((resolve, reject) => {
            [this.username, this.id, this.firstName, this.lastName] = localStorage.getItem(this.email).split(',');
            resolve(true);
        });
        
    }

    fetchRemoteUnauthenticated() {
        return new Promise((resolve, reject) => {
            $.ajax('http://forums.ni.com/restapi/vc/users/email/' + this.email, {
                dataType: 'jsonp',
                data: {
                    'restapi.response_format': 'json',
                },
                success: (data: UserResponse, textStatus, jqXHR) => {
                    if (data.response.status === 'success') {
                        this.username = data.response.user.login.$;
                        this.id = data.response.user.id.$.toString();
                        this.firstName = data.response.user.profiles.profile.filter(profile => profile.name === 'name_first')[0].$;
                        this.lastName = data.response.user.profiles.profile.filter(profile => profile.name === 'name_last')[0].$;                        
                    } else {
                        this.username = '----------';
                        this.id = '----------';
                        this.firstName = '----------';
                        this.lastName = '----------';                        
                    }
                    localStorage.setItem(this.email, [this.username, this.id, this.firstName, this.lastName].join(','));
                    resolve(true);
                }
            });
        });

    }

    fetchRemoteAuthenticated(): Promise<{}> {
        return new Promise((resolve, reject) => {
            $.ajax('http://forums.ni.com/restapi/vc/users/email/' + this.email, {
                dataType: 'jsonp',
                data: {
                    'restapi.response_format': 'json',
                    'restapi.session_key': this.sessionKey
                },
                success: (data: UserResponse, textStatus, jqXHR) => {
                    if (data.response.status === 'success') {
                        this.username = data.response.user.login.$;
                        this.id = data.response.user.id.$.toString();
                        this.firstName = data.response.user.profiles.profile.filter(profile => profile.name === 'name_first')[0].$;
                        this.lastName = data.response.user.profiles.profile.filter(profile => profile.name === 'name_last')[0].$;
                    } else {
                        this.username = '----------';
                        this.id = '----------';
                        this.firstName = '----------';
                        this.lastName = '----------';
                    }
                    localStorage.setItem(this.email, [this.username, this.id, this.firstName, this.lastName].join(','));
                    resolve(true);
                }
            });
        });
    }

    fetch(): Promise<{}> {
        if (localStorage.getItem(this.email) !== null) {
            return this.fetchLocal();
        } else {
            return this.fetchRemoteAuthenticated();
        }
    }

    appendToTable() {
        document.getElementById('target').appendChild(this.htmlRow());
    }

    listRepresentation() {
        return [this.email, this.username, this.id];
    }

    htmlRow() {
        let result: HTMLTableRowElement = document.createElement('tr');

        let emailCell: HTMLTableCellElement = document.createElement('td');
        emailCell.appendChild(document.createTextNode(this.email));
        result.appendChild(emailCell);

        let loginCell: HTMLTableCellElement = document.createElement('td');
        loginCell.appendChild(document.createTextNode(this.username));
        result.appendChild(loginCell);

        let idCell: HTMLTableCellElement = document.createElement('td');
        idCell.appendChild(document.createTextNode(this.id));
        result.appendChild(idCell);

        let firstNameCell: HTMLTableCellElement = document.createElement('td');
        firstNameCell.appendChild(document.createTextNode(this.firstName));
        result.appendChild(firstNameCell);

        let lastNameCell: HTMLTableCellElement = document.createElement('td');
        lastNameCell.appendChild(document.createTextNode(this.lastName));
        result.appendChild(lastNameCell);

        return result;
    }
}

