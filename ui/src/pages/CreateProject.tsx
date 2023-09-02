import React from "react";
import useTitle from "../hooks/useTitle";
import { useForm, useWatch } from "react-hook-form";
import Input from "../components/Input";
import { CreateProjectBody } from "../types";
import MarkdownEditor from "../components/MarkdownEditor";
import Button from "../components/Button";
import API from "../api";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  useTitle("Create Project");

  const navigate = useNavigate();
  const id = React.useId();
  const [formError, setFormError] = React.useState<string | undefined>(
    undefined
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectBody>();

  const description = useWatch({ control, name: "description" });

  const onSubmit = (state: CreateProjectBody) => {
    API.createProject({ ...state, key: state.key.toUpperCase() }).then(
      (response) => {
        if (response.ok) {
          navigate(`/project/${response.data.key}`);
        } else {
          setFormError(response.error.message);
        }
      }
    );
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <h2 className="my-4 text-4xl font-semibold">Create Project</h2>
        {formError && (
          <div className="rounded-md border-2 border-rose-200 bg-rose-100 px-4 py-2 text-sm text-rose-800">
            {formError}
          </div>
        )}
        <div className="flex gap-2">
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
            className="text-sm text-gray-600"
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

        <Button type="submit" className="self-end">
          Create Project
        </Button>
      </form>
    </div>
  );
};

export default CreateProject;
