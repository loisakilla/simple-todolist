
import { Button } from "@/components/ui/button";

type Props = {
  remaining: number;
  completed: number;
  onClearCompleted: () => void;
};

export function Footer({ remaining, completed, onClearCompleted }: Props) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
      <span data-testid="left-count">
        {remaining} {remaining === 1 ? "item" : "items"} left
      </span>
      <div className="flex-1" />
      <Button
        variant="ghost"
        onClick={onClearCompleted}
        disabled={completed === 0}
        aria-label="Clear completed"
      >
        Clear completed
      </Button>
    </div>
  );
}
