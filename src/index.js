import * as fs from 'node:fs/promises';
import { parseArgs } from 'node:util';
import rehypeDocument from 'rehype-document';
import rehypeFormat from 'rehype-format';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import rehypeMathjax from 'rehype-mathjax';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { read } from 'to-vfile';

const { values, positionals } = parseArgs({
  options: {
    file: {
      type: 'string',
      short: 'f',
    },
  },
});
const inputFileName = values['file'];

const contentNoMath = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeDocument, {
    language: 'ja',
    title: 'No remark-math',
  })
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(await read(inputFileName));

const contentSimpleMath = await unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeDocument, {
    language: 'ja',
    title: 'remark-math only',
  })
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(await read(inputFileName));

const contentKatex = await unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeDocument, {
    language: 'ja',
    title: 'KaTeX',
    css: 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css',
  })
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(await read(inputFileName));

const contentKatexNG = await unified()
  .use(remarkParse)
  // .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeDocument, {
    language: 'ja',
    title: 'KaTeX(no remark-math)',
    css: 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css',
  })
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(await read(inputFileName));

const contentMathjax = await unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeMathjax)
  .use(rehypeDocument, {
    language: 'ja',
    title: 'MathJax',
  })
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(await read(inputFileName));

fs.writeFile('html/no-math.html', String(contentNoMath));
fs.writeFile('html/simple-math.html', String(contentSimpleMath));
fs.writeFile('html/katex.html', String(contentKatex));
fs.writeFile('html/katex-ng.html', String(contentKatexNG));
fs.writeFile('html/mathjax.html', String(contentMathjax));
