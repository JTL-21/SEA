import API from "../api";
import React from "react";
import Input from "./Input";
import MarkdownEditor from "./MarkdownEditor";
import Button from "./Button";
import { XMarkIcon, WrenchIcon } from "@heroicons/react/20/solid";
import { TICKET_PRIORITIES, Ticket } from "../types";
import { useForm, useWatch } from "react-hook-form";
import { priorityNameMap } from "./Ticket";

interface TicketEditModalProps {
  ticket: Ticket;
  onFinish: () => void;
}

interface FormData {
  title: Ticket["title"];
  description: Ticket["description"];
  priority: Ticket["priority"];
  points: Ticket["points"];
}

const TicketEditModal = ({ ticket, onFinish }: TicketEditModalProps) => {
  const id = React.useId();
  const [formError, setFormError] = React.useState<string | undefined>(
    undefined
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      points: ticket.points,
    },
  });

  const description = useWatch({ control, name: "description" });

  const onSubmit = (state: FormData) => {
    API.editTicket(ticket.slug, {
      ...state,
      points: Number(state.points),
    }).then((response) => {
      if (response.ok) {
        onFinish();
      } else {
        setFormError(response.error.message);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 px-4 pb-4 [&>*]:flex-grow"
    >
      {formError && (
        <div className="mt-4 rounded-md border-2 border-rose-200 bg-rose-100 px-4 py-2 text-sm text-rose-800">
          {formError}
        </div>
      )}
      <Input
        {...register("title", {
          required: "Name must be at least 1 character.",
          maxLength: {
            value: 64,
            message: "Name cannot exceed 64 characters.",
          },
        })}
        id={`${id}_title`}
        label="Name"
        error={errors.title}
      />
      <div className="flex gap-4 [&>*]:flex-grow [&>*]:basis-full">
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Priority
          </label>
          <select
            {...register("priority", {})}
            id={`${id}_priority`}
            className="w-full rounded-md border-[1px] border-gray-300 shadow-sm"
          >
            {TICKET_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priorityNameMap[priority]}
              </option>
            ))}
          </select>
        </div>
        <Input
          type="number"
          {...register("points", {
            min: 1,
            max: 9,
          })}
          id={`${id}_points`}
          label="Story Points"
          error={errors.points}
        />
      </div>
      <div>
        <span className="text-sm font-semibold text-gray-700">Description</span>
        <MarkdownEditor
          {...register("description", {
            maxLength: {
              value: 2000,
              message: "Description cannot exceed 200 characters",
            },
          })}
          value={description}
        />
      </div>
      <div className="mt-auto flex justify-end gap-2">
        <Button
          type="button"
          className="bg-red-400 hover:bg-red-500 "
          confirmClasses="text-rose-50"
          icon={<XMarkIcon />}
          requireConfirmation
          onClick={onFinish}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          icon={<WrenchIcon />}
          className="w-52 bg-blue-400 hover:bg-blue-500"
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default TicketEditModal;
