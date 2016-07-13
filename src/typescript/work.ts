///<reference path="../../typings/jquery/jquery.d.ts"/>
///<reference path="../../typings/globals/es6-shim/index.d.ts"/>
///<reference path="../../typings/globals/materialize-css/index.d.ts"/>

import {parse, download} from './csv';
import {getSessionKey, deauthenticate, authenticate} from './auth';
import {User} from './User';
import * as $ from 'jquery';
window['$'] = $;

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
                if (current.username !== '----------') {
                    numberOfSuccesses += 1;
                } else {
                    numberOfFailures += 1;
                }
            });
        }
    });

    $("#auth_button").on('click', () => {
        authenticate().then(result => sessionKey = result);
        const thirtyMinutes = 1800000; // thirty minutes in milliseconds
        setTimeout(deauthenticate, thirtyMinutes);
    });

    $("#download_button").on('click', () => {
        download(parse(userList), 'users.csv', 'text/csv');
    });

    $("#stats_button").on('click', () => {
        Materialize.toast(
            userList.length + ' emails. ' + numberOfSuccesses + ' successes, ' + numberOfFailures + ' failures.',
            10000);
    });

    $("#clear_button").on('click', () => {
        localStorage.clear();
        Materialize.toast('Local cache cleared', 3500);
    });
});