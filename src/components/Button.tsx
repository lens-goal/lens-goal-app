import React from "react";

type Props = {
  cb: (...args: any[]) => any;
  text: string
};

export default function Button({cb, text}: Props) {
  return (
    <button onClick={cb} className='bg-emerald-800 text-white px-6 py-2 rounded-full'>
      {text}
    </button>
  );
}
