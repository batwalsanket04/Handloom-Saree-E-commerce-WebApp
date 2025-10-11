import React, { useState } from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import axios from "axios";

const Contact = () => {

    const [contact,setContact]=useState({uname:"",email:"",phone:"",message:""})



    const handleForm=(e)=>
    {
        const {name,value}=e.target;

        setContact({...contact,[name]:value})
        console.log(e.target.value);


    }

    const handleSubmit=async(e)=>
    {
        e.preventDefault();
        console.log(contact)
  
        try{
         await axios.post('http://localhost:3000/Contact',contact)

         console.log("data Saved:",contact)

         window.confirm("Message Send Successfully");

         setContact({uname:"",email:"",phone:"",message:""})

        } catch (err)
        {
          alert("Data Sending failed..")
          console.log("Error:",err);
        }
    }


  return (
    <section className="pt-[100px] pb-20 bg-pink-50" id="contact">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-pink-700 mb-8 text-center">
          Contact Us
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-4">
              <MapPin className="text-pink-600" />
              <p className="text-gray-700">Kala Maruti Road, Yeola, India</p>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="text-pink-600" />
              <p className="text-gray-700">+91 8805857546</p>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="text-pink-600" />
              <p className="text-gray-700">support@gmail.com</p>
            </div>

            <p className="text-gray-600">
              We’re here to answer your queries and help you pick the perfect saree. 
              Reach out to us anytime and we’ll get back to you promptly.
            </p>
          </div>

          {/* Contact Form */}
          <form className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="uname"
              id="uname"
              value={contact.uname}
              onChange={(e)=>handleForm(e)}
              placeholder="Your Name"
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            
            <input
              type="tel"
              name="phone"
              id="phone"
              onChange={(e)=>handleForm(e)}

              value={contact.phone}
              placeholder="Your phone"
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e)=>handleForm(e)}

              value={contact.email}
              placeholder="Your Email"
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <textarea
              placeholder="Your Message"
              name="message"
              id="message"
              onChange={(e)=>handleForm(e)}

              value={contact.message}
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-pink-400 h-32 resize-none"
              required
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
             
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Optional Map Section */}
        <div className="mt-12">
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=yeola&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-64 rounded-xl shadow-md"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;
