import * as React from 'react'
const styles = require('./index.scss')


export default class Example extends React.Component<any, any> {
    render () {
        return (
            <div className={styles.test}>
                Test
            </div>
        )
    }
}