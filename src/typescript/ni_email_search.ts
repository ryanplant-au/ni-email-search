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

// Gets passed the result of an AJAX call and decides what to do with it.
// Appends either the row of details, or EMAIL/---------/--------, depending
// on whether the call found a user. Also adds a user to the list it's passed.
const processCallRequest = (data: UserResponse, email: string, listToAddTo: string[][]): void => {
    if (data.response.status === 'success') {
        let row = userRow(
            data.response.user.email.$,
            data.response.user.login.$,
            data.response.user.id.$.toString());
        appendRow(row);
        listToAddTo.push([
            data.response.user.email.$,
            data.response.user.login.$,
            data.response.user.id.$.toString()
        ]);
    } else {
        appendRow(userRow(email, '----------', '----------'));
        listToAddTo.push([
            email,
            '----------',
            '----------'
        ]);
    }
};

// Fetches a User object through an async JSONP call, and passes it to processCallRequest
export const fetchUserdata = (email: string, sessionKey: string, listToAddTo: string[][]): void => {
    $.ajax('http://forums.ni.com/restapi/vc/users/email/' + email, {
        dataType: 'jsonp',
        data: {
            'restapi.response_format': 'json',
            'restapi.session_key': sessionKey
        },
        success: (data, textStatus, jqXHR) => processCallRequest(data, email, listToAddTo)
    });
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