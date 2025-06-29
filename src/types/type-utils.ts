import React from "react";
import { MotionProps } from "framer-motion";
import type { ComponentProps, JSXElementConstructor } from "react";

type IntrinsicElements = JSX.IntrinsicElements;
type ElementConstructor<T> = JSXElementConstructor<T>;
// Custom component props including HTML attributes and custom props
type CustomComponentProps<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
  CustomProps = {}
> = React.HTMLProps<T> & CustomProps;

// Component that accepts HTML attributes and custom props
export type CustomSlottedComponent<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
  CustomProps = {}
> = React.FC<CustomComponentProps<T, CustomProps>>;

// Motion component that includes both HTML attributes and motion props & custom props
export type MotionComponent<
  T extends keyof IntrinsicElements | ElementConstructor<any>,
  CustomProps = {}
> = ComponentProps<T> & MotionProps & CustomProps;
