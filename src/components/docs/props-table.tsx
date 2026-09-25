import type { ComponentProp } from "@/lib/registry";

export function PropsTable({ props }: { props: ComponentProp[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-muted-foreground">
            <th className="px-4 py-2.5 font-medium">Prop</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 font-medium">Default</th>
            <th className="px-4 py-2.5 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr
              key={p.name}
              className="border-b border-border/60 last:border-0"
            >
              <td className="px-4 py-2.5 font-mono text-[13px]">{p.name}</td>
              <td className="px-4 py-2.5 font-mono text-[13px] text-muted-foreground">
                {p.type}
              </td>
              <td className="px-4 py-2.5 font-mono text-[13px] text-muted-foreground">
                {p.default}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {p.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
