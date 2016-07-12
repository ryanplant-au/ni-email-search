///<reference path="../../typings/jquery/jquery.d.ts"/>
///<reference path="../../typings/globals/es6-shim/index.d.ts"/>
///<reference path="../../typings/globals/materialize-css/index.d.ts"/>

import '../sass/main.scss';
import {parse, download} from './csv';
import {User} from './User';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';
window['$'] = $;
import {List} from './components/List.react';

$(document).ready(function () {
    ReactDOM.render(<List />, document.getElementById('main'));
    $("#download_button").on('click', () => {
        //download(parse(userList), 'users.csv', 'text/csv');
    });
});