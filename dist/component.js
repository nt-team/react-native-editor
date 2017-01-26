"use strict";
const React = require("react");
const react_native_1 = require("react-native");
const native_1 = require("react-native-webview-invoke/native");
class RNEditor extends React.Component {
    constructor() {
        super(...arguments);
        this.invoke = native_1.default(() => this.webview);
    }
    render() {
        return React.createElement(react_native_1.WebView, { ref: (w) => this.webview = w, source: this.props.source, bounces: !this.props.autoHeight, onMessage: this.invoke.listener });
    }
}
RNEditor.defaultProps = {
    source: require('../lib/web/dist/RNEditor.html'),
    autoHeight: false
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RNEditor;
//# sourceMappingURL=component.js.map