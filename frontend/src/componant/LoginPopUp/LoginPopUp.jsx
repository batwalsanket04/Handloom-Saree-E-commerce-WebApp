// src/components/LoginPopUp.jsx
import React, { useContext, useState } from "react";
 import { context } from "../../Context/StoreContext";
import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import api from "../../api/axios";

const LoginPopUp = ({ setShowLogine }) => {
 const { login } = useContext(context);
  const [currState, setCurrState] = useState("Sign Up");
  const [loading,setLoading]=useState(false);
  const [errors,setErrors]=useState({});
  const [data, setData] = useState({ name: "", email: "", password: "" });

  const toggleForm = () => setCurrState(currState === "Sign Up" ? "Sign In" : "Sign Up");

  const formHandle = (e) => {

const { name, value } = e.target;


setData({
 ...data,
 [name]:value
});


setErrors({
 ...errors,
 [name]:""
});

};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
    const endpoint =
currState === "Sign Up"
? "/user/register"
: "/user/login";


const payload =
  currState === "Sign Up"
    ? data
    : { email: data.email, password: data.password };

const res = await api.post(endpoint, payload);
if(res.data.success){

  login(
    res.data.user,
    res.data.accessToken
  );


  setShowLogine(false);

  toast.success(
    currState === "Sign Up"
    ? "Account created successfully!"
    : "Logged in successfully!"
  );

}
else{

 toast.error(res.data.message);

}
    } catch (err) {

const status = err.response?.status;

const validationErrors = err.response?.data?.errors;


if(status === 429){

setErrors({
  email: err.response.data.message
});

return;

}


if(validationErrors && typeof validationErrors === "object"){

setErrors(validationErrors);

}


else if(currState === "Sign In" && status === 401){

setErrors({
password:"Invalid email or password"
});

}

else{

toast.error(
err.response?.data?.message || "Something went wrong"
);

}

}finally{
  setTimeout(()=>{

    setLoading(false)

  },1000)
}
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
  <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 sm:p-8 relative overflow-y-auto max-h-[90vh]">
    <button
      onClick={() => setShowLogine(false)}
      className="absolute top-3 right-3 text-gray-600 hover:text-pink-600 text-xl"
    >
      <FaXmark />
    </button>

    <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">
      {currState}
    </h2>

    <form onSubmit={handleSubmit} className="space-y-5">
      {currState === "Sign Up" && (
        <div>
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-1"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={formHandle}
            id="name"
            placeholder="Enter your name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600 transition"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-gray-700 font-medium mb-1"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={formHandle}
          id="email"
          placeholder="Enter your email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600 transition"
        />
        {
errors.email && (

<p className="text-red-500 text-sm mt-1">
{errors.email}
</p>

)
}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-gray-700 font-medium mb-1"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={formHandle}
          id="password"
          placeholder="Enter your password"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600 transition"
        />
       {
errors.password && (

<p className="text-red-500 text-sm mt-1">
{errors.password}
</p>

)
}
      </div>

     <button
type="submit"
disabled={loading}
className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 rounded-full"
>

{
loading 
?
"Please wait..."
:
currState === "Sign Up"
?
"Create Account"
:
"Login"
}

</button>
    </form>

    <p className="mt-6 text-center text-gray-500 text-sm">
      {currState === "Sign Up"
        ? "Already have an account?"
        : "Don't have an account?"}{" "}
      <button
        type="button"
        onClick={toggleForm}
        className="text-pink-600 font-medium hover:underline"
      >
        {currState === "Sign Up" ? "Sign In" : "Sign Up"}
      </button>
    </p>
  </div>
</div>

  );
};

export default LoginPopUp;
