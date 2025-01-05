// Import necessary modules
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt } from 'react-icons/fa';

const Events = () => {
  const auth = getAuth();
  const db = getFirestore();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [containerStyle, setContainerStyle] = useState([{  background: 'linear-gradient(to right, #ff7e5f, #feb47b)',webkitBackgroundClip: 'text',
    webkitTextFillColor: 'transparent',
    filter: 'blur(2px)' }]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const eventsQuery = query(collection(db, 'events'), where('userId', '==', currentUser.uid));
        const eventsSnapshot = await getDocs(eventsQuery);
        const userEvents = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(userEvents);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

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

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <ToastContainer />
    <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>User Profile</h1>
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
      <h2 style={{ fontSize: '20px', margin: '5px 0' }}>{user.displayName || 'Anonymous User'}</h2>
      <p style={{ margin: '5px 0' }}>Email: {user.email}</p>
      <p style={{ margin: '5px 0' }}>Status: {user.emailVerified ? 'Verified' : 'Not Verified'}</p>
    </div>
  
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
                  
                }}
              >{event.eventImage && <img src={event.eventImage} alt="Event" style={{ width: '100%', borderRadius: '5px' }} />}
                <strong>{event.eventName}</strong>
                <p>Date: {event.eventDate}</p>
                <p>Price: ${event.ticketPrice}</p>
                
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
        backgroundColor: '#ff9800',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
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
              name="ticketPrice"
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
    <div
      style={{
        fontSize: '40px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '30px',
        background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
        webkitBackgroundClip: 'text',
        webkitTextFillColor: 'transparent',
        filter: 'blur(2px)',
      }}
    >
    
    </div>
  </div>
  )}  

export default Events ;
