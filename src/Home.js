import React, { useState, useEffect } from "react";
import "./Home.css";
import Stack from "@mui/material/Stack";
import prof from "./components/prof.jpg";
import logo1 from "./components/pimslogo.png";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Profiledisplay from "./components/Profiledisplay";
import SearchIcon from "@mui/icons-material/Search";
import { db, storage } from "./components/Firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function AvatarModal({ isOpen, closeAvatarModal, avatarSrc }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 / 1 });

  const [croppedImageUrl, setCroppedImageUrl] = useState(null);

  useEffect(() => {
    if (selectedFile) {
      handleAutoCrop();
    }
  }, [selectedFile]);

  const handleAutoCrop = () => {
    try {
      const image = new Image();
      image.src = URL.createObjectURL(selectedFile);
      image.onload = () => {
        const croppedCanvas = document.createElement("canvas");
        const croppedCtx = croppedCanvas.getContext("2d");

        // Set a fixed aspect ratio for automatic cropping
        const aspectRatio = 1 / 1;
        const maxSize = Math.min(image.width, image.height);

        croppedCanvas.width = maxSize;
        croppedCanvas.height = maxSize;

        const startX =
          image.width > image.height ? (image.width - maxSize) / 2 : 0;
        const startY =
          image.height > image.width ? (image.height - maxSize) / 2 : 0;

        croppedCtx.drawImage(
          image,
          startX,
          startY,
          maxSize,
          maxSize,
          0,
          0,
          maxSize,
          maxSize
        );

        croppedCanvas.toBlob(async (blob) => {
          // Upload the cropped image to Firebase Storage
          const storageRef = ref(
            storage,
            "profile_images/" + selectedFile.name
          );
          await uploadBytes(storageRef, blob);

          // Get the download URL
          const downloadURL = await getDownloadURL(storageRef);

          // Set the cropped image URL
          setCroppedImageUrl(downloadURL);
        });
      };
    } catch (error) {
      console.error("Error cropping and uploading image:", error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setCroppedImageUrl(null); // Reset cropped image URL when a new file is selected
    }
  };

  const handleModalSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name,
        email,
        phone,
        dob,
        address,
        lowercaseName: name.toLowerCase(),
        Profurl: croppedImageUrl || avatarSrc,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    // Close the modal
    closeAvatarModal();
  };

  if (!isOpen) return null;

  return (
    <div className="avatar-modal-overlay">
      <div className="avatar-modal">
        <Avatar className="modal-avatar" src={croppedImageUrl || avatarSrc} />
        <button className="modal-close" onClick={closeAvatarModal}>
          Close
        </button>
        <div className="user">
          <input
            className="filechoose"
            type="file"
            onChange={handleFileChange}
          />

          <label className="userhead">Enter The Details</label>
          <div className="userrow">
            <label className="usertitle">Name : </label>
            <input
              className="i1"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="userrow">
            <label className="usertitle">Email : </label>
            <input
              className="i2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="userrow">
            <label className="usertitle">Phone : </label>
            <input
              className="i3"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="userrow">
            <label className="usertitle">DOB : </label>
            <input
              className="i4"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="userrow">
            <label className="usertitle">Address : </label>
            <textarea
              className="i5"
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
        </div>
        <Button variant="contained" onClick={handleModalSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();

  const [searchUsername, setSearchUsername] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    Profurl: "",
  });

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const openAvatarModal = () => {
    setIsAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const [userFound, setUserFound] = useState(false);
  const handleSearch = async () => {
    try {
      if (!searchUsername.trim()) {
        alert("Please enter a username for search.");
        return;
      }

      const lowercaseUsername = searchUsername.toLowerCase();
      console.log("Searching for lowercase username:", lowercaseUsername);

      const q = query(
        collection(db, "users"),
        where("lowercaseName", "==", lowercaseUsername)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setUserProfile(doc.data());
        });
        setUserFound(true);
      } else {
        setUserProfile({
          name: "User not found",
          email: "",
          phone: "",
          dob: "",
          address: "",
          Profurl: "",
        });
        setUserFound(false);
      }
    } catch (error) {
      console.error("Error searching for user: ", error);
    }
  };
  return (
    <div className="mainhome">
      <div className="tophome">
        <h3>Personal Information Management System</h3>
        <img className="logo" src={logo1} alt="" />

        <Stack className="topsign" spacing={2} direction="row">
          <div className="topavatar-container">
            <Avatar
              className="topavatar"
              src="https://www.svgrepo.com/show/170952/add-button.svg"
              onClick={openAvatarModal}
            />
          </div>

          <button
            className="topbutton"
            onClick={() => navigate("/login")}
            size="small"
            variant="contained"
          >
            Login
          </button>
        </Stack>
      </div>
      <div className="div1">
        <div className="div2">
          <input
            type="text"
            autoComplete="off"
            name="text"
            className="input11"
            placeholder="Username"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SearchIcon onClick={handleSearch} />
        </div>
        {userFound && (
          <Profiledisplay
            prof={userProfile.Profurl}
            name={userProfile.name}
            email={userProfile.email}
            phone={userProfile.phone}
            dob={userProfile.dob}
            address={userProfile.address}
          />
        )}

        {userFound === false && searchUsername.trim() !== "" && (
          <div>
            <p className="unf">User not found</p>
          </div>
        )}
      </div>

      <AvatarModal
        isOpen={isAvatarModalOpen}
        closeAvatarModal={closeAvatarModal}
        avatarSrc={prof}
      />
    </div>
  );
}

export default Home;
