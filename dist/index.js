/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_native_1 = require("react-native");
var RNEditorDev = (function (_super) {
    __extends(RNEditorDev, _super);
    function RNEditorDev() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RNEditorDev.prototype.render = function () {
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(react_native_1.Text, { style: styles.welcome }, "Welcome to React Native!"),
            React.createElement(react_native_1.Text, { style: styles.instructions }, "To get started, edit index.ios.js"),
            React.createElement(react_native_1.Text, { style: styles.instructions },
                "Press Cmd+R to reload,",
                '\n',
                "Cmd+D or shake for dev menu")));
    };
    return RNEditorDev;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RNEditorDev;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
react_native_1.AppRegistry.registerComponent('RNEditorDev', function () { return RNEditorDev; });
//# sourceMappingURL=index.js.map