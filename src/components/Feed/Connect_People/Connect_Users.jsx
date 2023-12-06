import { useState, useEffect } from "react";
import LeftBar from "../Feed/LeftBar";
import Header from "../Header/Header";
import RightBar from "../Feed/RightBar";
import { makeRequest } from "../../library/Axios";
import useFindUser from "../../hooks/useFindUser";
import { Link } from "@tanstack/router";

const Connect_Users = () => {
  return (
    <div className="text-black w-full mx-auto">
      <Header />
      <section className=" pt-16 flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 lg:w-2/3 xl:w-1/2 mx-auto min-h-screen flex flex-col rounded-lg justify-start gap-4 items-center px-4 md:px-10">
          <LeftBar />
          <div className="w-full p-4 md:max-h-[60%] lg:max-h-[66%] flex flex-col border-[#E0E1DD] bg-white rounded-lg mt-8 justify-start items-left md:ml-8 md:mr-8 lg:ml-0 lg:mr-0">
            <h1 className="flex font-bold text-3xl text-left">
              Conectar con más usuarios
            </h1>
          </div>
          <RightBar />
        </div>
      </section>
    </div>
  );
};
