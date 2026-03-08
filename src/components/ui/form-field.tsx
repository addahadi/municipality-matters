import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}

const FormFieldWrapper = ({ label, error, children, className, required }: FormFieldProps) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className={cn("text-sm font-medium", error && "text-destructive")}>
        {label}
        {required && <span className="text-destructive ms-0.5">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs font-medium text-destructive animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormFieldWrapper;
