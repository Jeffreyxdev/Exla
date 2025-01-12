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
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([]);
 
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

  



  return (
    <div style={{ maxWidth: '600px', maxHeight:'500px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif',}}>
    <ToastContainer />
   
    <div style={{ marginTop: '20vh' }}>
   <h2 style={{fontFamily:''}}>Listed events</h2>
      <div style={{ maxWidth: '600px', maxHeight:'500px',padding: '20px', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
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
  </div>
  )}  

export default Events ;
