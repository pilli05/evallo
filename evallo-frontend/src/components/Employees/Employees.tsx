import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

interface Team {
  id: number;
  team_name: string;
}

interface EmployeesProps {
  openEmployeePopup: boolean;
  setOpenEmployeePopup: (value: boolean) => void;
  teamsList: Team[];
  getEmployeeList: () => Promise<void>;
}

interface EmployeeForm {
  employeeName: string;
  employeeEmail: string;
  employeeDesignation: string;
  employeePlatform: string;
}

const Employees: React.FC<EmployeesProps> = ({
  openEmployeePopup,
  setOpenEmployeePopup,
  teamsList,
  getEmployeeList,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeForm>();

  const token = localStorage.getItem("token");

  const formSubmit = async (data: EmployeeForm) => {
    try {
      const selectedTeam = teamsList.find(
        (team: Team) => team.team_name === data.employeePlatform
      );
      console.log(selectedTeam);
      const payload = {
        ...data,
        teamId: selectedTeam?.id,
      };
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/createEmployee",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setOpenEmployeePopup(false);
        reset();
        toast.success("Employee created successfully");
        getEmployeeList();
      }
    } catch (error) {
      console.error("Employee creation failed:", error);
    }
  };

  return (
    <Popup
      open={openEmployeePopup}
      onClose={() => setOpenEmployeePopup(false)}
      modal
    >
      <form
        className="p-5! space-y-2!"
        onSubmit={handleSubmit((data: EmployeeForm) => formSubmit(data))}
      >
        <h2 className="text-lg font-semibold mb-4!">Add Employee</h2>

        <input
          type="text"
          placeholder="Name"
          className="border px-2! py-1! w-full rounded outline-none border-gray-400"
          {...register("employeeName", {
            required: "Please enter your name",
            maxLength: {
              value: 50,
              message: "Name cannot exceed 50 characters",
            },
          })}
        />
        {errors.employeeName && (
          <p className="text-red-500 text-xs">{errors.employeeName.message}</p>
        )}

        <input
          className="border px-2! py-1! w-full rounded  outline-none border-gray-400"
          type="text"
          id="userId"
          placeholder="Email"
          {...register("employeeEmail", {
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
        {errors.employeeEmail && (
          <p className="text-red-500 text-xs">{errors.employeeEmail.message}</p>
        )}

        <input
          type="text"
          placeholder="Designation"
          className="border px-2! py-1! w-full rounded outline-none border-gray-400"
          {...register("employeeDesignation", {
            required: "Please enter your designation",
            maxLength: {
              value: 50,
              message: "Designation cannot exceed 50 characters",
            },
          })}
        />
        {errors.employeeDesignation && (
          <p className="text-red-500 text-xs">
            {errors.employeeDesignation.message}
          </p>
        )}

        <select
          className="border px-3! py-2! w-full rounded outline-none border-gray-400"
          {...register("employeePlatform", {
            required: "Please select a team",
          })}
        >
          {teamsList.map((team: Team) => (
            <option>{team.team_name}</option>
          ))}
        </select>

        {errors.employeePlatform && (
          <p className="text-red-500 text-xs">
            {errors.employeePlatform.message}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-end mt-3! space-x-3! space-y-2! sm:space-y-0!">
          <button
            className="bg-red-500 px-4! w-full sm:w-auto py-2! rounded text-sm text-white cursor-pointer"
            onClick={() => setOpenEmployeePopup(false)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 px-4! py-2! rounded text-white text-sm cursor-pointer"
            type="submit"
          >
            Add Employee
          </button>
        </div>
      </form>
    </Popup>
  );
};

export default Employees;
