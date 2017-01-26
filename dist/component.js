"use strict";
const React = require("react");
const react_native_1 = require("react-native");
const native_1 = require("react-native-webview-invoke/native");
class RNEditor extends React.Component {
    constructor() {
        super(...arguments);
        this.invoke = native_1.default(() => this.webview);
        this.editorMounted = () => {
            alert('mounted');
        };
    }
    componentWillMount() {
        this.invoke.define('editorMounted', this.editorMounted);
    }
    render() {
        return React.createElement(react_native_1.WebView, { ref: (w) => this.webview = w, source: this.props.source, bounces: !this.props.autoHeight, onMessage: this.invoke.listener });
    }
}
RNEditor.defaultProps = {
    source: { uri: 'http://localhost:8888/' },
    autoHeight: false
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RNEditor;
//# sourceMappingURL=component.js.map