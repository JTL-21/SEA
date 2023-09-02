import React from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

interface LinkButtonProps extends React.ComponentProps<typeof Button> {
  to: string;
}

const LinkButton = ({ to, onClick, ...buttonProps }: LinkButtonProps) => {
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigate(to);
    onClick && onClick(event);
  };

  return <Button {...buttonProps} onClick={handleClick} />;
};

export default LinkButton;
