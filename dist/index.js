/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
"use strict";
const React = require("react");
const react_native_1 = require("react-native");
const component_1 = require("./component");
class RNEditorDev extends React.Component {
    render() {
        return (React.createElement(react_native_1.KeyboardAvoidingView, { style: { flex: 1 }, contentContainerStyle: { flex: 1 }, keyboardVerticalOffset: 0 },
            React.createElement(component_1.default, { style: styles.editor, placeholder: "here is placeholder" })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RNEditorDev;
const styles = react_native_1.StyleSheet.create({
    editor: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#000',
        borderStyle: 'solid',
        flex: 1
    }
});
react_native_1.AppRegistry.registerComponent('RNEditorDev', () => RNEditorDev);
//# sourceMappingURL=index.js.map