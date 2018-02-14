// @flow
/* eslint-disable import/no-extraneous-dependencies */

import React, { Component, type Node as ReactNode } from 'react';
import { type Value, type Change, type Node } from 'slate';
import { Editor } from 'slate-react';

import createMentionPlugin from '../lib/';

type NodeProps = {
    node: Node,
    attributes: Object,
    children: ReactNode
};
function renderNode(props: NodeProps): ReactNode {
    const { node, attributes, children } = props;
    switch (node.type) {
        case 'paragraph':
            return <p {...attributes}>{children}</p>;
        default:
            return null;
    }
}

type Props = {
    mentions: Array<{ name: string }>,
    beforeMatchRegex: RegExp,
    afterMatchRegex: RegExp,
    beforeFormatMatcherRegex: RegExp,
    afterFormatMatcherRegex: RegExp,
    value: Value
};
type Portals = {
    MentionMenu: (*) => ReactNode
};

class SlateEditor extends Component<Props, { value: Value }> {
    plugins: Array<*>;
    portals: Portals;
    submitChange: Change => *;
    editorREF: Editor;

    constructor(props: Props) {
        super(props);
        const {
            mentions,
            beforeMatchRegex,
            afterMatchRegex,
            beforeFormatMatcherRegex,
            afterFormatMatcherRegex,
            value
        } = props;
        const mentionPlugin = createMentionPlugin({
            mentions,
            beforeMatchRegex,
            afterMatchRegex,
            beforeFormatMatcherRegex,
            afterFormatMatcherRegex
        });
        this.plugins = [mentionPlugin];
        this.portals = { ...mentionPlugin.portals };
        this.submitChange = x => undefined;
        this.state = { value };
    }
    setEditorComponent = (ref: Editor) => {
        this.editorREF = ref;
        this.submitChange = ref.change;
    };

    onChange = ({ value }: { value: Value }) => {
        this.setState({
            value
        });
    };

    render() {
        const { value } = this.state;
        const { plugins, submitChange } = this;
        const { MentionMenu } = this.portals;
        return (
            <div>
                <Editor
                    ref={this.setEditorComponent}
                    placeholder={'Enter some text...'}
                    renderNode={renderNode}
                    plugins={plugins}
                    value={value}
                    onChange={this.onChange}
                />
                <MentionMenu value={value} submitChange={submitChange} />
            </div>
        );
    }
}

export default SlateEditor;
