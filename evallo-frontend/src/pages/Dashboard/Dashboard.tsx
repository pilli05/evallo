import axios from "axios";
import React, { useEffect } from "react";
import { useAuth } from "../../hook/useAuth";
import Header from "../../components/Header/Header";
import { MdEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import Employees from "../../components/Employees/Employees";
import Teams from "../../components/Teams/Teams";
import { toast } from "react-toastify";

interface TeamsData {
  id: number;
  team_name: string;
  teams_count: number;
}

interface EmployeeData {
  id: number;
  employee_name: string;
  employee_designation: string;
  employee_email: string;
  employee_platform: string;
}

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const { setUserData, userData } = useAuth();
  const [openEmployeePopup, setOpenEmployeePopup] = React.useState(false);
  const [openTeamPopup, setOpenTeamPopup] = React.useState(false);
  const [teamsList, setTeamsList] = React.useState([]);
  const [employeeList, setEmployeeList] = React.useState([]);
  const [editTeamId, setEditTeamId] = React.useState<number | null>(null);
  const [editEmployeeeId, setEditEmployeeId] = React.useState<number | null>(
    null
  );

  const getTeamsList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/user/teams`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setTeamsList(response.data.teams);
      }
    } catch (error) {
      console.error("Error fetching teams data:", error);
    }
  };

  const getEmployeeList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/user/employee`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setEmployeeList(response.data.employee);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const deleteTeam = async (teamId: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/user/teams/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Team deleted successfully");
        getTeamsList();
      }
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const deleteEmployee = async (employeeId: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/user/employee/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Employee deleted successfully");
        getEmployeeList();
        getTeamsList();
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const getMembersCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/user/employeeTeam`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // setEmployeeList(response.data.employee);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    getUserProfile();
  }, []);

  useEffect(() => {
    const fetchTeamsListData = async () => {
      getTeamsList();
      getEmployeeList();
      getMembersCount();
    };

    fetchTeamsListData();
  }, []);

  return (
    <div className="bg-white">
      <Employees
        openEmployeePopup={openEmployeePopup}
        setOpenEmployeePopup={setOpenEmployeePopup}
        teamsList={teamsList}
        getTeamsList={getTeamsList}
        getEmployeeList={getEmployeeList}
        editEmployeeeId={editEmployeeeId}
        setEditEmployeeId={setEditEmployeeId}
      />
      <Teams
        openTeamPopup={openTeamPopup}
        setOpenTeamPopup={setOpenTeamPopup}
        getTeamsList={getTeamsList}
        editTeamId={editTeamId}
        setEditTeamId={setEditTeamId}
      />

      <Header />
      <div className="my-2! p-5!">
        <h1 className="text-blue-600 font-bold">
          Organization - {userData.org_name}
        </h1>

        <div className="grid grid-cols-12 gap-4! mt-5!">
          <div className="col-span-12 md:col-span-8 shadow shadow-gray-400 rounded-md  p-4!">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Employees</h1>
              <div className="flex items-center space-x-3!">
                <button
                  className="bg-gray-300 px-4! py-2! rounded-md text-sm text-gray-700 cursor-pointer"
                  onClick={() => {
                    setOpenTeamPopup(true);
                    setEditTeamId(null);
                  }}
                >
                  + Team
                </button>
                <button
                  className="bg-blue-700 px-4! py-2! rounded-md text-sm text-white cursor-pointer"
                  onClick={() => setOpenEmployeePopup(true)}
                >
                  + Employee
                </button>
              </div>
            </div>

            {employeeList && employeeList.length > 0 ? (
              employeeList.map((employee: EmployeeData, index) => (
                <div
                  key={index}
                  className="shadow rounded-md px-2! py-5! my-3! flex items-center justify-between"
                >
                  <div>
                    <h1 className=" font-medium">{employee.employee_name}</h1>
                    <p className="text-sm text-gray-500">
                      {employee.employee_designation}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4!">
                    <span className="bg-slate-100 rounded-full px-3! py-2! text-sm text-gray-600">
                      {employee.employee_platform}
                    </span>
                    <MdEdit
                      color="blue"
                      size={20}
                      className="cursor-pointer"
                      onClick={() => {
                        setEditEmployeeId(employee.id);
                        setOpenEmployeePopup(true);
                      }}
                    />
                    <AiOutlineDelete
                      color="red"
                      size={20}
                      className="cursor-pointer"
                      onClick={() => deleteEmployee(employee.id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>No employees record found</p>
            )}
          </div>
          <div className="col-span-12 md:col-span-4 space-y-5!">
            <div className="shadow shadow-gray-400 rounded-md p-4! ">
              <h1 className="text-xl font-semibold">Teams</h1>
              {teamsList && teamsList.length > 0 ? (
                teamsList.map((team: TeamsData) => (
                  <div
                    key={team.id}
                    className="px-2! py-2! flex items-center justify-between"
                  >
                    <div>
                      <h1 className="font-medium">{team.team_name}</h1>
                      <p className="text-xs text-gray-600 italic">
                        Members: {team.teams_count}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2!">
                      <MdEdit
                        color="blue"
                        size={20}
                        onClick={() => {
                          setEditTeamId(team.id);
                          setOpenTeamPopup(true);
                        }}
                        className="cursor-pointer"
                      />
                      <AiOutlineDelete
                        color="red"
                        size={20}
                        onClick={() => deleteTeam(team.id)}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>No teams found</p>
              )}
            </div>
            <div className="shadow shadow-gray-400 rounded-md p-4! ">
              <h1 className="text-xl font-semibold mb-3!">Activity Log</h1>
              <p className="text-gray-600 text-sm">
                [2025-11-20 09:00] User 'admin' logged in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
