interface UserResponse {
    response: {
        status: string;
        user: {
            type: string;
            href: string;
            average_message_rating: {
                type: string;
                $: number;
            },
            average_rating: {
                type: string;
                $: number;
            },
            last_visit_time: {
                type: string;
                $: string;
            },
            email: {
                type: string;
                $: string;
            },
            registration_time: {
                type: string;
                $: string;
            },
            profiles: {
                profile: {
                    name: string;
                    type: string;
                    $: string;
                }[];
            },
            login: {
                type: string;
                $: string;
            }
            anonymous: {
                type: string;
                $: boolean;
            },
            registered: {
                type: string;
                $: boolean;
            },
            id: {
                type: string;
                $: number;
            },
            deleted: {
                type: string;
                $: boolean
            }
        }
    }
}

export class User {
    username: string;
    id: string;
    email: string;
    sessionKey: string;

    constructor(email: string, sessionKey: string) {
        this.email = email;
        this.sessionKey = sessionKey;
    }

    fetchLocal(): Promise<{}> {
        return new Promise((resolve, reject) => {
            [this.username, this.id] = localStorage.getItem(this.email).split(',');
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
                async: false,
                success: (data: UserResponse, textStatus, jqXHR) => {
                    if (data.response.status === 'success') {
                        this.username = data.response.user.login.$;
                        this.id = data.response.user.id.$.toString();
                    } else {
                        this.username = '----------';
                        this.id = '----------';
                    }
                    localStorage.setItem(this.email, this.username + ',' + this.id);
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
                async: false,
                success: (data: UserResponse, textStatus, jqXHR) => {
                    if (data.response.status === 'success') {
                        this.username = data.response.user.login.$;
                        this.id = data.response.user.id.$.toString();
                    } else {
                        this.username = '----------';
                        this.id = '----------';
                    }
                    localStorage.setItem(this.email, this.username + ',' + this.id);
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

        return result;
    }
}

