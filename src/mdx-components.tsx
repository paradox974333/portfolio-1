/* eslint-disable @next/next/no-img-element */
import { CodeBlock } from "@/components/mdx/code-block";
import { Heading } from "@/components/mdx/heading";
import { MediaContainer } from "@/components/mdx/media-container";
import { isValidElement, type ComponentProps, type ReactNode } from "react";

type FencedCodeProps = {
  className?: string;
  children?: ReactNode;
  "data-title"?: string;
};

// A fenced block arrives as <pre><code className="language-ts" data-title="…">text</code></pre>.
function Pre({ children, ...props }: ComponentProps<"pre">) {
  if (!isValidElement<FencedCodeProps>(children) || typeof children.props.children !== "string") {
    return <pre {...props}>{children}</pre>;
  }
  const { className, children: code, "data-title": title } = children.props;
  const lang = className?.match(/language-([\w+#-]+)/)?.[1];
  return <CodeBlock code={code} lang={lang} title={title} />;
}

export const mdxComponents = {
  MediaContainer,
  pre: Pre,
  h2: (props: ComponentProps<"h2">) => <Heading as="h2" {...props} />,
  h3: (props: ComponentProps<"h3">) => <Heading as="h3" {...props} />,
  h4: (props: ComponentProps<"h4">) => <Heading as="h4" {...props} />,
  // a full-bleed hairline, the same rule that separates rows everywhere else
  hr: () => <hr className="-mx-5 border-border sm:-mx-8" />,
  table: (props: ComponentProps<"table">) => (
    <div className="table-wrap not-prose my-8 overflow-x-auto rounded-lg border border-border" tabIndex={0}>
      <table {...props} />
    </div>
  ),
  img: ({ alt = "", ...props }: ComponentProps<"img">) => (
    <img alt={alt} loading="lazy" decoding="async" {...props} />
  ),
} as const;
