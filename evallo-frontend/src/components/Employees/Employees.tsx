import axios from "axios";
import React, { useEffect } from "react";
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
  getTeamsList: () => Promise<void>;
  getEmployeeList: () => Promise<void>;
  editEmployeeeId: number | null;
  setEditEmployeeId: (value: number | null) => void;
  getLogs: () => Promise<void>;
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
  getTeamsList,
  getEmployeeList,
  editEmployeeeId,
  setEditEmployeeId,
  getLogs,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EmployeeForm>();

  const token = localStorage.getItem("token");

  const getEmployeeDetailsById = async (employeeId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/user/employee/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setValue("employeeName", response.data.employee.employee_name);
        setValue("employeeEmail", response.data.employee.employee_email);
        setValue(
          "employeeDesignation",
          response.data.employee.employee_designation
        );
        setValue("employeePlatform", response.data.employee.employee_platform);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const formSubmit = async (data: EmployeeForm) => {
    try {
      const selectedTeam = teamsList.find(
        (team: Team) => team.team_name === data.employeePlatform
      );
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
        getTeamsList();
        toast.success("Employee created successfully");
        getEmployeeList();
        getLogs();
      }
    } catch (error) {
      console.error("Employee creation failed:", error);
    }
  };

  const updatedFormSubmit = async (data: EmployeeForm) => {
    try {
      const selectedTeam = teamsList.find(
        (team: Team) => team.team_name === data.employeePlatform
      );
      const payload = {
        ...data,
        employeeId: editEmployeeeId,
        teamId: selectedTeam?.id,
      };
      const response = await axios.put(
        "http://localhost:5000/api/v1/user/employee/update",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setOpenEmployeePopup(false);
        reset();
        setEditEmployeeId(null);
        getTeamsList();
        toast.success("Employee updated successfully");
        getEmployeeList();
        getLogs();
      }
    } catch (error) {
      console.error("Employee update failed:", error);
    }
  };

  useEffect(() => {
    if (editEmployeeeId) {
      getEmployeeDetailsById(editEmployeeeId);
    } else {
      setValue("employeePlatform", "");
      setValue("employeeName", "");
      setValue("employeeEmail", "");
      setValue("employeeDesignation", "");
    }
  }, [editEmployeeeId]);

  return (
    <Popup
      open={openEmployeePopup}
      onClose={() => setOpenEmployeePopup(false)}
      modal
    >
      <form
        className="p-5! space-y-2!"
        onSubmit={handleSubmit(
          editEmployeeeId ? updatedFormSubmit : formSubmit
        )}
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
          <option value="">Select a team</option>
          {teamsList.map((team: Team) => (
            <option key={team.id}>{team.team_name}</option>
          ))}
        </select>

        {errors.employeePlatform && (
          <p className="text-red-500 text-xs">
            {errors.employeePlatform.message}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-end mt-3! space-x-3! space-y-2! sm:space-y-0!">
          <button
            type="button"
            className="bg-red-500 px-4! w-full sm:w-auto py-2! rounded text-sm text-white cursor-pointer"
            onClick={() => setOpenEmployeePopup(false)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 px-4! py-2! rounded text-white text-sm cursor-pointer"
            type="submit"
          >
            {editEmployeeeId ? "Update Employee" : "Add Employee"}
          </button>
        </div>
      </form>
    </Popup>
  );
};

export default Employees;
