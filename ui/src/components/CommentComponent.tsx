import { Comment } from "../types";
import formatDateTime from "../utils/time";
import InlineMarkdown from "./InlineMarkdown";
import AccountCircleIcon from "./icons/AccountCircleIcon";

interface CommentComponentProps {
  comment: Comment;
}

const CommentComponent = ({ comment }: CommentComponentProps) => {
  const date = new Date(comment.created_at);

  return (
    <div className="flex gap-1">
      <div>
        <AccountCircleIcon className="h-12 w-12" />
      </div>
      <div>
        <div className="font-semibold">
          {comment.author.username}{" "}
          <span className="text-xs text-gray-400">{formatDateTime(date)}</span>
        </div>
        <InlineMarkdown>{comment.text}</InlineMarkdown>
      </div>
    </div>
  );
};

export default CommentComponent;
