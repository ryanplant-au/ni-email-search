///<reference path="../../typings/jquery/jquery.d.ts"/>

import {parse, download} from './csv';
import {fetchUserdata, getSessionKey} from './ni_email_search';

$(document).ready(function () {
    let sessionKey: string;
    let userList: string[][] = [];

    $('#search_button').on('click', () => {
        let emailsToSearch: string[] = (<HTMLInputElement>document.getElementById('emailSearchList'))
                                                                  .value
                                                                  .split(',');
        for (let email of emailsToSearch) {
            fetchUserdata(email, sessionKey, userList);
        }
    });

    $("#auth_button").on('click', () => {
        let username = (<HTMLInputElement>document.getElementById('login')).value;
        let password = (<HTMLInputElement>document.getElementById('password')).value;
        sessionKey = getSessionKey(username, password);
    });

    $("#download_button").on('click', () => {
        download(parse(userList), 'users.csv', 'text/csv');
    });
});