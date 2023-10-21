import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwriteConfig";

import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserOnLoad();
  }, []);
  const getUserOnLoad = async () => {
    try {
      const accountdetails = account.get();
      setUser(accountdetails);
    } catch (error) {
      console.log("Error: ", error);
    }
    setLoading(false);
  };

  const handleUserLogin = async (e, credentials) => {
    e.preventDefault();

    try {
      const response = await account.createEmailSession(
        credentials.email,
        credentials.password
      );
      console.log("LOGGED IN:", response);
      const accountdetails = account.get();
      setUser(accountdetails);
      navigate("/");
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  const ContextData = {
    user,
    handleUserLogin,
  };

  return (
    <AuthContext.Provider value={ContextData}>
      {loading ? <p>Loading Please Wait...</p> : children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
export default AuthContext;
