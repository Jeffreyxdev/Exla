// Import necessary modules
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, sendEmailVerification, updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';
const UserProfile = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);

  // Fetch user information on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const logout()
  // Handle sending email verification
  const handleSendVerification = async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      setVerificationSent(true);
    }
  };

  // Handle updating user profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const { displayName, photoURL ,Name } = e.target.elements;

    try {
      await updateProfile(user, {
        displayName: displayName.value,
        Name: Name.value,
        photoURL: photoURL.value,
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('failed to updating profile:');
     
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h1>User Profile</h1>
      <div>
        <img
          src={user.photoURL || 'https://via.placeholder.com/150'}
          alt="Profile"
          style={{ borderRadius: '50%', width: '100px', height: '100px' }}
        />
        <p>{user.Name}</p>
        <p>{user.displayName || 'Anonymous User'}</p>
        
        <p>Status: {user.emailVerified ? 'Verified' : 'Not Verified'}</p>

        {!user.emailVerified && !verificationSent && (
          <button onClick={handleSendVerification} style={{ marginTop: '10px',  color:'red', fontSize:'12px', }}>
           verify your account 
          </button>
        )}
    {verificationSent && <p>A verification email has been sent!</p>}
      </div>

      <form onSubmit={handleUpdateProfile} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="displayName"
            placeholder="Display Name"
            defaultValue={user.displayName}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <input
            type="url"
            name="photoURL"
            placeholder="Photo URL"
            defaultValue={user.photoURL}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>
          Update Profile
        </button>
       
      </form>
      <button onClick={(l) => auth.signOut()}>Log Out</button>
    </div>
  );
};

export default UserProfile;
