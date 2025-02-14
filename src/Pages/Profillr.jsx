// Import necessary modules
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, sendEmailVerification, updateProfile } from 'firebase/auth';
import {getFirestore, doc, getDoc, collection, query, where, getDocs, addDoc , deleteDoc} from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt } from 'react-icons/fa';
const UserProfile = () => {
  const auth = getAuth();
  const db = getFirestore();
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  
  const [containerStyle, setContainerStyle] = useState([{  background: 'linear-gradient(to right, #ff7e5f, #feb47b)',webkitBackgroundClip: 'text',
    webkitTextFillColor: 'transparent',
    filter: 'blur(2px)' }]);

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
      if (currentUser){
        const eventsQuery = query(collection(db, 'events'), where('userId', '==', currentUser.uid));
        const eventsSnapshot = await getDocs(eventsQuery);
        const userEvents = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(userEvents);
      }
       // Fetch events created by the user
     
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
  const handleAddTicket = async (e) => {
    e.preventDefault();
    const { eventName, eventDate, ticketPrice, eventImage } = e.target.elements;

    const selectedDate = new Date(eventDate.value);
    const today = new Date();
    if (selectedDate < today.setHours(0, 0, 0, 0)) {
      toast.error('Event date cannot be in the past.');
      return;
    }

    try {
      const eventData = {
        userId: user.uid,
        eventName: eventName.value,
        eventDate: eventDate.value,
        ticketPrice: ticketPrice.value,
        eventImage: eventImage.files[0] ? URL.createObjectURL(eventImage.files[0]) : null,
      };

      setContainerStyle({
        background: `url(${eventData.eventImage}) no-repeat center/cover`,
        backgroundSize: 'cover',
        maxHeight:'200px'
      });

      await addDoc(collection(db, 'events'), eventData);

      toast.success('Event added successfully!');
      setIsAdding(false);

      // Refresh events
      const eventsQuery = query(collection(db, 'events'), where('userId', '==', user.uid));
      const eventsSnapshot = await getDocs(eventsQuery);
      const userEvents = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(userEvents);
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event.');
    }
  };

  const handleAddToggle = () => {
    setIsAdding(!isAdding);
  };

  if (!user) {
    return <div>Loading...</div>;
  }
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

  const handleDeleteEvent = async (eventId) => {
    if (toast.confirm('Are you sure you want to delete this event?')) {
      try {
        const eventDoc = doc(db, 'events', eventId);
        await deleteDoc(eventDoc);
  
        // Update the events state after deletion
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  
        toast.success('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event.');
      }
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
    <div style={{ maxWidth: '650px', margin: '0 auto', padding: '20px', }}>
      <ToastContainer />
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>User Profile</h1>
      <div style={{ display: 'relative', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={photoPreview}
          alt="Profile"
          style={{ borderRadius: '50%', width: '100px', height: '100px', objectFit: 'cover', marginBottom: '10px' }}
        />
        <h2 style={{ fontSize: '20px', marginBottom: '15px', marginLeft:'5px',marginTop:'-20px', fontWeight:'bold' }}>{user.displayName || 'Anonymous User'}</h2>
        </div><p className='ml-[110px] mt-[-8.5vh]  ' style={{fontSize:"13px"}}> {user.email}</p>
        <p className='ml-[110px]'style={{fontSize:"13px"}}>Status: {user.emailVerified ? 'Verified' : 'Not Verified'}</p>

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
          style={{ cursor: 'pointer', fontSize: '16px', color: '#000', marginLeft:'313px', marginTop:'-10vh' }}
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
      <form onSubmit={handleUpdateProfile} style={{ marginTop: '20px', textAlign: 'left', maxWidth:'700px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Display Name:</label>
          <input
            type="text"
            name="displayName"
            placeholder="Display Name"
            defaultValue={user.displayName}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Profile Photo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '10px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#f52415',
            color: '#fff',
            marginBottom:'10px',
            padding: '10px 20px',
            borderRadius: '15px',
            cursor: 'pointer',
          }} 
        >
          Update Profile
        </button>
        <button
              type="button"
              onClick={handleEditToggle}
              style={{
                backgroundColor: '#4b5fc5',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '15px',
                cursor: 'pointer',
                marginLeft: '25px',
              }}
            >
              Cancel
            </button>
      </form>
    </div>)}
    <div style={{ marginTop: '30px' }}>
  <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Your Events</h2>
  <div style={{ padding: '20px', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
    {events.length > 0 ? (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map(event => (
          <li
            key={event.id}
            style={{
              marginBottom: '10px',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
              background: 
                
              '#fff',
              backgroundSize: 'cover',
             
            }}
          >
            
            {event.eventImage && (
              <img
                src={event.eventImage}
                alt="Event"
                style={{
                  width: '100%',
                  maxWidth: '140px',
                  maxHeight: '140px',
                  borderRadius: '5px',
                  objectFit: 'cover',
                }}
              />
            )}
            <strong>{event.eventName}</strong>
            <p>Date: {event.eventDate}</p>
            <p>Price: ₦{event.ticketPrice}</p>
            <button
                onClick={() => handleDeleteEvent(event.id)}
                style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                Delete
              </button>
          </li>
        ))}
      </ul>
    ) : (
      <p>No events posted yet.</p>
    )}
  </div>
</div>
        <button
        onClick={handleAddToggle}
          style={{
            display: 'block',
            margin: '20px auto 0',
            backgroundColor: '#ff9800',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          
        >
          + Add Ticket
        </button>
        {isAdding && (
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
          <h3 style={{ marginBottom: '10px' }}>Create Ticket</h3>
          <form onSubmit={handleAddTicket}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Event Name:</label>
              <input
                type="text"
                name="eventName"
                placeholder="Event Name"
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Event Date:</label>
              <input
                type="date"
                name="eventDate"
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Ticket Price:</label>
              <input 
                type="number"
                name="ticketPrice ₦"
                placeholder="Ticket Price"
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Event Image:</label>
              <input
                type="file"
                name="eventImage"
                accept="image/*"
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
              Add Event
            </button>
            <button
              type="button"
              onClick={handleAddToggle}
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
        </div>
        )}
      
    </div>
    
  );
};

export default UserProfile;
