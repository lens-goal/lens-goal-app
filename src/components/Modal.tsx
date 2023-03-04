import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Modal({ children }: Props) {
  return (
    <div className="absolute top-50 left-50 traabsolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-xl bg-white">
      {children}
    </div>
  );
}
