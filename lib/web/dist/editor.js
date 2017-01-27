"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require("draft-js/dist/Draft.css");
require("../global/index.css");
const React = require("react");
const draft_js_1 = require("draft-js");
const browser_1 = require("react-native-webview-invoke/browser");
const native_1 = require("./native");
const styles = require('./index.scss');
class RNEditorBrowser extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            editorState: draft_js_1.EditorState.createEmpty(this.composite),
            placeholder: ''
        };
        this.composite = new draft_js_1.CompositeDecorator([]);
        this.onEditorStateChange = (editorState) => {
            this.setState({ editorState });
        };
        this.insertMedia = (src, type) => {
            const { editorState } = this.state;
            const entityKey = draft_js_1.Entity.create(type, 'IMMUTABLE', { src });
            this.setState({
                editorState: draft_js_1.AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ')
            });
        };
        this.getContent = () => draft_js_1.convertToRaw(this.state.editorState.getCurrentContent());
        this.setContent = (content) => {
            if (content) {
                const contentState = draft_js_1.convertFromRaw(content);
                this.setState({
                    editorState: draft_js_1.EditorState.createWithContent(contentState, this.composite)
                });
            }
        };
        this.setPlaceHolder = (placeholder) => this.setState({ placeholder });
        this.insertImage = (uri) => this.insertMedia(uri, 'image');
        this.insertVideo = (uri) => this.insertMedia(uri, 'video');
        this.insertText = (text) => {
            if (typeof text === 'string') {
                this.setState({
                    editorState: replaceText(this.state.editorState, text)
                });
            }
        };
        this.handlePaste = (text) => {
            if (typeof text !== 'string') {
                native_1.default.getClipboardText().then((content) => {
                    this.onEditorStateChange(replaceText(this.state.editorState, content));
                });
                return 'handled';
            }
            return 'not-handled';
        };
        this.handleKeyCommand = (command) => {
            const { editorState } = this.state;
            const newState = draft_js_1.RichUtils.handleKeyCommand(editorState, command);
            if (newState) {
                this.onEditorStateChange(newState);
                return 'handled';
            }
            return 'not-handled';
        };
        this.registerAPIs = () => {
            browser_1.default.define('editorInsertImage', this.insertImage);
            browser_1.default.define('editorInsertVideo', this.insertVideo);
            browser_1.default.define('editorInsertText', this.insertText);
            browser_1.default.define('editorSetPlaceHolder', this.setPlaceHolder);
            browser_1.default.define('editorSetContent', this.setContent);
            browser_1.default.define('editorGetContent', this.getContent);
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            this.registerAPIs();
            const { placeholder, content } = yield native_1.default.editorMounted();
            this.setPlaceHolder(placeholder);
            this.setContent(content);
        });
    }
    render() {
        return (React.createElement(draft_js_1.Editor, { editorState: this.state.editorState, onChange: this.onEditorStateChange, placeholder: this.state.placeholder, handlePastedText: this.handlePaste, handleKeyCommand: this.handleKeyCommand, blockRendererFn: mediaBlockRenderer }));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RNEditorBrowser;
function replaceText(editorState, text) {
    var contentState = draft_js_1.Modifier.replaceText(editorState.getCurrentContent(), editorState.getSelection(), text);
    return draft_js_1.EditorState.push(editorState, contentState, 'insert-characters');
}
function mediaBlockRenderer(block) {
    if (block.getType() === 'atomic') {
        return {
            component: Media,
            editable: false,
        };
    }
    return null;
}
const Image = (props) => {
    return React.createElement("img", { src: props.src, className: styles.media });
};
const Video = (props) => {
    return React.createElement("video", { controls: true, src: props.src, className: styles.media });
};
const Media = (props) => {
    const entity = draft_js_1.Entity.get(props.block.getEntityAt(0));
    const { src } = entity.getData();
    const type = entity.getType();
    let media;
    if (type === 'image') {
        media = React.createElement(Image, { src: src });
    }
    else if (type === 'video') {
        media = React.createElement(Video, { src: src });
    }
    return media;
};
//# sourceMappingURL=editor.js.map