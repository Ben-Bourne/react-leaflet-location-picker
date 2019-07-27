import React from "react";
import { deleteIcon } from "./icons";
import "./styles.css";

export interface ITagProps {
  content: string;
  onRemove?: (value: any) => void;
}

const Tag: React.FC<ITagProps> = props => {
  const { content, onRemove } = props;
  const renderButton = () => {
    return onRemove ? (
      <img src={deleteIcon} onClick={onRemove} className="full-height" />
    ) : null;
  };
  return (
    <div className="flex-container map-tag">
      <h5 className="full-height no-margin text">{content}</h5>
      {renderButton()}
    </div>
  );
};

export default Tag;
