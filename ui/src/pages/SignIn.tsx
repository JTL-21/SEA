import React from "react";
import useTitle from "../hooks/useTitle";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import API from "../api";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  IdentificationIcon,
  KeyIcon,
} from "@heroicons/react/20/solid";
import FullscreenForm from "../components/FullscreenForm";

interface FormData {
  username: string;
  password: string;
  stay_signed_in: boolean;
}

const SignIn = () => {
  useTitle("Sign In");
  const navigate = useNavigate();
  const id = React.useId();
  const { setUser } = useUser();
  const [formError, setFormError] = React.useState<string | undefined>(
    undefined
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (state: FormData) => {
    API.login(state).then((response) => {
      if (response.ok) {
        setUser(response.data);
        navigate("/");
      } else {
        setFormError(response.error.message);
      }
    });
  };

  return (
    <FullscreenForm>
      <h2 className="my-4 text-center text-4xl font-semibold">Sign In</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {formError && (
          <div className="rounded-md border-2 border-rose-200 bg-rose-100 px-4 py-2 text-sm text-rose-800">
            {formError}
          </div>
        )}
        <Input
          {...register("username", {
            required: {
              value: true,
              message: "Username is required",
            },
          })}
          autoComplete="given-name"
          id={`${id}_username`}
          label="Username"
          error={errors.username}
          icon={<IdentificationIcon />}
        />
        <Input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
          })}
          id={`${id}_password`}
          label="Password"
          error={errors.password}
          icon={<KeyIcon />}
          autoComplete="password"
          autoCapitalize="off"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("stay_signed_in")}
            name={`${id}_stay-signed-in`}
            id={`${id}_stay-signed-in`}
            className="cursor-pointer"
          />
          <label htmlFor={`${id}_stay-signed-in`}>Stay Signed In</label>
        </div>
        <Link
          to="/sign-up"
          className="cursor-pointer space-x-1 text-center text-gray-700"
        >
          <span>Don't have an account?</span>
          <span className="text-amber-900 underline">Sign Up</span>
        </Link>
        <Button type="submit" icon={<ArrowRightOnRectangleIcon />}>
          Sign In
        </Button>
      </form>
    </FullscreenForm>
  );
};

export default SignIn;
