///<reference path="../../typings/jquery/jquery.d.ts"/>
///<reference path="../../typings/globals/es6-shim/index.d.ts"/>
///<reference path="../../typings/globals/materialize-css/index.d.ts"/>

import {parse, download} from './csv';
import {getSessionKey} from './auth';
import {User} from './User';

$(document).ready(function () {
    let sessionKey: string;
    let userList: string[][] = [];
    let numberOfSuccesses: number = 0;
    let numberOfFailures: number = 0;

    $('#search_button').on('click', () => {
        let emailsToSearch: string[] = (<HTMLInputElement>document.getElementById('emailSearchList'))
                                                                  .value
                                                                  .split(',');
        for (let email of emailsToSearch) {
            let current = new User(email, sessionKey);
            current.fetch().then(() => {
                userList.push(current.listRepresentation());
                current.appendToTable();
                if (current.email.includes('@')) {
                    numberOfSuccesses += 1;
                } else {
                    numberOfFailures += 1;
                }
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

    $("#stats_button").on('click', () => {
        let numberOfEmails: number = (<HTMLInputElement>document.getElementById('emailSearchList'))
                                                                .value
                                                                .split(',')
                                                                .length;
        Materialize.toast(
            numberOfEmails + ' emails. ' + numberOfSuccesses + ' successes, ' + numberOfFailures + ' failures.',
            10000);
    });
});