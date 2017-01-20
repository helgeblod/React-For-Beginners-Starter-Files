// let's go!
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Match, Miss } from 'react-router';

import './css/style.css';
import App from './components/App'

const Root = () => {
    render () {
        return (
                <BrowserRouter>
                <Match exactly pattern="/" component={StorePicker}/>
                <Match pattern="/store/:storeId" component={App}/>
                </BrowserRouter>
        )

    }

}


render(<App/>, document.querySelector("#main"));
