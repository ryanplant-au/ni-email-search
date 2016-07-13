export const getSessionKey = (login: string, password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        $.ajax('http://forums.ni.com/restapi/vc/authentication/sessions/login', {
            dataType: 'jsonp',
            data: {
                'restapi.response_format': 'json',
                'user.login': login,
                'user.password': password
            },
            success: (data, textStatus, jqXHR) => {
                if (data.response.status === 'success') {
                    $('#auth_button').css('background-color', '#00e673');
                    resolve(data.response.value.$);
                } else {
                    alert("Error while authenticating! :(");
                }
            }
        });
    });
};

export const deauthenticate = () => {
    alert('Your session key has expired. Please re-authenticate.');
    $('#auth_button').css('background-color', 'red');
};

export const authenticate = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        let username = (<HTMLInputElement>document.getElementById('login')).value;
        let password = (<HTMLInputElement>document.getElementById('password')).value;
        getSessionKey(username, password).then(result => {
            resolve(result);
        });
    });
};