import { useEffect, useRef } from 'react';
import rehypeIgnore from 'rehype-ignore';
import MDEditor from '@uiw/react-md-editor';
import CodeLayout from 'react-code-preview-layout';
import { CodeComponent, ReactMarkdownNames } from 'react-markdown/lib/ast-to-react';
import { getMetaId, isMeta, getURLParameters } from 'markdown-react-code-preview-loader';

const CodePreview: CodeComponent | ReactMarkdownNames = ({ inline, node, ...props }) => {
    const $dom = useRef<HTMLDivElement>(null);
    const { 'data-meta': meta, ...rest } = props as any;

    useEffect(() => {
        if ($dom.current) {
            const parentElement = $dom.current.parentElement;
            if (parentElement && parentElement.parentElement) {
                parentElement.parentElement.replaceChild($dom.current, parentElement);
            }
        }
    }, [$dom]);

    if (inline || !isMeta(meta)) {
        return <code {...props} />;
    }
    const line = node.position?.start.line;
    const metaId = getMetaId(meta) || String(line);
    if (metaId) {
        const param = getURLParameters(meta);
        return (
            <CodeLayout
                ref={$dom}
                style={{ marginBottom: 10 }}
                toolbar={param.title || 'Example'}
                code={<pre {...rest} />}
                text={``}
            >
            </CodeLayout>
        );
    }
    return <code {...rest} />;
};

const PdfPreview = (props: { source: string }) => {
    return (
        <div id='pdf' data-color-mode='light' style={{ marginBottom: '80px' }}>
            <MDEditor.Markdown
                style={{ paddingTop: 0 }}
                disableCopy={true}
                rehypePlugins={[rehypeIgnore]}
                source={props.source || ``}
                components={{
                    code: CodePreview,
                }}
            />
        </div>
    );
}

export default PdfPreview;