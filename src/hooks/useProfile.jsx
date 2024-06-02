import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";
//

export const useProfile = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user._id) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/${user._id}`);
          setProfile(response.data);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfile(null);
        }
      } else {
        console.log('No user or user ID available');
      }
    };

    fetchProfile();
  }, [user]);

  return { profile };
};
