import React, { ReactNode } from "react";

type Props = {
  cb: (...args: any[]) => any;
  children: ReactNode;
};

export default function HugeButton({cb, children}: Props) {
  return (
    <button onClick={cb} className='bg-white px-6 py-2 w-40 h-20 rounded-lg'>
      {children}
    </button>
  );
}
