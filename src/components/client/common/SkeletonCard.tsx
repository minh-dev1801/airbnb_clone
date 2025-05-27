import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  width?: string; 
  height?: string; 
  shape?: "circle" | "rounded" | "rounded-2xl" | "rounded-lg"; 
  count?: number; 
  layout?: "vertical" | "horizontal" | "grid"; 
  className?: string; 
}

export function SkeletonCard({
  width = "w-full",
  height = "h-40",
  shape = "rounded",
  count = 1,
  layout = "vertical",
  className,
}: SkeletonCardProps) {
  const skeletons = Array(count).fill(0);
  

  const getShapeClass = () => {
    switch (shape) {
      case "circle":
        return "rounded-full";
      case "rounded-2xl":
        return "rounded-2xl";
      case "rounded-lg":
        return "rounded-lg";
      default:
        return "rounded-none";
    }
  };

  const getLayoutClass = () => {
    switch (layout) {
      case "horizontal":
        return "flex flex-row gap-4";
      case "grid":
        return "grid grid-cols-2 md:grid-cols-3 gap-4";
      default:
        return "flex flex-col gap-4";
    }
  };

  return (
    <div className={cn(getLayoutClass(), className)}>
      {skeletons.map((_, index) => (
        <Skeleton
          key={index}
          className={cn(width, height, getShapeClass(), "dark:bg-gray-800 bg-gray-100")}
        />
      ))}
    </div>
  );
}
