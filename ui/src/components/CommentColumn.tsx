import React from "react";
import { Comment, CreateCommentBody, Ticket } from "../types";
import CommentComponent from "./CommentComponent";
import { useForm } from "react-hook-form";
import API from "../api";
import Button from "./Button";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface Props {
  ticket: Ticket;
}

const CommentColumn = ({ ticket }: Props) => {
  const id = React.useId();
  const [comments, setComments] = React.useState<Comment[]>([]);

  React.useEffect(() => {
    API.getTicketComments(ticket.slug).then((response) => {
      if (response.ok) {
        setComments(response.data);
      }
    });
  }, [ticket]);

  const [formError, setFormError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCommentBody>();

  const onSubmit = (state: CreateCommentBody) => {
    setFormError(null);
    API.createComment(ticket.slug, state).then((response) => {
      if (response.ok) {
        setComments((old) => [...old, response.data]);
      } else {
        setFormError(response.error.message);
      }
    });
  };

  return (
    <>
      <ul className="ml-4 flex flex-grow flex-col gap-2 overflow-y-scroll py-1 pr-4">
        {comments.map((comment) => (
          <li key={comment.id}>
            <CommentComponent comment={comment} />
          </li>
        ))}
        {comments.length === 0 && (
          <span className="text-sm text-gray-400">No comments to show...</span>
        )}
      </ul>
      <form onSubmit={handleSubmit(onSubmit)} className="border-t-[1px] p-2">
        <div className="flex gap-2">
          <textarea
            {...register("text", {
              required: {
                value: true,
                message: "Comment text is required",
              },
              maxLength: {
                value: 512,
                message: "Comment text must not exceed 512 characters",
              },
            })}
            id={`${id}_text`}
            placeholder="Add comment..."
            className="h-20 flex-grow resize-none rounded-md border-[1px] border-gray-300 bg-gray-50 p-1 text-sm focus:border-[1px]"
          />
          <Button icon={<PaperAirplaneIcon />} type="submit"></Button>
        </div>
        <div className="text-sm font-semibold text-rose-500">
          {formError ?? errors.text?.message}
        </div>
      </form>
    </>
  );
};

export default CommentColumn;
