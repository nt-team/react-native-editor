import 'draft-js/dist/Draft.css'
import '../global/index.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
    Editor, EditorState, RichUtils, Modifier,
    convertToRaw, convertFromRaw, RawDraftContentState,
    CompositeDecorator, Entity, ContentBlock, AtomicBlockUtils
} from 'draft-js'
import invoke from 'react-native-webview-invoke/browser'
import Native from './native'

const styles = require('./index.scss')

export interface RNEditorBrowserProperties {
    initialHeight?: number
}

export interface RNEditorBrowserStates {
    editorState?: EditorState
    placeholder?: string
}

export default class RNEditorBrowser extends React.Component<RNEditorBrowserProperties, RNEditorBrowserStates> {
    static defaultProps: RNEditorBrowserProperties = {
        initialHeight: 0
    }
    state: RNEditorBrowserStates = {
        editorState: EditorState.createEmpty(this.composite),
        placeholder: ''
    }
    private composite = new CompositeDecorator([])
    private autoHeight = false
    private editor: Editor
    private onEditorStateChange = (editorState: EditorState) => {
        this.setState({ editorState }, this.measureEditorHeight)
    }
    private insertMedia = (data: any, type: string) => {
        const { editorState } = this.state
        const entityKey = Entity.create(type, 'IMMUTABLE', data)

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
    setAutoHeight = (autoHeight: boolean) => this.autoHeight = autoHeight

    insertImage = (uri: string) => this.insertMedia({ src: uri }, 'image')
    insertVideo = (uri: string) => this.insertMedia({ src: uri }, 'video')
    insertText = (text: string) => {
        if (typeof text === 'string') {
            this.setState({
                editorState: replaceText(this.state.editorState, text)
            })
        }
    }
    private lastEditorHeight = 0
    private lastEditorHeightTimer: any
    measureEditorHeight = () => {
        this.autoHeight && window.scrollTo(0, 0)

        clearTimeout(this.lastEditorHeightTimer)
        this.lastEditorHeightTimer = setTimeout(() => {
            const $editor = ReactDOM.findDOMNode(this.editor)
            if ($editor) {
                const height = $editor.clientHeight
                if (height !== this.lastEditorHeight) {
                    Native.editorHeightChange(height + this.props.initialHeight)
                    this.lastEditorHeight = height
                }
            }
        }, 0);
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
        invoke.define('editorSetAutoHeight', this.setAutoHeight)
    }
    async componentDidMount() {
        this.registerAPIs()
        const { placeholder, content, autoHeight } = await Native.editorMounted()
        this.setPlaceHolder(placeholder)
        this.setContent(content)
        this.setAutoHeight(autoHeight)
        this.measureEditorHeight()
    }
    render() {
        return (
            <Editor ref={(e: any) => this.editor = e}
                editorState={this.state.editorState}
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