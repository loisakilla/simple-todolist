import { useRef, useState } from "react";
import {Input} from "./components/ui/input";
import {useTodos} from "./store/todos";
import {Button} from "./components/ui/button";
import {TodoItem} from "./components/TodoItem";
import {Filters} from "./components/Filters";
import {Footer} from "./components/Footer";
import {FlowAnimator, FlowAnimatorHandle} from "./components/FlowAnimator";

export default function App() {
  const { state, filtered, remaining, completed, add, toggle, remove, edit, setFilter, clearCompleted } = useTodos();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const animatorRef = useRef<FlowAnimatorHandle>(null);

  function playAddAnimation(label: string) {
    const inputEl = inputRef.current;
    const listEl = listRef.current;
    if (!inputEl || !listEl) return;
    const from = inputEl.getBoundingClientRect();
    const listRect = listEl.getBoundingClientRect();
    const to = { left: listRect.left + 16, top: listRect.top + 8, width: 0, height: 0 };
    animatorRef.current?.fly(label, { left: from.left, top: from.top, width: from.width, height: from.height }, to);
  }

  function submit() {
    const title = text.trim();
    if (title) {
      playAddAnimation(title);
      add(title);
      setText("");
    }
  }

  return (
    <main className="container py-10">
      <h1 className="mb-6 text-center text-6xl font-thin text-muted-foreground tracking-tight">todos</h1>

      <section className="card max-w-2xl mx-auto">
        <header className="flex items-center gap-3 p-4 border-b">
          <Input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            aria-label="What needs to be done?"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <Button onClick={submit} aria-label="Add todo" className="shrink-0">
            Add
          </Button>
        </header>

        <ul ref={listRef} role="list" aria-label="Todo list">
          {filtered.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggle} onDelete={remove} onEdit={edit} />
          ))}
          {filtered.length === 0 && (
            <li className="p-6 text-center text-muted-foreground">Nothing here yet</li>
          )}
        </ul>

        <footer className="flex items-center gap-4 p-4 border-t">
          <Filters value={state.filter} onChange={setFilter} />
          <div className="flex-1" />
          <Footer remaining={remaining} completed={completed} onClearCompleted={clearCompleted} />
        </footer>
      </section>

      <FlowAnimator ref={animatorRef} />
    </main>
  );
}
