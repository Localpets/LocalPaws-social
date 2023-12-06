import { useState, useEffect } from "react";
import LeftBar from "../Feed/LeftBar";
import Header from "../Header/Header";
import RightBar from "../Feed/RightBar";
import { makeRequest } from "../../library/Axios";
import useFindUser from "../../hooks/useFindUser";
import { Link } from "@tanstack/router";
import {
  PiUserCirclePlusDuotone,
  PiUserCircleMinusDuotone,
} from "react-icons/pi";

const Search = () => {
  const { user } = useFindUser();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [localuser, setLocalUser] = useState(null);
  const [followedUsersMap, setFollowedUsersMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("null");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType((prevSearchType) => (prevSearchType === type ? null : type));
  };

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await makeRequest.get("/user/find/all");
        if (usersResponse.data && Array.isArray(usersResponse.data.users)) {
          setUsers(usersResponse.data.users);
        } else {
          console.error("La respuesta de usuarios es inválida:", usersResponse);
        }

        const postsResponse = await makeRequest.get("/post/find/all");
        if (postsResponse.data && Array.isArray(postsResponse.data.posts)) {
          setPosts(postsResponse.data.posts);
        } else {
          console.error("La respuesta de posts es inválida:", postsResponse);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    const getFollowedUsers = async () => {
      if (localuser) {
        try {
          setLoading(true);
          const res = await makeRequest.get(
            `/follow/find/followed/${localuser.user_id}`
          );
          const followedUsers = {};
          for (const follow of res.data.follows) {
            followedUsers[follow.user_id] = true;
          }
          setFollowedUsersMap(followedUsers);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      }
    };

    getFollowedUsers();
  }, [localuser]);

  useEffect(() => {
    setSearchText("");
  }, [searchType]);

  useEffect(() => {
    const search = async () => {
      const uniqueResultsSet = new Set();

      if (searchText.trim() === "") {
        // Si no hay texto de búsqueda, mostrar todos los usuarios y publicaciones
        if (searchType === "users") {
          users.forEach(
            (user) => user.user_id && uniqueResultsSet.add(user.user_id)
          );
        } else if (searchType === "posts") {
          posts.forEach(
            (post) => post.post_id && uniqueResultsSet.add(post.post_id)
          );
        } else {
          users.forEach(
            (user) => user.user_id && uniqueResultsSet.add(user.user_id)
          );
          posts.forEach(
            (post) => post.post_id && uniqueResultsSet.add(post.post_id)
          );
        }
      } else {
        if (searchType === "users") {
          users.forEach((user) => {
            const fullName = `${user.first_name || ""} ${user.last_name || ""}`;
            if (
              user.user_id &&
              user.username &&
              user.thumbnail &&
              (user.username.toLowerCase().includes(searchText.toLowerCase()) ||
                fullName.toLowerCase().includes(searchText.toLowerCase()))
            ) {
              uniqueResultsSet.add(user.user_id);
            }
          });
        } else if (searchType === "posts") {
          posts.forEach((post) => {
            if (
              post.post_id &&
              post.text &&
              (post.text.toLowerCase().includes(searchText.toLowerCase()) ||
                post.post_id.toString() === searchText)
            ) {
              uniqueResultsSet.add(post.post_id);
            }
          });
        } else {
          users.forEach((user) => {
            const fullName = `${user.first_name || ""} ${user.last_name || ""}`;
            if (
              user.user_id &&
              user.username &&
              user.thumbnail &&
              (user.username.toLowerCase().includes(searchText.toLowerCase()) ||
                fullName.toLowerCase().includes(searchText.toLowerCase()))
            ) {
              uniqueResultsSet.add(user.user_id);
            }
          });

          posts.forEach((post) => {
            if (
              post.post_id &&
              post.text &&
              (post.text.toLowerCase().includes(searchText.toLowerCase()) ||
                post.post_id.toString() === searchText)
            ) {
              uniqueResultsSet.add(post.post_id);
            }
          });
        }
      }

      const uniqueResults = Array.from(uniqueResultsSet)
        .map((id) => {
          const user = users.find((u) => u.user_id === id);
          const post = posts.find((p) => p.post_id === id);

          if (user && user.user_id && user.thumbnail && user.username) {
            return {
              user_id: user.user_id,
              user_thumbnail: user.thumbnail,
              username: user.username,
              text: "",
              followeduser: followedUsersMap[user.user_id] || false,
            };
          } else if (post && post.post_id) {
            const otherUser = users.find(
              (u) => u.user_id === post.post_user_id
            );
            return {
              post_id: post.post_id,
              user_thumbnail: otherUser ? otherUser.thumbnail : "",
              username: otherUser ? otherUser.username : "",
              text: post.text,
              image: post.image,
              followeduser: otherUser
                ? followedUsersMap[otherUser.user_id] || false
                : false,
            };
          }

          return null;
        })
        .filter((result) => result !== null);

      setSearchResults(uniqueResults);
    };

    search();
  }, [searchText, searchType, users, posts, followedUsersMap]);

  const FollowClick = async (user) => {
    try {
      setLoading(true);
      const followeduser = followedUsersMap[user.user_id];

      if (followeduser) {
        await makeRequest.delete(
          `/follow/delete/${localuser.user_id}/${user.user_id}`
        );
        console.log("Seguidor eliminado correctamente", user.user_id);
      } else {
        await makeRequest.post("/follow/create", {
          followedId: user.user_id,
          followerId: localuser.user_id,
        });
        console.log("Seguidor añadido correctamente", user.user_id);
      }

      const updatedFollows = followeduser
        ? Object.keys(followedUsersMap).reduce((acc, key) => {
            if (key !== user.user_id) {
              acc[key] = true;
            }
            return acc;
          }, {})
        : { ...followedUsersMap, [user.user_id]: true };

      setFollowedUsersMap(updatedFollows);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="text-black w-full mx-auto ">
      <Header />
      <section className=" pt-16 flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 lg:w-2/3 xl:w-1/2 mx-auto min-h-screen flex flex-col rounded-lg justify-start gap-4 items-center px-4 md:px-10">
          <LeftBar className="" />
          <div className="w-full p-4 md:max-h-[60%] lg:max-h-[66%] flex flex-col border-[#E0E1DD] bg-white rounded-lg mt-8 justify-start items-left md:ml-8 md:mr-8 lg:ml-0 lg:mr-0">
            <div className="w-full pl-3 pb-4">
              <h1 className="flex font-bold text-3xl text-left">Búsqueda</h1>
              <div className="form-control">
                <div className="input-group text-white p-4 ">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchText}
                    onChange={handleSearch}
                    className="input input-bordered bg-white w-full text-black"
                  />
                  <button className="btn btn-square bg-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-around items-center  border-b border-gray-200 py-4">
              <button
                className={`btn btn-3 btn-3d ${
                  searchType === "users" ? "bg-primary" : "bg-blue"
                }`}
                onClick={() => handleSearchTypeChange("users")}
              >
                <i className="fa-solid fa-users" />
                Usuarios
              </button>

              <button
                className={`btn btn-3 btn-3d ${
                  searchType === "posts" ? "bg-primary" : "bg-blue"
                }`}
                onClick={() => handleSearchTypeChange("posts")}
              >
                <i className="fa-solid fa-align-left" />
                Publicaciones
              </button>

              <button className="btn btn-3 btn-3d ">
                <i className="fa-solid fa-star" />
                Destacados
              </button>
            </div>
            <div className="max-h-screen overflow-auto">
              {searchText && (
                <>
                  {searchResults.map((result) => {
                    const isUser = result.hasOwnProperty("user_id");
                    const followeduser = followedUsersMap[result.user_id];
                    return (
                      <div
                        key={result.user_id || result.post_id}
                        className="flex p-2 border-b cursor-pointer hover:bg-slate-100"
                      >
                        <Link to={`/profile/${user.user_id}`}>
                          <div className="p-2">
                            {result.user_thumbnail && (
                              <img
                                src={result.user_thumbnail}
                                alt={result.username}
                                className="h-10 w-10  flex items-center rounded-full"
                              />
                            )}
                          </div>
                        </Link>
                        <Link to={`/post/${result.post_id}`}>
                          <div className="p-2">
                            <h2 className="text-lg font-semibold">
                              {result.username}
                            </h2>
                            {result.text && (
                              <>
                                <p className="text-gray-500">{result.text}</p>
                                <img
                                  className="object-fill rounded max-w-lg"
                                  src={result.image}
                                  alt={result.text}
                                />
                              </>
                            )}
                          </div>
                        </Link>
                        {isUser && (
                          <button
                            className={`ml-auto content-end ${
                              loading[result.user_id] ? "bg-black" : ""
                            }`}
                            onClick={() => {
                              FollowClick(result);
                            }}
                            disabled={loading[result.user_id]}
                          >
                            {loading[result.user_id] ? (
                              <div className="animate-spin rounded-full">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
                              </div>
                            ) : followeduser ? (
                              <PiUserCircleMinusDuotone className="text-[2em] text-red-500" />
                            ) : (
                              <PiUserCirclePlusDuotone className="text-[2em] text-green-500" />
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
          <RightBar />
        </div>
      </section>
    </div>
  );
};

export default Search;
