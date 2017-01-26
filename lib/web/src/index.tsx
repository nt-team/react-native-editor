
import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './editor';

render(<AppContainer><App /></AppContainer>, document.querySelector("#app"));

var module: any = module

if (module && module['hot']) {
    module.hot.accept('./editor', () => {
        const App = require('./editor').default;
        render(
            <AppContainer>
                <App />
            </AppContainer>,
            document.querySelector("#app")
        );
    });
}