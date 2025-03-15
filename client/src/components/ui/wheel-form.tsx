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
import { generateColors } from "@/lib/wheel-utils";

interface WheelFormProps {
  onSubmit: (data: { name: string; segments: string[]; colors: string[] }) => void;
}

export function WheelForm({ onSubmit }: WheelFormProps) {
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
    const segments = values.segments;
    const colors = generateColors(segments.length);
    onSubmit({ ...values, colors });
  });

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

        <FormField
          control={form.control}
          name="segments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Segments (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Pizza, Burger, Sushi, Tacos"
                  {...field}
                  value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Wheel</Button>
      </form>
    </Form>
  );
}
