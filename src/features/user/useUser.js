// User authentication and profile
export const userSlice = {
  state: {
    isAuthenticated: false,
    user: null,
    profile: {},
  },
};

// useUser hook
export const useUser = () => {
  const isAuthenticated = false;
  const user = null;

  const login = (email, password) => {
    console.log(`Logging in user: ${email}`);
  };

  const register = (email, password, name) => {
    console.log(`Registering user: ${email}`);
  };

  const logout = () => {
    console.log("User logged out");
  };

  const getProfile = () => {
    console.log("Fetching user profile");
  };

  const updateProfile = (newData) => {
    console.log("Profile updated:", newData);
  };

  return {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    getProfile,
    updateProfile,
  };
};

export default useUser;
