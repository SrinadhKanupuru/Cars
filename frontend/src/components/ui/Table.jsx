import React from 'react';
import { cn } from '../../utils/cn';

export function Table({ children, className, ...props }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <table className={cn("w-full text-left text-sm text-slate-600", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className, ...props }) {
  return (
    <thead className={cn("bg-slate-50 text-xs uppercase font-semibold text-slate-500 tracking-wider border-b border-slate-200/80", className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className, ...props }) {
  return (
    <tbody className={cn("divide-y divide-slate-100 font-normal", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, hover = true, ...props }) {
  return (
    <tr className={cn(hover && "hover:bg-slate-50/80 transition-colors", className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className, ...props }) {
  return (
    <th className={cn("px-6 py-4 font-semibold", className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ children, className, ...props }) {
  return (
    <td className={cn("px-6 py-4 align-middle whitespace-nowrap", className)} {...props}>
      {children}
    </td>
  );
}
