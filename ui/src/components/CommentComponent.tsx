import InlineMarkdown from "./InlineMarkdown";
import { Comment } from "../types";
import { formatDateTime } from "../utils/time";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface CommentComponentProps {
  comment: Comment;
}

const CommentComponent = ({ comment }: CommentComponentProps) => {
  const date = new Date(comment.created_at);

  return (
    <div className="flex gap-1">
      <div>
        <UserCircleIcon className="h-12 w-12" />
      </div>
      <div>
        <div className="space-x-1 font-semibold">
          <span>{comment.author.username}</span>
          <span className="text-xs text-gray-400">{formatDateTime(date)}</span>
        </div>
        <InlineMarkdown>{comment.text}</InlineMarkdown>
      </div>
    </div>
  );
};

export default CommentComponent;
