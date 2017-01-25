"use strict";
const React = require("react");
const react_native_1 = require("react-native");
class RNEditor extends React.Component {
    render() {
        return React.createElement(react_native_1.WebView, { ref: (w) => this.webview = w, source: require('../lib/web/dist/RNEditor.html') });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RNEditor;
//# sourceMappingURL=component.js.map