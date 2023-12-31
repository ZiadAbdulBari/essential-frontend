import UiButton from "@/components/UiKit/UiButton";
import UiInput from "@/components/UiKit/UiInput";
import MainLayout from "@/layout/MainLayout";
import { getLoggedinStatus, getToken } from "@/store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import UserProfile from "@/components/UserProfile/UserProfile";

const Profile = () => {
  const dispatch = useDispatch();
  const loggedin = useSelector((state) => state.auth.isLoggedin);
  const token = useSelector((state) => state.auth.token);
  const [edit, setEdit] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [inputValue, setInputValue] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const getProfileData = () => {
    if (loggedin) {
      axios
        .get("http://localhost:4000/get-profile", {
          headers: { Authorization: token },
        })
        .then((response) => {
          if (response?.data?.status == 200) {
            setProfileData(response?.data?.profile);
            setInputValue({
              ...inputValue,
              name: response?.data?.profile.name,
              email: response?.data?.profile.email,
              phone: response?.data?.profile.phone,
              address: response?.data?.profile.address,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleChangeInput = (event) => {
    if (event.target.name == "name") {
      setInputValue({ ...inputValue, name: event.target.value });
    } else if (event.target.name == "email") {
      setInputValue({ ...inputValue, email: event.target.value });
    } else if (event.target.name == "phone") {
      setInputValue({ ...inputValue, phone: event.target.value });
    } else if (event.target.name == "address") {
      setInputValue({ ...inputValue, address: event.target.value });
    }
  };
  const upgradeProfile = () => {
    if (loggedin) {
      axios
        .post("http://localhost:4000/update-profile", inputValue, {
          headers: { Authorization: token },
        })
        .then((response) => {
          if (response?.data?.status == 200) {
            getProfileData();
            setEdit(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const cancelUpgrade = () => {
    setEdit(false);
  };
  useEffect(() => {
    dispatch(getLoggedinStatus());
    dispatch(getToken());
  }, []);
  useEffect(() => {
    getProfileData();
  }, [loggedin == true]);
  return (
    <MainLayout>
      <div className="lg:container mx-auto">
        <div className="flex gap-4 mt-12">
          <Sidebar />
          {/* SHOW PROFILE DATA */}
          <div className="w-[85%]">
            <h1 className="text-[30px] text-color-1 font-bold mb-4">Profile</h1>
            {edit == false && (
              <div className="rounded bg-gray-50 w-full shadow-lg shadow-gray-400/20">
                <div className="p-[10px] flex justify-end cursor-pointer" onClick={() => setEdit(true)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-color-1"
                  >
                    <path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path>
                  </svg>
                </div>
                <div className="w-full py-[50px] px-[30px]">
                  <div className="grid grid-flow-row grid-cols-2 gap-x-2 gap-y-8">
                    <UserProfile fieldName="Name" fieldData={profileData?.name}/>
                    <UserProfile fieldName="Email" fieldData={profileData?.email}/>
                    <UserProfile fieldName="Phone" fieldData={profileData?.phone}/>
                    <UserProfile fieldName="Address" fieldData={profileData?.address}/>
                  </div>
                </div>
              </div>
            )}
            {/* UPDATE PROFILE DATA*/}
            {edit == true && (
              <div className="rounded bg-gray-50 py-[50px] px-[30px] w-full shadow-lg shadow-gray-400/20">
                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                  <UiInput
                    label="Name"
                    type="text"
                    value={inputValue.name}
                    name="name"
                    placeholder="Ente your name"
                    onChange={handleChangeInput}
                  />
                  <UiInput
                    label="Email"
                    type="email"
                    value={inputValue.email}
                    name="email"
                    placeholder="Ente your email"
                    onChange={handleChangeInput}
                  />
                  <UiInput
                    label="Phone"
                    type="text"
                    value={inputValue.phone}
                    name="phone"
                    placeholder="Ente your phone number"
                    onChange={handleChangeInput}
                  />
                  <UiInput
                    label="Address"
                    type="text"
                    value={inputValue.address}
                    name="address"
                    placeholder="Ente your address"
                    onChange={handleChangeInput}
                  />
                </div>
                <div className="flex justify-end mt-[100px] gap-4">
                  <UiButton
                    buttonName="Upgrade Profile"
                    externalClass="bg-color-1 !text-color-3 !font-medium"
                    onClick={upgradeProfile}
                  />
                  <UiButton
                    buttonName="Cancel"
                    externalClass="bg-red-500 !text-white !font-medium"
                    onClick={cancelUpgrade}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
