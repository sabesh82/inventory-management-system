"use client";

import { CustomSlottedComponent } from "@/types/type-utils";
import { cn } from "@/utilities/cn";
import { motion, useAnimationControls } from "framer-motion";
import { ComponentProps, forwardRef, useEffect, useId } from "react";
import {
  Input as AriaInput,
  Label as AriaLabel,
  Text,
} from "react-aria-components";
import { IoWarning } from "react-icons/io5";

// Define props for the Input component
interface IInput extends ComponentProps<typeof AriaInput> {
  Label?: string | CustomSlottedComponent<"label">;
  Icon?: CustomSlottedComponent<"svg">;
  ErrorIcon?: CustomSlottedComponent<"svg">;
  AbsoluteContainer?: CustomSlottedComponent<"div">;
  error?: string;
  hideError?: boolean;
  description?: string;
  placeholder?: string;
  inputClass?: string;
  labelClass?: string;
  descriptionClass?: string;
  errorClass?: string;
}

const Input = forwardRef<HTMLInputElement, IInput>(
  (
    {
      Label,
      ErrorIcon,
      Icon,
      placeholder = "Enter text",
      description,
      error,
      hideError = false,
      AbsoluteContainer,
      inputClass,
      labelClass,
      descriptionClass,
      errorClass,
      className,
      ...rest
    },
    ref
  ) => {
    const id = useId();
    const errorAnimationControls = useAnimationControls();

    // Function to control error animations
    useEffect(() => {
      let isMounted = false; // Start as false to ensure component is not yet mounted

      // Using a setTimeout to delay the animation trigger until after mount
      const triggerErrorAnimation = async () => {
        if (error) {
          // Ensure this only runs after the component has mounted
          setTimeout(async () => {
            if (isMounted) {
              await errorAnimationControls.start("error");
              await errorAnimationControls.start("vibrate");
            }
          }, 5); // Timeout with 0 ensures that this runs in the next tick, after mount
        } else {
          errorAnimationControls.start("no_error");
        }
      };

      // Set mounted flag after the first effect execution
      isMounted = true;
      triggerErrorAnimation();

      // Clean up by setting isMounted to false on component unmount
      return () => {
        isMounted = false;
      };
    }, [error, errorAnimationControls]); // Only run this effect when error changes

    return (
      <div
        aria-labelledby={typeof Label === "string" ? Label : ""}
        className={cn(className)}
      >
        {/* Label and error icon */}
        {Label && (
          <AriaLabel
            className={cn(
              "flex w-max items-center justify-start gap-1 text-gray-800 text-sm font-medium transition-colors duration-150",
              { "text-red-700": error },
              labelClass,
              { "mb-1.5": !description }
            )}
          >
            <motion.div
              animate={errorAnimationControls}
              initial="no_error"
              variants={{
                no_error: {
                  width: 0,
                  opacity: 0,
                  filter: `blur(4px)`,
                  scale: 0.5,
                },
                error: {
                  width: "1.25rem",
                  opacity: 1,
                  filter: `blur(0px)`,
                  scale: 1,
                },
              }}
            >
              {ErrorIcon ? (
                <ErrorIcon data-testid="error-icon-svg" />
              ) : (
                <IoWarning data-testid="error-icon-svg" className="size-5" />
              )}
            </motion.div>
            {typeof Label === "function" ? <Label /> : Label}
          </AriaLabel>
        )}

        {description && (
          <Text
            id={`${id}-description`}
            className={cn(
              "mb-1.5 mt-0.5 block pl-1 text-xs text-gray-600",
              descriptionClass
            )}
            slot="description"
          >
            {description}
          </Text>
        )}

        {/* Input with error animation and Icon */}
        <motion.div
          animate={errorAnimationControls}
          variants={{
            vibrate: {
              x: [0, -3, 0, 3, 0],
              transition: {
                duration: 0.15,
                repeat: 3,
              },
            },
          }}
          className="relative"
        >
          <div className="relative w-full">
            <AriaInput
              ref={ref}
              placeholder={placeholder}
              className={cn(
                "peer w-full rounded-xl border-[1.5px] px-3 py-3 text-sm text-gray-800 transition-all duration-75 focus:outline-none focus:ring-2 focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-inherit",
                {
                  "border-red-600 focus:border-red-100 focus:ring-red-700":
                    error,
                },
                Icon && "pl-10",
                inputClass
              )}
              aria-invalid={!!error}
              aria-describedby={description ? `${id}-description` : undefined}
              {...rest}
            />

            {/* Input icon */}
            {Icon && (
              <span
                data-testid="input-icon-svg"
                className={cn(
                  "absolute inset-y-0 left-0 flex items-center justify-center p-3 text-gray-500 peer-focus:text-skin-primary",
                  { "text-red-700 peer-focus:text-red-700": error }
                )}
              >
                <Icon />
              </span>
            )}

            {AbsoluteContainer && <AbsoluteContainer />}
          </div>

          {/* Description and Error message */}
          <div className="mt-1 h-3">
            {error && !hideError && (
              <Text
                id={`${id}-error`}
                slot="errorMessage"
                className={cn("block text-xs text-red-700", errorClass)}
              >
                {error}
              </Text>
            )}
          </div>
        </motion.div>
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
