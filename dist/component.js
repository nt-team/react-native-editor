"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const React = require("react");
const react_native_1 = require("react-native");
const native_1 = require("react-native-webview-invoke/native");
const editor_webview_1 = require("../lib/javascript/editor-webview");
class RNEditor extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            height: 0
        };
        this.invoke = native_1.default(() => this.webview);
        // native apis
        this.editorMounted = () => __awaiter(this, void 0, void 0, function* () {
            // alert('mo')
            return {
                placeholder: this.props.placeholder,
                content: this.props.initialContent,
                autoHeight: this.props.autoHeight
            };
        });
        this.handleEditorHeightChange = (height) => {
            if (this.props.autoHeight) {
                this.setState({ height });
            }
        };
        // web apis
        this.insertImage = this.invoke.bind('editorInsertImage');
        this.insertVideo = this.invoke.bind('editorInsertVideo');
        this.insertText = this.invoke.bind('editorInsertText');
        this.setPlaceHolder = this.invoke.bind('editorSetPlaceHolder');
        this.setContent = this.invoke.bind('editorSetContent');
        this.getContent = this.invoke.bind('editorGetContent');
        this.setAutoHeight = this.invoke.bind('editorSetAutoHeight');
        // fix android
        // fix ios
        // others
        this.getWebViewStyle = () => {
            const webviewStyle = [];
            if (this.props.autoHeight) {
                webviewStyle.push({
                    height: this.state.height
                });
            }
            webviewStyle.push(this.props.style);
            return webviewStyle;
        };
    }
    // component
    componentWillMount() {
        this.invoke.define('editorMounted', this.editorMounted);
        this.invoke.define('editorHeightChange', this.handleEditorHeightChange);
        // fix android
        this.invoke.define('getClipboardText', react_native_1.Clipboard.getString);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.placeholder !== nextProps.placeholder) {
            this.setPlaceHolder(nextProps.placeholder);
        }
        if (this.props.autoHeight !== nextProps.autoHeight) {
            this.setAutoHeight(nextProps.autoHeight);
        }
    }
    render() {
        return (React.createElement(react_native_1.View, { style: this.getWebViewStyle() },
            React.createElement(editor_webview_1.default, { ref: (w) => this.webview = w, source: this.props.source, bounces: !this.props.autoHeight, scrollEnabled: !this.props.autoHeight, automaticallyAdjustContentInsets: !this.props.autoHeight, onMessage: this.invoke.listener, mediaPlaybackRequiresUserAction: true })));
    }
}
RNEditor.defaultProps = {
    source: require('../lib/web/dist/RNEditor.html'),
    autoHeight: false,
    placeholder: '',
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RNEditor;
//# sourceMappingURL=component.js.map