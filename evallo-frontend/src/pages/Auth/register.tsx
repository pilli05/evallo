import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  return (
    <div className="h-screen flex justify-center items-center bg-slate-200">
      <form
        className="bg-white rounded-lg p-8! space-y-5! max-w-96 md:w-xl"
        onSubmit={handleSubmit((data) => console.log(data))}
      >
        <h1 className="text-center font-bold mb-3! text-xl text-violet-600">
          Register
        </h1>
        <div>
          <label className="text-gray-500 font-medium text-sm" htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <br />
          <input
            className="border border-gray-400 rounded-md mt-1! py-1! px-2! outline-none w-full"
            type="text"
            id="name"
            {...register("name", {
              required: "Name is required",
              maxLength: {
                value: 50,
                message: "Name cannot exceed 50 characters",
              },
            })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1!">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="text-gray-500 font-medium text-sm" htmlFor="userId">
            Email <span className="text-red-500">*</span>
          </label>
          <br />
          <input
            className="border border-gray-400 rounded-md mt-1! py-1! px-2! outline-none w-full"
            type="text"
            id="userId"
            {...register("email", {
              required: "Please enter your email",
              maxLength: {
                value: 50,
                message: "Email cannot exceed 50 characters",
              },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1!">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            className="text-gray-500 font-medium text-sm"
            htmlFor="password"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <br />
          <input
            className="border border-gray-400 rounded-md mt-1! py-1! px-2! outline-none w-full"
            type="password"
            id="password"
            {...register("password", {
              required: "Please enter your password",
              maxLength: {
                value: 50,
                message: "Password cannot exceed 50 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1!">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2! rounded-md mt-2! hover:bg-blue-700 transition duration-300 hover:cursor-pointer"
        >
          Register
        </button>
        <p className="text-sm text-gray-500 my-2!">
          Already registered?
          <Link to="/login" className="text-blue-700 font-semibold ml-1!">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
