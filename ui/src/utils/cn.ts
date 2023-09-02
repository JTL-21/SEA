import { twMerge } from "tailwind-merge";
import clsx from "clsx";

const cn = (...input: Parameters<typeof clsx>): ReturnType<typeof twMerge> =>
  twMerge(clsx(input));

export default cn;
