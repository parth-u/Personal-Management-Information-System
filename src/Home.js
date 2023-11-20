import React, { useState, useEffect } from "react";
import "./Home.css";
import Stack from "@mui/material/Stack";
import prof from "./components/prof.jpg";
import logo1 from "./components/pimslogo.png";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
// import Profiledisplay from "./components/Profiledisplay";
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


function calculateAge(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function Profiledisplay({
  prof,
  name,
  email,
  phone,
  dob,
  address,
  openEditMode,
  id,
}) {
  const [age, setAge] = useState(0);

  useEffect(() => {
    setAge(calculateAge(dob));
  }, [dob]);

  return (
    <div className="div3">
      <div className="div6">
        <div className="div4">
          <Avatar className="prof1" src={prof} alt="" />
          <h1>{name}</h1>
        </div>
        <div className="div5">
          <h3>Name : {name}</h3>
          <h3>Email : {email}</h3>
          <h3>Phone : {phone}</h3>
          <h3>DOB : {dob}</h3>
          <h3>AGE : {age}</h3>
          <h3 className="addh3">Address : {address}</h3>
        </div>
      </div>

      <Button onClick={() =>openEditMode(id)} variant="contained">
        Edit
      </Button>
    </div>
  );
}

function AvatarModal({
  isOpen,
  closeAvatarModal,
  avatarSrc,
  isEditMode,
  initialData,
  userDocRef,
  resetEditMode,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  console.log("docref",userDocRef );
  useEffect(() => {
    if (isEditMode && userDocRef){
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setDob(initialData.dob || "");
      setAddress(initialData.address || "");
      setCroppedImageUrl(initialData.Profurl || "");
      console.log("Document Ref:", userDocRef);
    }
  }, [isEditMode, userDocRef]);

  useEffect(() => {
    if (!isEditMode){
      setName("");
    setEmail("");
    setPhone("");
    setDob("");
    setAddress("");
    setCroppedImageUrl("");
      console.log("Document Ref:", userDocRef);
    }
  }, [isEditMode]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 / 1 });

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
          const storageRef = ref(
            storage,
            "profile_images/" + selectedFile.name
          );
          await uploadBytes(storageRef, blob);

          const downloadURL = await getDownloadURL(storageRef);

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
      setCroppedImageUrl(null);
    }
  };

  const handleUpdate = async () => {
    try {
      console.log("Updating document...");
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Phone:", phone);
      console.log("DOB:", dob);
      console.log("Address:", address);
      console.log("Cropped Image URL:", );
      console.log("Document Ref:", userDocRef);

      if (!userDocRef) {
        console.error("Invalid document reference");
        return;
      }

      await updateDoc(userDocRef, {
        name,
        email,
        phone,
        dob,
        address,
        Profurl: croppedImageUrl,
        lowercaseName: name.toLowerCase(),
      });

      console.log("Document updated successfully");


      closeAvatarModal();
    } catch (error) {
      console.error("Error updating document: ", error);
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
setName("");
setEmail("");
setPhone("");
setDob("");
setAddress("");
setCroppedImageUrl("");
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
        <Button
          variant="contained"
          onClick={isEditMode ? handleUpdate : handleModalSubmit}
        >
          {isEditMode ? "Update" : "Submit"}
        </Button>
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [idToUpdate, setIdToUpdate] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    Profurl: "",
  });

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [userDocRef, setUserDocRef] = useState(null);
  const openEditMode = (docRef) => {
    setUserDocRef(docRef);
    setIsEditMode(true);
    openAvatarModal();
  };

  const openAvatarModal = (id) => {
    setIdToUpdate(id); // Set the id first
    setIsAvatarModalOpen(true);
    setUserFound(null); // Clear the user found state when opening the modal
  };

  const resetEditMode = () => {
    setIsEditMode(false);
  };
  

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false);
    setIsEditMode(false);
  };

  useEffect(() => {
    setUserFound(null);
  }, [searchUsername]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const [userFound, setUserFound] = useState(null);
  const [document,setDocument]=useState("");
  const handleSearch = async () => {
    try {
      if (!searchUsername.trim()) {
        alert("Please enter a username for search.");
        setUserFound(null);
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
        const firstDoc = querySnapshot.docs[0];
        const userDocRef = firstDoc.ref;
        setUserDocRef(userDocRef); // Store the document reference
  
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
        {userFound === false && searchUsername.trim() !== "" && (
          <div>
            <p className="unf">User not found!</p>
          </div>
        )}
        {userFound && (
          <Profiledisplay
          prof={userProfile.Profurl}
          name={userProfile.name}
          email={userProfile.email}
          phone={userProfile.phone}
          dob={userProfile.dob}
          address={userProfile.address}
          openEditMode={() => openEditMode(userDocRef)} // Assuming docRef is the user document reference
          id={userProfile.id}
          
          />
          
        )}
       
      </div>

      <AvatarModal
  isOpen={isAvatarModalOpen}
  closeAvatarModal={closeAvatarModal}
  avatarSrc={prof}
  isEditMode={isEditMode}
  initialData={userProfile}
  userDocRef={userDocRef}
  resetEditMode={resetEditMode}  // Pass the resetEditMode callback
/>
    </div>
  );
}

export default Home;