import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SpinWheel } from "@shared/schema";
import { Trash2 } from "lucide-react";

interface WheelListProps {
  wheels: SpinWheel[];
  onSelect: (wheel: SpinWheel) => void;
  onDelete: (id: number) => void;
  selectedId?: number;
}

export function WheelList({ wheels, onSelect, onDelete, selectedId }: WheelListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Saved Wheels</h2>
      {wheels.length === 0 ? (
        <p className="text-muted-foreground">No wheels created yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wheels.map((wheel) => (
            <Card
              key={wheel.id}
              className={`cursor-pointer transition-colors hover:bg-accent ${
                selectedId === wheel.id ? "border-primary" : ""
              }`}
              onClick={() => onSelect(wheel)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">
                  {wheel.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(wheel.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {wheel.segments.length} segments
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
