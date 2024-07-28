import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "http://10.0.2.2:9029";

const storeName = "Pacific Dwarka";
const email = "monikakumari103@gmail.com";
const userName = "Monika";
const password = "abc123";
const showToken = false;

// Function to retrieve the token
async function getToken() {
   try {
      let token = await AsyncStorage.getItem("token");
      if (!token) {
         const { accessToken } = await handleLogin();
         token = accessToken;
      }
      if (showToken) {
         console.log("Token:", token);
      }

      return token;
   } catch (error) {
      console.error("Failed to get the token", error);
      throw error;
   }
}

// Function to handle login, store token, and retrieve token
async function handleLogin() {
   try {
      const loginRequest = {
         email,
         password,
         storeName,
      };
      const response = await axios.post(
         `${baseURL}/api/auth/login`,
         loginRequest
      );

      // Adjust for the typo in the response
      const accessToken = response.data.accessToken || response.data.acessToken;

      if (!accessToken) {
         throw new Error("No access token in response");
      }

      await AsyncStorage.setItem("token", accessToken);

      return { accessToken };
   } catch (error) {
      console.error("Authentication failed", error);
      throw error;
   }
}

// Axios instance with interceptor to add the token to headers
const api = axios.create({
   baseURL,
});
api.interceptors.request.use(
   async (config) => {
      try {
         const token = await getToken();
         if (token) {
            config.headers.Authorization = `Bearer ${token}`;
         }
         return config;
      } catch (error) {
         console.error("Failed to set Authorization header", error);
         return Promise.reject(error);
      }
   },
   (error) => {
      console.error("Request interceptor error", error);
      return Promise.reject(error);
   }
);

// Functions to fetch data from the API
async function getData(endpoint) {
   try {
      const response = await api.get(endpoint);
      console.log("GET:", endpoint);
      console.log(JSON.stringify(response.data, null, 2));
      console.log();
      return response.data;
   } catch (error) {
      console.error(
         `Failed to fetch protected data from ${endpoint}`,
         error.message
      );
   }
}

// Function to post data to the API
async function postData(endpoint, data = {}) {
   try {
      const response = await api.post(endpoint, data);
      console.log("POST:", endpoint);
      console.log(JSON.stringify(response.data, null, 2));
      console.log();
      return response.data;
   } catch (error) {
      console.error(
         `Failed to post protected data to ${endpoint}`,
         error.message
      );
   }
}

// Function to delete data from the API
async function deleteData(endpoint, data = {}) {
   try {
      const response = await api.delete(endpoint, data);
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
   } catch (error) {
      console.error(`Failed to delete protected data to ${endpoint}`, error);
      throw error;
   }
}

export {
   getData,
   postData,
   deleteData,
   baseURL,
   storeName,
   email,
   userName,
   password,
};

// Automatically authenticate on application startup
handleLogin().catch((error) => {
   console.error("Automatic authentication failed", error);
});
