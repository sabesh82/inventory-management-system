import { cn } from "@/utilities/cn";
import { ComponentProps } from "react";

interface ITable extends ComponentProps<"table"> {
  wrapperClass?: string;
}

const Table = ({ children, className, wrapperClass, ...rest }: ITable) => {
  return (
    <div
      className={cn(
        `scrollbar relative max-h-96 overflow-auto rounded-xl border border-gray-300 shadow-md`,
        wrapperClass
      )}
    >
      <table
        className={cn(`table-fixed overflow-y-auto rounded-xl`, className)}
        {...rest}
      >
        {children}
      </table>
    </div>
  );
};

interface IThead extends ComponentProps<"thead"> {}

const Thead = ({ children, className, ...rest }: IThead) => {
  return (
    <thead
      className={cn(
        `sticky top-0 z-10 w-full border-b bg-red-800 text-left text-sm font-medium text-white`,
        className
      )}
      {...rest}
    >
      {children}
    </thead>
  );
};

interface ITbody extends ComponentProps<"tbody"> {}

const Tbody = ({ children, className, ...rest }: ITbody) => {
  return (
    <tbody
      className={cn(
        `divide-y overflow-y-auto text-sm text-gray-800`,
        className
      )}
      {...rest}
    >
      {children}
    </tbody>
  );
};

interface ITr extends ComponentProps<"tr"> {}

const Tr = ({ children, className, ...rest }: ITr) => {
  return (
    <tr className={cn(``, className)} {...rest}>
      {children}
    </tr>
  );
};

interface ITh extends ComponentProps<"th"> {}

const Th = ({ children, className, ...rest }: ITh) => {
  return (
    <th
      className={cn(`whitespace-nowrap bg-gray-800 px-6 py-3`, className)}
      {...rest}
    >
      {children}
    </th>
  );
};

interface ITd extends ComponentProps<"td"> {}

const Td = ({ children, className, ...rest }: ITd) => {
  return (
    <td className={cn(`px-6 py-3 align-middle`, className)} {...rest}>
      {children}
    </td>
  );
};

export default Object.assign(Table, {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
});
