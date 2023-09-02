import React from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import useUser from "../hooks/useUser";
import { UserPlusIcon } from "@heroicons/react/24/outline";

interface FormData {
  username: string;
  password: string;
}

const SignUp = () => {
  useTitle("Sign Up");
  const navigate = useNavigate();
  const { user } = useUser();
  const id = React.useId();
  const [formError, setFormError] = React.useState<string | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (state: FormData) => {
    API.createUser({
      username: state.username,
      password: state.password,
    }).then((response) => {
      if (response.ok) {
        navigate("/sign-in");
      } else {
        setFormError(response.error.message);
      }
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 grid place-content-center bg-white">
      <div className="w-[400px] rounded-md p-8 shadow-lg ring-1 ring-black ring-opacity-5">
        <h2 className="my-4 text-center text-4xl font-semibold">Sign Up</h2>
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
              minLength: {
                value: 1,
                message: "Username is must be at least 1 character",
              },
              maxLength: {
                value: 32,
                message: "Username must not exceed 32 characters",
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
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              maxLength: {
                value: 128,
                message: "Password must not exceed 128 characters",
              },
            })}
            id={`${id}_password`}
            label="Password"
            error={errors.password}
          />
          <Link
            to="/sign-in"
            className="cursor-pointer space-x-1 text-center text-gray-700"
          >
            <span>Already have an account?</span>
            <span className="text-amber-900 underline">Sign In</span>
          </Link>
          <Button type="submit" icon={<UserPlusIcon />}>
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
