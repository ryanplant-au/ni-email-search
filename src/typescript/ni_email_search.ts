export const getSessionKey = (login: string, password: string): string => {
    console.log("Fired getSessionKey with login " + login + " and password " + password);
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
                console.log("AJAX call success");
                sessionKey = data.response.value.$;
                console.log("Got session key " + sessionKey);
                $('#auth_button').css('background-color', '#00e673');
            } else {
                console.log("AJAX call resolved but auth failed");
                alert("Error while authenticating! :(");
            }
        }
    });
    return sessionKey;
};