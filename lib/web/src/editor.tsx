import 'draft-js/dist/Draft.css'
import * as React from 'react'
import { Editor, EditorState } from 'draft-js'

const styles = require('./index.scss')

export interface RNEditorBrowserProperties {

}

export interface RNEditorBrowserStates {
    editorState?: EditorState
}

export default class RNEditorBrowser extends React.Component<RNEditorBrowserProperties, RNEditorBrowserStates> {
    state = {
        editorState: EditorState.createEmpty()
    }
    onEditorStateChange = (editorState: EditorState) => {
        this.setState({ editorState })
    }
    render() {
        return (
            <Editor editorState={this.state.editorState}
                onChange={this.onEditorStateChange}
                placeholder="test"
            />
        )
    }
}