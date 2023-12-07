import { useState, useEffect } from "react";
import { makeRequest } from "../../library/Axios";
import {
  PiUserCirclePlusDuotone,
  PiUserCircleMinusDuotone,
  PiUserSwitchDuotone,
} from "react-icons/pi";
import useFindUser from "../../hooks/useFindUser";
import useAuthStore from "../../context/AuthContext";
import { Link } from "@tanstack/router";
import LoadingGif from "../LoadingState/LoadingGif";

const RightBar = () => {
  const [localuser, setLocaluser] = useState({});
  const [userlist, setUserlist] = useState([]);
  const [userFollows, setUserFollows] = useState([]);
  const [loadingFollow, setLoadingFollow] = useState({});
  const [randomUsers, setRandomUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loadingPersonas, setLoadingPersonas] = useState(false);
  const [loadingVeterinarias, setLoadingVeterinarias] = useState(false);

  const { loggedUser } = useAuthStore();
  const { user } = useFindUser(loggedUser);

  useEffect(() => {
    if (user) {
      setLocaluser(user);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoadingPersonas(true);
      const res = await makeRequest.get("/user/find/all");
      console.log("Respuesta de /user/find/all:", res); // Agrega un console para la respuesta de /user/find/all
      if (Array.isArray(res.data.users)) {
        const usersWithFollowers = await Promise.all(
          res.data.users.map(async (user) => {
            const followersRes = await makeRequest.get(
              `/follow/followers/count/${user.user_id}`
            );
            console.log(
              `Respuesta de /follow/followers/count/${user.user_id}:`,
              followersRes
            ); // Agrega un console para la respuesta de /follow/followers/count/${user.user_id}
            console.log(
              `Usuario: ${user.username}, Seguidores: ${followersRes.data.followersCount}`
            );
            const userWithFollowers = {
              ...user,
              followersCount: followersRes.data.followersCount,
            };
            return userWithFollowers;
          })
        );

        const sortedUsers = usersWithFollowers.sort(
          (a, b) => b.followersCount - a.followersCount
        ); // Orden descendente (de mayor a menor)
        console.log(
          "Lista de usuarios ordenada por seguidores (descendente):",
          sortedUsers
        );
        setUserlist(sortedUsers);
        setMembers(sortedUsers);
      }
      setLoadingPersonas(false);
    } catch (err) {
      console.error(err);
      setLoadingPersonas(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const getFollowers = async () => {
      if (localuser.user_id) {
        try {
          setLoadingVeterinarias(true);
          const res = await makeRequest.get(
            `/follow/find/followed/${localuser.user_id}`
          );
          setUserFollows(res.data.follows);
          setLoadingVeterinarias(false);
        } catch (err) {
          console.error(err);
          setLoadingVeterinarias(false);
        }
      }
    };

    getFollowers();
  }, [localuser]);

  const FollowClick = async (
    user,
    userFollows,
    setUserFollows,
    localuser,
    followeduser
  ) => {
    try {
      setLoadingFollow((prevState) => ({
        ...prevState,
        [user.user_id]: true,
      }));

      let response;

      if (followeduser) {
        response = await makeRequest.delete(
          `/follow/delete/${localuser.user_id}/${user.user_id}`
        );
      } else {
        response = await makeRequest.post("/follow/create", {
          followedId: user.user_id,
          followerId: localuser.user_id,
        });
      }

      if (response.status === 200 || response.status === 201) {
        setUserFollows((prevState) => {
          const updatedFollows = [...prevState];
          if (followeduser) {
            console.log(`Dejaste de seguir a ${user.username} correctamente.`);
            // Si el usuario estaba siendo seguido, dejar de seguirlo
            return updatedFollows.filter(
              (follows) => follows.user_id !== user.user_id
            );
          } else {
            // Si el usuario no estaba siendo seguido, seguirlo
            updatedFollows.push({ user_id: user.user_id });
            console.log(
              `Comenzaste a seguir a ${user.username} correctamente.`
            );
            return updatedFollows;
          }
        });
      } else {
        console.error("Error en la solicitud al servidor");
      }
    } catch (err) {
      console.error("Error en FollowClick:", err);
    } finally {
      setLoadingFollow((prevState) => ({
        ...prevState,
        [user.user_id]: false,
      }));
    }
  };

  return (
    <section className="hidden fixed right-0 w-[20%] xl:flex xl:flex-col items-center justify-center gap-5 h-auto text-[#0D1B2AS] text-left mt-10 mr-8">
      <div className="bg-white w-full h-max overflow-y-auto text-[#0D1B2AS] text-left border-2 rounded-lg border-[#E0E1DD] px-4 py-4">
        <h3 className="text-[#0D1B2AS] font-bold dark:border-dim-200">
          Personas populares
        </h3>
        {loadingPersonas ? (
          <div className="flex flex-col items-center justify-center space-x-2">
            <LoadingGif />
          </div>
        ) : (
          <div className="p-2 dark:border-dim-200 flex flex-col">
            {userlist
              .filter((user) => user.type === "USER")
              .slice(0, 5)
              .map((user) => {
                const followeduser = userFollows.find(
                  (follows) => follows.user_id === user.user_id
                );
                const followStatusComponent = followeduser ? (
                  <PiUserCircleMinusDuotone className="text-[2em] text-red-500" />
                ) : (
                  <PiUserCirclePlusDuotone className="text-[2em] text-green-500" />
                );

                return user.user_id === localuser.user_id ? null : (
                  <div
                    key={user.user_id}
                    className="flex items-center mb-2 justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={user.thumbnail}
                        alt={user.username}
                      />
                      <div className="ml-2 text-sm">
                        <h5 className="text-[#0D1B2A] font-bold">
                          {user.first_name} {user.last_name}
                        </h5>
                        <p className="text-gray-400">{user.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {loadingFollow[user.user_id] ? (
                        <PiUserSwitchDuotone className="animate-spin rounded-full text-[2em] text-gray-500" />
                      ) : (
                        <button
                          className="ml-auto content-end"
                          onClick={() =>
                            FollowClick(
                              user,
                              userFollows,
                              setUserFollows,
                              localuser,
                              followeduser
                            )
                          }
                          disabled={loadingFollow[user.user_id]}
                        >
                          {followStatusComponent}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        <Link to={`/`}>
          <div className="text-blue-400 cursor-pointer p-2">Ver más</div>
        </Link>
      </div>
      <div className="bg-white w-full h-max overflow-y-auto text-[#0D1B2AS] text-left border-2 rounded-lg border-[#E0E1DD] px-4 py-4">
        <h3 className="text-[#0D1B2AS] font-bold dark:border-dim-200">
          Miembros populares
        </h3>
        {loadingVeterinarias ? (
          <div className="flex items-center justify-center space-x-2">
            <LoadingGif />
          </div>
        ) : (
          <div className="p-2 dark:border-dim-200 flex flex-col">
            {members
              .filter((user) => user.type === "MEMBER")
              .slice(0, 5)
              .map((user) => {
                const followeduser = userFollows.find(
                  (follows) => follows.user_id === user.user_id
                );
                const followStatusComponent = followeduser ? (
                  <PiUserCircleMinusDuotone className="text-[2em] text-red-500" />
                ) : (
                  <PiUserCirclePlusDuotone className="text-[2em] text-green-500" />
                );

                return user.user_id === localuser.user_id ? null : (
                  <div
                    key={user.user_id}
                    className="flex items-center mb-2 justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={user.thumbnail}
                        alt={user.username}
                      />
                      <div className="ml-2 text-sm">
                        <h5 className="text-[#0D1B2A] font-bold">
                          {user.first_name} {user.last_name}
                        </h5>
                        <p className="text-gray-400">{user.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {loadingFollow[user.user_id] ? (
                        <PiUserSwitchDuotone className="animate-spin rounded-full text-[2em] text-gray-500" />
                      ) : (
                        <button
                          className="ml-auto content-end"
                          onClick={() =>
                            FollowClick(
                              user,
                              userFollows,
                              setUserFollows,
                              localuser,
                              followeduser
                            )
                          }
                          disabled={loadingFollow[user.user_id]}
                        >
                          {followStatusComponent}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        <div className="text-blue-400 cursor-pointer p-2">Ver más</div>
      </div>
    </section>
  );
};

export default RightBar;
