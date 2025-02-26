import { cn } from "@/lib/utils";

interface StepsProps {
  steps: string[];
  currentStep: number;
}

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="relative">
            <div
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full border-2",
                currentStep === index
                  ? "border-primary bg-primary text-primary-foreground"
                  : currentStep > index
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground text-muted-foreground"
              )}
            >
              {currentStep > index ? "✓" : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-1/2 w-full h-[2px]",
                  currentStep > index
                    ? "bg-primary"
                    : "bg-muted-foreground"
                )}
              />
            )}
          </div>
          <span
            className={cn(
              "ml-2 text-sm",
              currentStep === index
                ? "text-primary font-medium"
                : "text-muted-foreground"
            )}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}