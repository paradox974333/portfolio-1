import { DATA } from "@/data/resume";

export function StackTable() {
  return (
    <dl>
      {DATA.stack.map((group) => (
        <div
          key={group.label}
          className="grid gap-x-6 gap-y-2.5 border-b border-border px-5 py-3.5 last:border-b-0 sm:grid-cols-[9.5rem_1fr] sm:px-8"
        >
          <dt className="pt-1 text-sm text-muted-foreground">{group.label}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <span
                key={item.name}
                className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-panel px-2 text-[0.8125rem] text-foreground"
              >
                <item.icon className="size-3.5 flex-none" />
                {item.name}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
