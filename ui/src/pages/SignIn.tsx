import React from "react";
import useTitle from "../hooks/useTitle";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import API from "../api";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  password: string;
  stay_signed_in: boolean;
}

const SignIn = () => {
  useTitle("Sign In");
  const navigate = useNavigate();
  const id = React.useId();
  const user = useUser();
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
        user.setUser(response.data);
        navigate("/");
      } else {
        setFormError(response.error.message);
      }
    });
  };

  return (
    <div className="mx-auto max-w-[450px]">
      <h2 className="my-4 text-4xl font-semibold">Sign In</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
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
          id={`${id}_username`}
          label="Username"
          error={errors.username}
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
          className="cursor-pointer text-center text-gray-700"
        >
          Don't have an account?{" "}
          <span className="text-amber-900 underline">Sign Up</span>
        </Link>
        <Button type="submit" className="w-52 self-center">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default SignIn;
