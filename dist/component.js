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
class RNEditor extends React.Component {
    constructor() {
        super(...arguments);
        this.invoke = native_1.default(() => this.webview);
        this.editorMounted = () => __awaiter(this, void 0, void 0, function* () {
            alert('mounted');
            return {
                placeholder: this.props.placeholder,
                content: this.props.initialContent
            };
        });
        this.handleEditorHeightChange = (height) => {
            if (this.props.autoHeight) {
            }
        };
        // apis
        this.insertImage = this.invoke.bind('editorInsertImage');
        this.insertVideo = this.invoke.bind('editorInsertVideo');
        this.insertText = this.invoke.bind('editorInsertText');
        this.setPlaceHolder = this.invoke.bind('editorSetPlaceHolder');
        this.setContent = this.invoke.bind('editorSetContent');
        this.getContent = this.invoke.bind('editorGetContent');
    }
    // fix android
    // fix ios
    // component
    componentWillMount() {
        this.invoke.define('editorMounted', this.editorMounted);
        this.invoke.define('editorHeightChange', this.handleEditorHeightChange);
        // fix android
        this.invoke.define('getClipboardText', react_native_1.Clipboard.getString);
        this.insertImage('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1486098973&di=9f8132ec90dd9de2ddbf405bf91dcedd&imgtype=jpg&er=1&src=http%3A%2F%2Fi4.piimg.com%2F11340%2F7f638e192b9079e6.jpg');
        this.insertText('hjajajsetset');
        this.insertVideo('http://techslides.com/demos/sample-videos/small.mp4');
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.placeholder !== nextProps.placeholder) {
            this.setPlaceHolder(nextProps.placeholder);
        }
    }
    render() {
        return React.createElement(react_native_1.WebView, { ref: (w) => this.webview = w, source: this.props.source, style: this.props.style, bounces: !this.props.autoHeight, onMessage: this.invoke.listener });
    }
}
RNEditor.defaultProps = {
    source: require('../lib/web/dist/RNEditor.html'),
    autoHeight: false,
    placeholder: '21111',
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RNEditor;
//# sourceMappingURL=component.js.map