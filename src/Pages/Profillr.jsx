// Import necessary modules
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, sendEmailVerification, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt } from 'react-icons/fa';
const UserProfile = () => {
  const auth = getAuth();
  const db = getFirestore();
  const [user, setUser] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // Fetch user information on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          setPhotoPreview(userSnap.data().photoURL || 'https://via.placeholder.com/150');
        } else {
          setPhotoPreview('https://via.placeholder.com/150');
        }
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  // Handle sending email verification
  const handleSendVerification = async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      setVerificationSent(true);
      toast.success('Verification email sent!');
    }
  };

  // Handle updating user profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const { displayName } = e.target.elements;

    try {
      let photoURL = photoPreview;

      if (photo) {
        // Save photo to Firestore
        const userDoc = doc(db, 'users', user.uid);
        const fileReader = new FileReader();
        fileReader.onloadend = async () => {
          const base64Photo = fileReader.result;
          await setDoc(userDoc, { displayName: displayName.value, photoURL: base64Photo }, { merge: true });
          setPhotoPreview(base64Photo);
        };
        fileReader.readAsDataURL(photo);
      } else {
        // Update just the display name
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, { displayName: displayName.value }, { merge: true });
      }

      await updateProfile(user, {
        displayName: displayName.value,
        photoURL,
      });

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <ToastContainer />
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>User Profile</h1>
      <div style={{ display: 'relative', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={photoPreview}
          alt="Profile"
          style={{ borderRadius: '50%', width: '100px', height: '100px', objectFit: 'cover', marginBottom: '10px' }}
        />
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>{user.displayName || 'Anonymous User'}</h2>
        </div><p>Email: {user.email}</p>
        <p>Status: {user.emailVerified ? 'Verified' : 'Not Verified'}</p>

        {!user.emailVerified && !verificationSent && (
          <button
            onClick={handleSendVerification}
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Send Verification Email
          </button>
        )}
        {verificationSent && <p style={{ color: 'green', marginTop: '10px' }}>A verification email has been sent!</p>}
       
      <FaPencilAlt
          style={{ cursor: 'pointer', fontSize: '20px', color: '#007bff' }}
          onClick={handleEditToggle}
        />
    </div>
      
      {isEditing && (
        <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 style={{ marginBottom: '10px' }}>Edit Profile</h3>
      <form onSubmit={handleUpdateProfile} style={{ marginTop: '20px', textAlign: 'left' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Display Name:</label>
          <input
            type="text"
            name="displayName"
            placeholder="Display Name"
            defaultValue={user.displayName}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Profile Photo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Update Profile
        </button>
        <button
              type="button"
              onClick={handleEditToggle}
              style={{
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginLeft: '10px',
              }}
            >
              Cancel
            </button>
      </form>
    </div>)}
    </div>
  );
};

export default UserProfile;
