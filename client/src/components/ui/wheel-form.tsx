import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWheelSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { generateWheelOptions } from "@/lib/wheel-utils";
import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WheelFormProps {
  onSubmit: (data: { name: string; segments: string[]; colors: string[] }) => void;
}

export function WheelForm({ onSubmit }: WheelFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(
      insertWheelSchema.extend({
        segments: insertWheelSchema.shape.segments.transform((val) =>
          typeof val === "string" ? val.split(",").map((s) => s.trim()) : val
        ),
      })
    ),
    defaultValues: {
      name: "",
      segments: [],
      colors: [],
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    const segments = Array.isArray(values.segments)
      ? values.segments
      : values.segments.split(",").map((s) => s.trim());

    // Generate vibrant colors for segments
    const colors = segments.map((_, i) =>
      `hsl(${(360 / segments.length) * i}, 85%, 55%)`
    );

    onSubmit({
      ...values,
      segments,
      colors,
    });
  });

  const handleAIGenerate = async () => {
    try {
      setIsGenerating(true);
      const prompt = form.getValues("name");
      if (!prompt) {
        toast({
          title: "Name required",
          description: "Please enter a wheel name to generate options",
          variant: "destructive",
        });
        return;
      }

      const options = await generateWheelOptions(prompt);
      form.setValue("segments", options.join(", "));

      toast({
        title: "Options generated!",
        description: "AI has generated options based on your wheel name",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate options. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wheel Name</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Wheel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleAIGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            Generate Options with AI
          </Button>

          <FormField
            control={form.control}
            name="segments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Segments (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Pizza, Burger, Sushi"
                    {...field}
                    value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">Create Wheel</Button>
      </form>
    </Form>
  );
}