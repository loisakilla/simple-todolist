
import { useEffect, useMemo, useReducer } from "react";

export type Filter = "all" | "active" | "completed";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

type State = {
  items: Todo[];
  filter: Filter;
};

type Action =
  | { type: "add"; title: string }
  | { type: "toggle"; id: string }
  | { type: "remove"; id: string }
  | { type: "clearCompleted" }
  | { type: "edit"; id: string; title: string }
  | { type: "setFilter"; filter: Filter }
  | { type: "load"; state: State };

const STORAGE_KEY = "mindbox.todo.v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      const title = action.title.trim();
      if (!title) return state;
      const newTodo: Todo = { id: crypto.randomUUID(), title, completed: false };
      return { ...state, items: [newTodo, ...state.items] };
    }
    case "toggle": {
      return {
        ...state,
        items: state.items.map(t => (t.id === action.id ? { ...t, completed: !t.completed } : t)),
      };
    }
    case "remove": {
      return { ...state, items: state.items.filter(t => t.id !== action.id) };
    }
    case "clearCompleted": {
      return { ...state, items: state.items.filter(t => !t.completed) };
    }
    case "edit": {
      const title = action.title.trim();
      if (!title) {
        return { ...state, items: state.items.filter(t => t.id != action.id) };
      }
      return { ...state, items: state.items.map(t => (t.id === action.id ? { ...t, title } : t)) };
    }
    case "setFilter": {
      return { ...state, filter: action.filter };
    }
    case "load": {
      return action.state;
    }
    default:
      return state;
  }
}

export function useTodos() {
  const [state, dispatch] = useReducer(reducer, { items: [], filter: "all" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        dispatch({ type: "load", state: parsed });
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const remaining = useMemo(() => state.items.filter(t => !t.completed).length, [state.items]);
  const completed = useMemo(() => state.items.filter(t => t.completed).length, [state.items]);
  const filtered = useMemo(() => {
    switch (state.filter) {
      case "active":
        return state.items.filter(t => !t.completed);
      case "completed":
        return state.items.filter(t => t.completed);
      default:
        return state.items;
    }
  }, [state.items, state.filter]);

  return {
    state,
    filtered,
    remaining,
    completed,
    add: (title: string) => dispatch({ type: "add", title }),
    toggle: (id: string) => dispatch({ type: "toggle", id }),
    remove: (id: string) => dispatch({ type: "remove", id }),
    clearCompleted: () => dispatch({ type: "clearCompleted" }),
    edit: (id: string, title: string) => dispatch({ type: "edit", id, title }),
    setFilter: (filter: Filter) => dispatch({ type: "setFilter", filter }),
  };
}
