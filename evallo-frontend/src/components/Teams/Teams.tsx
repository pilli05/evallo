import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import axios from "axios";
import { toast } from "react-toastify";

interface TeamsProps {
  openTeamPopup: boolean;
  setOpenTeamPopup: (value: boolean) => void;
  getTeamsList: () => Promise<void>;
  editTeamId: number | null;
  setEditTeamId: (value: number | null) => void;
  getLogs: () => Promise<void>;
}

interface TeamForm {
  teamName: string;
}

const Teams: React.FC<TeamsProps> = ({
  openTeamPopup,
  setOpenTeamPopup,
  getTeamsList,
  editTeamId,
  getLogs,
}) => {
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TeamForm>();

  const formSubmit = async (data: TeamForm) => {
    try {
      const response = await axios.post(
        "https://evallo-seven.vercel.app/api/v1/user/createTeam",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setOpenTeamPopup(false);
        reset();
        getTeamsList();
        getLogs();
        toast.success("Team created successfully");
      }
    } catch (error) {
      console.error("Team registration failed:", error);
    }
  };

  const updatedFormSubmit = async (data: TeamForm) => {
    try {
      const payload = {
        ...data,
        teamId: editTeamId,
      };

      const response = await axios.put(
        "https://evallo-seven.vercel.app/api/v1/user/teams/update",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setOpenTeamPopup(false);
        reset();
        getTeamsList();
        getLogs();
        toast.success("Team updated successfully");
      }
    } catch (error) {
      console.error("Update team failed:", error);
    }
  };

  const getTeamDetailsById = async (teamId: number) => {
    try {
      const response = await axios.get(
        `https://evallo-seven.vercel.app/api/v1/user/teams/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setValue("teamName", response.data.team.team_name);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    if (editTeamId) {
      getTeamDetailsById(editTeamId);
    } else {
      setValue("teamName", "");
    }
  }, [editTeamId]);

  return (
    <Popup open={openTeamPopup} onClose={() => setOpenTeamPopup(false)} modal>
      <form
        className="p-5!"
        onSubmit={handleSubmit(editTeamId ? updatedFormSubmit : formSubmit)}
      >
        <h2 className="text-lg font-semibold mb-4!">Create Team</h2>

        <input
          type="text"
          placeholder="Team name"
          className="border px-2! py-1! w-full rounded mb-3! space-y-5! outline-none"
          {...register("teamName", {
            required: "Please enter team name",
            maxLength: {
              value: 50,
              message: "Team name cannot exceed 50 characters",
            },
          })}
        />
        {errors.teamName && (
          <p className="text-red-500 text-sm mb-3!">
            {errors.teamName.message}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-end mt-3! space-x-3! space-y-2! sm:space-y-0!">
          <button
            type="button"
            className="bg-red-500 px-4! py-2! w-full sm:w-auto rounded text-sm text-white cursor-pointer"
            onClick={() => setOpenTeamPopup(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 px-4! py-2! rounded text-white text-sm cursor-pointer"
          >
            {editTeamId ? "Update Team" : "Create Team"}
          </button>
        </div>
      </form>
    </Popup>
  );
};

export default Teams;
