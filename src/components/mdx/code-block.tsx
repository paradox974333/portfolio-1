import { codeToHtml } from "shiki/bundle/web";
import { CopyButton } from "./copy-button";

type CodeBlockProps = {
  code: string;
  lang?: string;
  title?: string;
};

const PLAIN = new Set(["", "text", "txt", "plaintext", "plain", "output"]);

// Display names for the header when a block has no filename.
const LABELS: Record<string, string> = {
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  javascript: "JavaScript",
  jsx: "JSX",
  json: "JSON",
  jsonc: "JSON",
  py: "Python",
  python: "Python",
  sh: "Shell",
  bash: "Shell",
  shell: "Shell",
  shellscript: "Shell",
  zsh: "Shell",
  console: "Terminal",
  cpp: "C++",
  "c++": "C++",
  c: "C",
  yaml: "YAML",
  yml: "YAML",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  md: "Markdown",
  markdown: "Markdown",
  mdx: "MDX",
};

async function highlight(code: string, lang: string) {
  if (PLAIN.has(lang)) return null;
  try {
    return await codeToHtml(code, {
      lang: lang === "console" ? "shellscript" : lang,
      themes: { light: "github-light-default", dark: "github-dark-default" },
      defaultColor: false,
    });
  } catch {
    // unknown language: fall through to plain text rather than failing the page
    return null;
  }
}

/**
 * Highlighted on the server, so the page arrives already colored and the only
 * client code is the copy button.
 */
export async function CodeBlock({ code, lang = "", title }: CodeBlockProps) {
  const source = code.replace(/\r\n?/g, "\n").replace(/\n+$/, "");
  const language = lang.toLowerCase();
  const html = await highlight(source, language);
  const label = title ?? LABELS[language] ?? (PLAIN.has(language) ? "Text" : language);

  return (
    <figure className="code-block not-prose -mx-5 my-8 overflow-hidden border-y border-border bg-panel sm:mx-0 sm:rounded-lg sm:border">
      <figcaption className="flex h-10 items-center justify-between gap-3 border-b border-border pl-5 pr-2 sm:pl-4">
        <span className="truncate font-mono text-xs text-muted-foreground">{label}</span>
        <CopyButton text={source} />
      </figcaption>
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre tabIndex={0}>
          <code>{source}</code>
        </pre>
      )}
    </figure>
  );
}
