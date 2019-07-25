import React from "react";
import { deleteIcon } from "./icons";

interface ITagProps {
  content: string;
  onRemove?: (value: any) => void;
}

const Tag: React.FC<ITagProps> = props => {
  const { content, onRemove } = props;
  const renderButton = () => {
    return onRemove ? (
      <img src={deleteIcon} onClick={onRemove} style={{ display: "inline" }} />
    ) : null;
  };
  return (
    <>
      <h5 style={{ display: "inline" }}>{content}</h5>
      {renderButton()}
    </>
  );
};

export default Tag;
