import 'draft-js/dist/Draft.css'
import '../global/index.css'
import * as React from 'react'
import { Editor, EditorState, RichUtils, Modifier } from 'draft-js'
import invoke from 'react-native-webview-invoke/browser'
import Native from './native'

const styles = require('./index.scss')

export interface RNEditorBrowserProperties {

}

export interface RNEditorBrowserStates {
    editorState?: EditorState
    placeholder?: string
}

export default class RNEditorBrowser extends React.Component<RNEditorBrowserProperties, RNEditorBrowserStates> {
    state: RNEditorBrowserStates = {
        editorState: EditorState.createEmpty(),
        placeholder: ''
    }
    onEditorStateChange = (editorState: EditorState) => {
        this.setState({ editorState })
    }
    handlePaste = (text: string) => {
        // fix android
        if (typeof text !== 'string') {
            Native.getClipboardText().then((content: string) => {
                this.onEditorStateChange(replaceText(this.state.editorState, content))
            })
            return 'handled'
        }
        return 'not-handled'
    }
    handleKeyCommand = (command: any) => {
        const {editorState} = this.state
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            this.onEditorStateChange(newState)
            return 'handled'
        }
        return 'not-handled'
    }
    async componentDidMount() {
        const { placeholder } = await Native.editorMounted()
        this.setState({ placeholder })
    }
    render() {
        return (
            <Editor editorState={this.state.editorState}
                onChange={this.onEditorStateChange}
                placeholder={this.state.placeholder}
                handlePastedText={this.handlePaste}
                handleKeyCommand={this.handleKeyCommand}
            />
        )
    }
}

function replaceText(
    editorState: EditorState,
    text: string,
): EditorState {
    var contentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        text,
    );
    return EditorState.push(editorState, contentState, 'insert-characters');
}