import { isValidElement, type ComponentProps, type ReactNode } from "react";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}

type HeadingProps = ComponentProps<"h2"> & { as: "h2" | "h3" | "h4" };

/** Section heading with a "#" link that appears on hover or keyboard focus. */
export function Heading({ as: Tag, children, id, ...props }: HeadingProps) {
  const text = textOf(children);
  const anchor = id ?? slugify(text);

  return (
    <Tag id={anchor} className="group/heading scroll-mt-20" {...props}>
      {children}
      {anchor && (
        <a
          href={`#${anchor}`}
          aria-label={`Link to section: ${text}`}
          className="heading-anchor ml-2 inline-block rounded-sm px-0.5 font-normal text-muted-foreground no-underline opacity-0 transition-opacity group-hover/heading:opacity-100 focus-visible:opacity-100"
        >
          #
        </a>
      )}
    </Tag>
  );
}
