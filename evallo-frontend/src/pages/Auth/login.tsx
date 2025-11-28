import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../hook/useAuth";
import { toast } from "react-toastify";

type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const formSubmit = async (data: LoginForm) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        data
      );

      if (response.status === 200) {
        toast.success("Login successfully");
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <form
        className="login rounded-lg p-8! space-y-5! max-w-96 md:w-xl"
        onSubmit={handleSubmit(formSubmit)}
      >
        <h1 className="text-center font-bold mb-3! text-xl text-violet-600">
          Login
        </h1>
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
          className="w-full bg-blue-600! text-white py-2! rounded-md mt-2! hover:bg-blue-700! transition duration-300 hover:cursor-pointer"
        >
          Login
        </button>
        <p className="text-sm text-gray-500 my-2!">
          Not yet registered?
          <Link to="/register" className="text-blue-700 font-semibold ml-1!">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
