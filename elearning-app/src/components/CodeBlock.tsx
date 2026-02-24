'use client'

import { useEffect, useRef } from 'react'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'

hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)

interface CodeBlockProps {
    code: string
}

export default function CodeBlock({ code }: CodeBlockProps) {
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        // Reset so hljs can re-highlight when code changes (slide navigation)
        el.removeAttribute('data-highlighted')
        el.textContent = code
        hljs.highlightElement(el)
    }, [code])

    return <code ref={ref} />
}
