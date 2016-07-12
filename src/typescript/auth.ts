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