import 'draft-js/dist/Draft.css'
import '../global/index.css'
import * as React from 'react'
import {
    Editor, EditorState, RichUtils, Modifier,
    convertToRaw, convertFromRaw, RawDraftContentState,
    CompositeDecorator, Entity, ContentBlock, AtomicBlockUtils
} from 'draft-js'
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
        editorState: EditorState.createEmpty(this.composite),
        placeholder: ''
    }
    composite = new CompositeDecorator([])
    private onEditorStateChange = (editorState: EditorState) => {
        this.setState({ editorState })
    }
    private insertMedia = (src: string, type: string) => {
        const { editorState } = this.state
        const entityKey = Entity.create(type, 'IMMUTABLE', { src })

        this.setState({
            editorState: AtomicBlockUtils.insertAtomicBlock(
                editorState,
                entityKey,
                ' '
            )
        })
    }
    getContent = () => convertToRaw(this.state.editorState.getCurrentContent())
    setContent = (content: any) => {
        if (content) {
            const contentState = convertFromRaw(content)
            this.setState({
                editorState: EditorState.createWithContent(contentState, this.composite)
            })
        }
    }
    setPlaceHolder = (placeholder: string) => this.setState({ placeholder })
    insertImage = (uri: string) => this.insertMedia(uri, 'image')
    insertVideo = (uri: string) => this.insertMedia(uri, 'video')
    insertText = (text: string) => {
        if (typeof text === 'string') {
            this.setState({
                editorState: replaceText(this.state.editorState, text)
            })
        }
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
    registerAPIs = () => {
        invoke.define('editorInsertImage', this.insertImage)
        invoke.define('editorInsertVideo', this.insertVideo)
        invoke.define('editorInsertText', this.insertText)
        invoke.define('editorSetPlaceHolder', this.setPlaceHolder)
        invoke.define('editorSetContent', this.setContent)
        invoke.define('editorGetContent', this.getContent)
    }
    async componentDidMount() {
        this.registerAPIs()
        const { placeholder, content } = await Native.editorMounted()
        this.setPlaceHolder(placeholder)
        this.setContent(content)
    }
    render() {
        return (
            <Editor editorState={this.state.editorState}
                onChange={this.onEditorStateChange}
                placeholder={this.state.placeholder}
                handlePastedText={this.handlePaste}
                handleKeyCommand={this.handleKeyCommand}
                blockRendererFn={mediaBlockRenderer}
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
    )
    return EditorState.push(editorState, contentState, 'insert-characters')
}


function mediaBlockRenderer(block: ContentBlock) {
    if (block.getType() === 'atomic') {
        return {
            component: Media,
            editable: false,
        }
    }

    return null
}


const Image = (props: any) => {
    return <img src={props.src} className={styles.media} />
}

const Video = (props: any) => {
    return <video controls src={props.src} className={styles.media} />
}

const Media = (props: any) => {
    const entity = Entity.get(props.block.getEntityAt(0))
    const {src} = entity.getData()
    const type = entity.getType()

    let media
    if (type === 'image') {
        media = <Image src={src} />
    } else if (type === 'video') {
        media = <Video src={src} />
    }

    return media;
}