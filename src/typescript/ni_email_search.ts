export const getSessionKey = (login: string, password: string): string => {
    console.log("Fired getSessionKey with login " + login + "and passsword " + password);
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
                console.log("Got session key " + sessionKey);
                sessionKey = data.response.value.$;
                $('#auth_button').css('background-color', '#00e673');
            } else {
                console.log("AJAX call resolved but auth failed");
                alert("Error while authenticating! :(");
            }
        }
    });
    return sessionKey;
};