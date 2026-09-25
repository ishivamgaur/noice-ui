"use client";

import * as React from "react";
import { TaskList } from "../../../registry/ui/task-list";
import type { TaskItemData } from "../../../registry/ui/task-list";

const INITIAL: TaskItemData[] = [
  { id: "a", label: "Copy the install command" },
  { id: "b", label: "Paste it into your app" },
  { id: "c", label: "Edit the source freely" },
];

export function TaskListDemo() {
  return <TaskList defaultTasks={INITIAL} className="w-full max-w-72" />;
}
