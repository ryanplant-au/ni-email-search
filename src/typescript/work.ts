///<reference path="../../typings/jquery/jquery.d.ts"/>
///<reference path="../../typings/globals/es6-shim/index.d.ts"/>

import {parse, download} from './csv';
import {getSessionKey} from './ni_email_search';
import {User} from './User';

$(document).ready(function () {
    localStorage.clear();
    let sessionKey: string;
    let userList: string[][] = [];

    $('#search_button').on('click', () => {
        let emailsToSearch: string[] = (<HTMLInputElement>document.getElementById('emailSearchList'))
                                                                  .value
                                                                  .split(',');
        for (let email of emailsToSearch) {
            let current = new User(email, sessionKey);
            current.fetch().then(() => {
                userList.push(current.listRepresentation());
                current.appendToTable();
            });
        }
    });

    $("#auth_button").on('click', () => {
        let username = (<HTMLInputElement>document.getElementById('login')).value;
        let password = (<HTMLInputElement>document.getElementById('password')).value;
        getSessionKey(username, password).then(result => {
            sessionKey = result;
        });
    });

    $("#download_button").on('click', () => {
        download(parse(userList), 'users.csv', 'text/csv');
    });
});