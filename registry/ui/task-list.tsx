"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface TaskItemData {
  id: string;
  label: string;
  done?: boolean;
}

export interface TaskListProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, "onChange"> {
  tasks?: TaskItemData[];
  defaultTasks?: TaskItemData[];
  onTasksChange?: (tasks: TaskItemData[]) => void;
}

/**
 * Checklist where checking a row draws the tick, then sweeps a strike
 * across the label. Done rows sink below open ones so the eye lands on
 * what is still outstanding. The strike and nudge are CSS transitions on
 * a data attribute, so no timers can desync on a rapid toggle.
 */
export function TaskList({
  tasks,
  defaultTasks = [],
  onTasksChange,
  className,
  ...props
}: TaskListProps) {
  const reduce = useReducedMotion();
  const [inner, setInner] = React.useState<TaskItemData[]>(defaultTasks);
  const list = tasks ?? inner;
  const [announce, setAnnounce] = React.useState("");

  const toggle = (id: string, done: boolean) => {
    const next = list.map((t) => (t.id === id ? { ...t, done } : t));
    if (tasks === undefined) setInner(next);
    onTasksChange?.(next);
    const label = next.find((t) => t.id === id)?.label ?? "";
    setAnnounce(`${label} ${done ? "completed" : "reopened"}`);
  };

  const ordered = [
    ...list.filter((t) => !t.done),
    ...list.filter((t) => t.done),
  ];

  return (
    <>
      <motion.ul
        layout={!reduce}
        className={cn("flex w-full flex-col gap-1", className)}
        {...(props as React.ComponentProps<typeof motion.ul>)}
      >
        {ordered.map((task) => (
          <TaskRow key={task.id} task={task} reduce={reduce} onToggle={toggle} />
        ))}
      </motion.ul>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </>
  );
}

function TaskRow({
  task,
  reduce,
  onToggle,
}: {
  task: TaskItemData;
  reduce: boolean | null;
  onToggle: (id: string, done: boolean) => void;
}) {
  const done = Boolean(task.done);
  return (
    <motion.li layout={!reduce}>
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        data-done={done || undefined}
        onClick={() => onToggle(task.id, !done)}
        className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left outline-none transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-1"
      >
        <span
          className={cn(
            "grid size-5 shrink-0 place-items-center rounded-md border transition-colors duration-200",
            done ? "border-brand bg-brand" : "border-muted-foreground/40"
          )}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className={cn(
              "size-3.5 text-brand-foreground transition-[opacity,transform] duration-200",
              done ? "scale-100 opacity-100" : "scale-75 opacity-0"
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12.5 4 4L19 7" />
          </svg>
        </span>

        <span className="relative flex-1 text-sm">
          <span
            className={cn(
              "transition-colors duration-200",
              done && "text-muted-foreground"
            )}
          >
            {task.label}
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-0 h-px w-full origin-left -translate-y-1/2 scale-x-0 bg-muted-foreground/60 transition-transform duration-300 ease-out group-data-[done]:scale-x-100"
          />
        </span>
      </button>
    </motion.li>
  );
}
