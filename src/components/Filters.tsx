
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Filter } from "@/store/todos";

type Props = {
  value: Filter;
  onChange: (f: Filter) => void;
};

export function Filters({ value, onChange }: Props) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as Filter)}>
      <TabsList aria-label="Filters">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
