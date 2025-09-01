
import { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Todo } from "@/store/todos";
import { Pencil, X } from "lucide-react";

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
};

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function commit() {
    if (value !== todo.title) onEdit(todo.id, value);
    setEditing(false);
  }

  return (
    <li className="group flex items-center gap-3 px-3 py-2 border-b last:border-b-0" aria-label={`todo-${todo.title}`}>
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={todo.completed ? "Mark as active" : "Mark as completed"}
      />
      {!editing ? (
        <span className={`flex-1 text-left ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
          {todo.title}
        </span>
      ) : (
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") { setValue(todo.title); setEditing(false); }
          }}
          aria-label="Edit todo"
        />
      )}
      {!editing && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Edit ${todo.title}`}
          onClick={() => setEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Delete ${todo.title}`}
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </Button>
    </li>
  );
}
