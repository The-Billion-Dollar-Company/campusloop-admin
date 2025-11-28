import type { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const BaseSection = ({ children }: IProps) => {
  return (
    <div className="container mx-auto px-4">
      {children}
    </div>
  );
};

export default BaseSection;
