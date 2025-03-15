import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SpinWheel } from "@/components/ui/spin-wheel";
import { WheelForm } from "@/components/ui/wheel-form";
import { WheelList } from "@/components/ui/wheel-list";
import { Plus } from "lucide-react";
import type { InsertWheel, SpinWheel as SpinWheelType } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedWheel, setSelectedWheel] = useState<SpinWheelType | null>(null);
  const { toast } = useToast();

  const { data: wheels = [] } = useQuery<SpinWheelType[]>({
    queryKey: ["/api/wheels"],
  });

  const createWheel = useMutation({
    mutationFn: async (wheelData: InsertWheel) => {
      const res = await apiRequest("POST", "/api/wheels", wheelData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wheels"] });
      toast({
        title: "Success",
        description: "Wheel created successfully!",
      });
    },
  });

  const deleteWheel = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/wheels/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wheels"] });
      if (selectedWheel?.id === deleteWheel.variables?.id) { //Corrected potential error here
        setSelectedWheel(null);
      }
      toast({
        title: "Success",
        description: "Wheel deleted successfully!",
      });
    },
  });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Spin Wheel Creator
        </h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Wheel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Wheel</DialogTitle>
            </DialogHeader>
            <WheelForm onSubmit={(data) => {
              createWheel.mutate(data);
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <WheelList
            wheels={wheels}
            selectedId={selectedWheel?.id}
            onSelect={setSelectedWheel}
            onDelete={(id) => deleteWheel.mutate(id)}
          />
        </div>

        <div className="order-1 lg:order-2">
          {selectedWheel ? (
            <SpinWheel
              segments={selectedWheel.segments}
              colors={selectedWheel.colors}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">
                Select a wheel from the list or create a new one to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}