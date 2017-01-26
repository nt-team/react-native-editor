"use strict";
require("draft-js/dist/Draft.css");
const React = require("react");
const draft_js_1 = require("draft-js");
const styles = require('./index.scss');
class RNEditorBrowser extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            editorState: draft_js_1.EditorState.createEmpty()
        };
        this.onEditorStateChange = (editorState) => {
            this.setState({ editorState });
        };
    }
    render() {
        return (React.createElement(draft_js_1.Editor, { editorState: this.state.editorState, onChange: this.onEditorStateChange, placeholder: "test" }));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RNEditorBrowser;
//# sourceMappingURL=editor.js.map