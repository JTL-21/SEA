import React from "react";
import Input from "./Input";
import MarkdownEditor from "./MarkdownEditor";
import Button from "./Button";
import { PlusIcon, WrenchIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Project } from "../types";
import { useForm, useWatch } from "react-hook-form";
import Modal from "./Modal";

type FormData = Pick<Project, "key" | "title" | "description">;

const BLANK_PROJECT = {
  key: "",
  title: "",
  description: "",
} as const;

type ProjectEditorBaseProps = {
  formError?: string;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
};
type ProjectEditorModeProps =
  | { mode: "edit"; project: FormData }
  | { mode: "add" };

type ProjectEditorModalProps = ProjectEditorBaseProps & ProjectEditorModeProps;

const ProjectEditorModal = (props: ProjectEditorModalProps) => {
  const id = React.useId();
  const isEditing = props.mode === "edit";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: isEditing
      ? {
          key: props.project.key,
          title: props.project.title,
          description: props.project.description,
        }
      : BLANK_PROJECT,
  });

  const description = useWatch({ control, name: "description" });

  const handleFormSubmit = (state: FormData) => {
    props.onSubmit(state);
  };

  const modalTitle = (
    <>
      <div className="flex items-center">
        <h3>{isEditing ? "Edit Project" : "Create Project"}</h3>
      </div>
      {isEditing && (
        <div className="flex items-center">
          <span className="font-semibold text-gray-500">
            {props.project.key}
          </span>
        </div>
      )}
    </>
  );

  return (
    <Modal open={true} onClose={props.onCancel} title={modalTitle}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-2 px-4 pb-4 [&>*]:flex-grow"
      >
        {props.formError && (
          <div className="mt-4 rounded-md border-2 border-rose-200 bg-rose-100 px-4 py-2 text-sm text-rose-800">
            {props.formError}
          </div>
        )}
        <div className="flex gap-4">
          <Input
            {...register("key", {
              required: {
                value: true,
                message: "Project key is required",
              },
              pattern: {
                value: /^[A-Za-z]{3}$/,
                message: "Project key must be a 3 character A-Z string",
              },
            })}
            id={`${id}_key`}
            label="Project Key"
            error={errors.key}
            className="basis-1/4 [&>input]:uppercase"
            disabled={props.mode === "edit"}
          />
          <Input
            {...register("title", {
              required: {
                value: true,
                message: "Project title is required",
              },
              minLength: {
                value: 1,
                message: "Project title must be at least 1 characters long",
              },
              maxLength: {
                value: 64,
                message: "Project title must not exceed 64 characters",
              },
            })}
            id={`${id}_title`}
            label="Project Name"
            error={errors.title}
            className="basis-3/4"
          />
        </div>
        <div>
          <label
            htmlFor={`${id}_description`}
            className="text-sm font-semibold text-gray-600"
          >
            Project Description
          </label>
          <MarkdownEditor
            {...register("description", {
              maxLength: {
                value: 2000,
                message: "Description must not exceed 2000 characters",
              },
            })}
            id={`${id}_description`}
            value={description}
          />
          <span className="text-sm text-rose-500">
            {errors.description?.message}
          </span>
        </div>
        <div className="mt-auto flex justify-end gap-2">
          <Button
            type="button"
            className="bg-red-400 hover:bg-red-500 "
            confirmClasses="text-rose-50"
            icon={<XMarkIcon />}
            requireConfirmation
            onClick={props.onCancel}
          >
            Cancel
          </Button>

          {props.mode === "add" ? (
            <Button
              type="submit"
              className="w-52 bg-emerald-400 hover:bg-emerald-500"
              icon={<PlusIcon />}
            >
              Create Project
            </Button>
          ) : (
            <Button
              type="submit"
              icon={<WrenchIcon />}
              className="w-52 bg-blue-400 hover:bg-blue-500"
            >
              Save
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default ProjectEditorModal;
