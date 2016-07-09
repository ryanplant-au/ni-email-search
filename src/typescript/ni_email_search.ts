// Generate a row with email, login, and ID cells, to append to a table later.
const userRow = (email: string, login: string, id: string): HTMLTableRowElement => {
    let result: HTMLTableRowElement = document.createElement('tr');

    let emailCell: HTMLTableCellElement = document.createElement('td');
    emailCell.appendChild(document.createTextNode(email));
    result.appendChild(emailCell);

    let loginCell: HTMLTableCellElement = document.createElement('td');
    loginCell.appendChild(document.createTextNode(login));
    result.appendChild(loginCell);

    let idCell: HTMLTableCellElement = document.createElement('td');
    idCell.appendChild(document.createTextNode(id));
    result.appendChild(idCell);

    return result;
};

const appendRow = (rowToAppend: HTMLTableRowElement): void => {
    document.getElementById('target').appendChild(rowToAppend);
};

interface User {
    email: string;
    login: string;
    id: string;
}

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

// Checks localStorage to see if we have a user's data.
// If we do, we return it. If we don't, we fetch it from the API.
// We use localStorage with emails as keys and "username,ID" as values.
export const fetchUserdata = (email: string, sessionKey: string, listToAddTo: string[][]): void => {
    let username: string;
    let id: string;

    if (localStorage.getItem(email) !== null) {
        [username, id] = localStorage.getItem(email).split(',');
        appendRow(userRow(email, username, id));
        listToAddTo.push([email, username, id]);
    } else {
        $.ajax('http://forums.ni.com/restapi/vc/users/email/' + email, {
            dataType: 'jsonp',
            data: {
                'restapi.response_format': 'json',
                'restapi.session_key': sessionKey
            },
            success: (data: UserResponse, textStatus, jqXHR) => {
                if (data.response.status === 'success') {
                    username = data.response.user.login.$;
                    id = data.response.user.id.$.toString();
                } else {
                    username = '----------';
                    id = '----------';
                }
                appendRow(userRow(email, username, id));
                listToAddTo.push([email, username, id]);
                localStorage.setItem(email, username + ',' + id);
            }
        });
    }
};

export const getSessionKey = (login: string, password: string): string => {
    let sessionKey: string;
    $.ajax('http://forums.ni.com/restapi/vc/authentication/sessions/login', {
        dataType: 'jsonp',
        data: {
            'restapi.response_format': 'json',
            'user.login': login,
            'user.password': password
        },
        success: (data, textStatus, jqXHR) => {
            if (data.response.status === 'success') {
                sessionKey = data.response.value.$;
                $('#auth_button').css('background-color', '#00e673');
            } else {
                alert("Error while authenticating! :(");
            }
        }
    });
    return sessionKey;
};