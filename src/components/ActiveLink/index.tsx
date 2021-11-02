import React, { cloneElement, ReactElement } from "react";
import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";

interface ActiveLinkProps extends LinkProps {
  activeClassName: string;
  children: ReactElement;
}

const ActiveLink: React.FC<ActiveLinkProps> = ({
  children,
  activeClassName,
  ...rest
}) => {
  const { asPath } = useRouter();

  const className = asPath === rest.href ? activeClassName : "";
  return (
    <Link {...rest}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
};

export default ActiveLink;
