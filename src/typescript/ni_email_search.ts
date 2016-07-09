export const getSessionKey = (login: string, password: string): Promise<string> => {
    console.log("Fired getSessionKey with login " + login + " and password " + password);

    return new Promise((resolve, reject) => {
        let output: string;
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
                    output = data.response.value.$;
                    console.log("Got session key " + output);
                    $('#auth_button').css('background-color', '#00e673');
                    resolve(output);
                } else {
                    console.log("AJAX call resolved but auth failed");
                    alert("Error while authenticating! :(");
                }
            }
        });
    });
};