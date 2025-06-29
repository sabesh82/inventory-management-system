"use client";
import { cn } from "@/utilities/cn";
import { VariantProps, cva } from "class-variance-authority";
import {
  AnimationDefinition,
  motion,
  useAnimationControls,
} from "framer-motion";
import { forwardRef } from "react";
import { Button as Btn, ButtonProps, PressEvent } from "react-aria-components";

// Button style variants
const variants = {
  variant: {
    primary: "btn-primary",
    secondary: "btn-secondary",
    unstyled: "btn-unstyled",
    danger: "btn-danger",
    ghost: "btn-ghost p-0 md:p-0",
  },
};

const defaultStyles =
  "touch-none select-none overflow-hidden disabled:cursor-not-allowed rounded-xl bg-skin-btn-bg px-7 py-4 text-sm font-medium text-skin-btn-text outline-none ring-skin-btn-ring ring-offset-2 ring-offset-inherit hover:bg-skin-btn-bg-hover focus:outline-none disabled:bg-skin-btn-disabled data-[pressed]:bg-skin-btn-active data-[focus-visible]:ring-2 md:px-5 md:py-3";

export const ButtonVariants = cva(defaultStyles, {
  variants,
  defaultVariants: {
    variant: "primary",
  },
});

export interface IButton
  extends ButtonProps,
    VariantProps<typeof ButtonVariants> {
  children: React.ReactNode;
  onClick?: (e: PressEvent) => void;
  isLoading?: boolean;
  disabled?: boolean;
  wrapperClass?: string;
}

const Button = forwardRef<HTMLButtonElement, IButton>(
  (
    {
      variant,
      disabled,
      onClick,
      className,
      children,
      isLoading = false,
      wrapperClass,
      ...props
    },
    ref
  ) => {
    const control = useAnimationControls();

    const enterAnimation: AnimationDefinition = {
      scale: 0.97,
    };

    const leaveAnimation: AnimationDefinition = {
      scale: 1,
      transition: { duration: 0.4 },
    };

    const handleClick = (e: PressEvent) => {
      if (!isLoading && onClick) {
        onClick(e); // Prevent click if loading
      }
    };

    return (
      <motion.div animate={control} className={cn("w-min", wrapperClass)}>
        <Btn
          ref={ref}
          onPressStart={() => {
            if (!isLoading) {
              control.stop();
              control.start(enterAnimation);
            }
          }}
          onPressEnd={() => {
            if (!isLoading) {
              control.start(leaveAnimation);
            }
          }}
          onPress={handleClick}
          isDisabled={disabled || isLoading}
          className={cn(ButtonVariants({ variant, className }))}
          {...props}
          aria-disabled={disabled || isLoading}
        >
          {children}
        </Btn>
      </motion.div>
    );
  }
);

Button.displayName = "Button";
export default Button;
