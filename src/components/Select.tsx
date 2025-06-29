"use client";

import { cn } from "@/utilities/cn";
import * as S from "@radix-ui/react-select";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { forwardRef, useEffect, useId, useState } from "react";

interface ISelect extends S.SelectProps, S.SelectPortalProps {
  isLoading?: boolean;
  error?: string;
  label?: string;
  SubLabel?: React.FC<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
  >;
  className?: string;
  placeholder: string;
  placeholderClass?: string;
  triggerClass?: string;
  contentClass?: string;
  children: React.ReactNode;
}

const Select = forwardRef<HTMLDivElement, ISelect>(
  (
    {
      isLoading = false,
      error,
      label,
      className,
      placeholder,
      children,
      SubLabel,
      placeholderClass,
      contentClass,
      triggerClass,
      container,
      ...rest
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const id = useId();
    const inputAnimation = useAnimationControls();
    const errorText = useAnimationControls();

    const [doc, setDoc] = useState<Document | undefined>(undefined);
    useEffect(() => {
      if (typeof window !== "undefined") {
        setDoc(window?.document);
      }
    }, []);

    useEffect(() => {
      if (error) {
        inputAnimation.start({
          x: [-2, 0, 2, 0, -2],
          transition: { repeat: 5, duration: 0.15 },
        });

        errorText.start({
          opacity: 1,
          scale: 1,
          transition: { duration: 0.5 },
        });
      }
    }, [error]);

    return (
      <S.Root
        disabled={isLoading}
        open={open}
        onOpenChange={(v) => setOpen(v)}
        {...rest}
      >
        <motion.div
          animate={inputAnimation}
          initial={{ x: 0 }}
          className={cn(`relative flex flex-col justify-start`, className)}
        >
          {label && (
            <label
              htmlFor={id}
              className={`mb-1.5 flex items-center justify-start gap-2 text-xs font-medium sm:text-sm ${
                error ? "text-red-600" : "text-gray-800"
              }`}
            >
              <AnimatePresence initial={false}>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={errorText}
                    exit={{ opacity: 0, scale: 0 }}
                    className="rounded-full"
                  >
                    <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2c.811 0 1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 5.638-4.239 8.375-6.899 9.536C13.38 21.842 13.02 22 12 22s-1.38-.158-2.101-.473C7.239 20.365 3 17.63 3 11.991v-1.574Zm9-3.167a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V8a.75.75 0 0 1 .75-.75ZM12 16a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div className="w-full">{label}</motion.div>
            </label>
          )}
          {SubLabel && <SubLabel />}

          <SelectTrigger
            id={id}
            error={error}
            placeholder={placeholder}
            isLoading={isLoading}
            placeholderClass={placeholderClass}
            triggerClass={triggerClass}
          />
        </motion.div>

        <S.Portal
          container={container ?? doc?.getElementById("select-container")}
        >
          <S.Content
            className={cn(
              `relative z-[99999999999999999999999] rounded-xl border border-gray-800 bg-gradient-to-br from-gray-800 to-gray-950 p-1 shadow`,
              contentClass
            )}
          >
            <S.ScrollUpButton className="flex items-center justify-center py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-300"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M14.77 12.79a.75.75 0 0 1-1.06-.02L10 8.832L6.29 12.77a.75.75 0 1 1-1.08-1.04l4.25-4.5a.75.75 0 0 1 1.08 0l4.25 4.5a.75.75 0 0 1-.02 1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </S.ScrollUpButton>

            <S.Viewport>{children}</S.Viewport>

            <S.ScrollDownButton className="flex items-center justify-center py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-300"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M14.77 12.79a.75.75 0 0 1-1.06-.02L10 8.832L6.29 12.77a.75.75 0 1 1-1.08-1.04l4.25-4.5a.75.75 0 0 1 1.08 0l4.25 4.5a.75.75 0 0 1-.02 1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </S.ScrollDownButton>
            <S.Arrow />
          </S.Content>
        </S.Portal>
      </S.Root>
    );
  }
);

interface ISelectGroup extends S.SelectGroupProps {
  label?: string;
}

const SelectGroup = ({ children, label }: ISelectGroup) => {
  return (
    <S.Group>
      {label && <OptionLabel>{label}</OptionLabel>}
      <div className="flex flex-col">{children}</div>
    </S.Group>
  );
};

interface ISelectTrigger extends S.SelectTriggerProps {
  isLoading?: boolean;
  error?: string;
  placeholderClass?: string;
  triggerClass?: string;
  placeholder?: string;
}
const SelectTrigger = ({
  error,
  placeholder,
  isLoading = false,
  placeholderClass,
  triggerClass,
  ...rest
}: ISelectTrigger) => {
  const errorText = useAnimationControls();
  useEffect(() => {
    if (error) {
      errorText.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 },
      });
    }
  }, [error]);
  return (
    <div className="relative w-full">
      {isLoading && (
        <div className="absolute inset-y-0 left-0 flex items-center">
          <p className="text-xs text-gray-500 italic">loading...</p>
        </div>
      )}
      <S.Trigger
        className={cn(
          `peer w-full min-w-32 flex justify-between rounded-xl border-[1.5px] px-3 py-3 text-sm text-gray-800 transition-all duration-75 focus:outline-none focus:ring-2 focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-inherit`,
          {
            "border-red-600 focus:border-red-100 focus:ring-red-700": error,
          },
          `${isLoading ? "pl-9" : "pl-3"} `,
          triggerClass
        )}
        {...rest}
      >
        <div className={cn("truncate", placeholderClass)}>
          <S.Value placeholder={!isLoading ? placeholder : "Loading..."} />
        </div>
        <S.Icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            viewBox="0 0 20 20"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </S.Icon>
      </S.Trigger>

      {/* error text */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={errorText}
            className="absolute inset-x-0 bottom-0"
          >
            <p className="-mb-16 mt-1 w-full text-left text-xs text-red-600">
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* end of error text */}
    </div>
  );
};

interface IOption extends S.SelectItemProps {
  level?: number;
}
const Option = ({
  children,
  value,
  className,
  level = 1,
  ...rest
}: IOption) => {
  return (
    <S.Item
      value={value}
      style={{ paddingLeft: `${0.75 * level}rem` }}
      className={cn(
        `cursor-pointer rounded-lg p-3 py-[0.68rem] text-sm text-gray-200 data-[highlighted]:bg-skin-primary data-[state=checked]:font-medium data-[highlighted]:text-white data-[highlighted]:outline-none`,
        className
      )}
      {...rest}
    >
      <S.ItemText>{children}</S.ItemText>
      <S.ItemIndicator />
    </S.Item>
  );
};

interface IOptionLabel extends S.SelectLabelProps {}
const OptionLabel = ({ children, className }: IOptionLabel) => {
  return (
    <S.Label
      className={cn(
        "mb-2 mt-3 block px-3 text-sm font-semibold tracking-wide text-gray-300",
        className
      )}
    >
      {children}
    </S.Label>
  );
};

interface IDivider extends S.SelectArrowProps {}
const Divider = ({ className, children }: IDivider) => {
  return (
    <S.Separator className={cn("my-1 px-3", className)}>
      {children ? children : <div className="w-full border-t"></div>}
    </S.Separator>
  );
};

Select.displayName = "Select";
export { Select, SelectTrigger, SelectGroup, Divider, OptionLabel, Option };
