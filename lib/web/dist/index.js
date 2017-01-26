"use strict";
const React = require("react");
const react_dom_1 = require("react-dom");
const react_hot_loader_1 = require("react-hot-loader");
const editor_1 = require("./editor");
react_dom_1.render(React.createElement(react_hot_loader_1.AppContainer, null,
    React.createElement(editor_1.default, null)), document.querySelector("#app"));
var module = module;
if (module && module['hot']) {
    module.hot.accept('./editor', () => {
        const App = require('./editor').default;
        react_dom_1.render(React.createElement(react_hot_loader_1.AppContainer, null,
            React.createElement(App, null)), document.querySelector("#app"));
    });
}
//# sourceMappingURL=index.js.map