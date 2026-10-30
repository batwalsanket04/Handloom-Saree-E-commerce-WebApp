    import React, { useEffect, useState } from "react";
    import api from "../../api/axios";
    import { toast } from "react-toastify";


    const AboutEdit = () => {


    const [loading,setLoading] = useState(false);



    const [image,setImage] = useState(null);

    const [preview,setPreview] = useState("");



    const [form,setForm] = useState({

    title:"",
    subtitle:"",
    description1:"",
    description2:"",
    description3:"",
    description4:"",
    buttonText:"",
    buttonLink:""

    });




    // GET ABOUT DATA

    const getAbout = async()=>{

    try{

    const res = await api.get("/about");


    const about = res.data.about;


    setForm({

    title:about.title || "",
    subtitle:about.subtitle || "",
    description1:about.description1 || "",
    description2:about.description2 || "",
    description3:about.description3 || "",
    description4:about.description4 || "",
    buttonText:about.buttonText || "",
    buttonLink:about.buttonLink || ""

    });


    setPreview(about.image);


    }
    catch(error){

    console.log(error);

    toast.error("Unable to load about");

    }


    };



    useEffect(()=>{

    getAbout();

    },[]);

    const clearForm = () => {

    setForm({

    title:"",
    subtitle:"",
    description1:"",
    description2:"",
    description3:"",
    description4:"",
    buttonText:"",
    buttonLink:""

    });


    setImage(null);

    setPreview("");

    };





    const handleChange=(e)=>{


    setForm({

    ...form,

    [e.target.name]:e.target.value

    });


    };





    // UPDATE ABOUT


    const handleSubmit=async(e)=>{

    e.preventDefault();


    try{


    setLoading(true);



    const data = new FormData();



    Object.entries(form).forEach(([key,value])=>{

    data.append(
    key,
    value
    );

    });



    if(image){

    data.append(
    "image",
    image
    );

    }




    const res = await api.put(
    "/about/update",
    data
    );



    if(res.data.success){

    toast.success(
    "About updated successfully"
    );

    clearForm();
    

 
    

    }



    }
    catch(error){

    console.log(error);


    toast.error(
    error.response?.data?.message ||
    "Update failed"
    );


    }
    finally{

    setLoading(false);

    }


    };





    return (

    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-100 p-6 mt-10">


    <h1 className="text-4xl font-extrabold text-center text-pink-700 mb-10">

    Edit About Section

    </h1>



    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">


    <form
    onSubmit={handleSubmit}
    className="space-y-6"
    >



    {/* Title */}

    <div>

    <label className="text-gray-700 font-semibold">

    Heading Title

    </label>


    <input

    name="title"

    value={form.title}

    onChange={handleChange}

    placeholder="Enter title"

    className="
    w-full
    mt-2
    border
    border-pink-200
    rounded-xl
    p-3
    focus:ring-2
    focus:ring-pink-500
    outline-none
    "

    />

    </div>





    {/* Subtitle */}

    <div>

    <label className="text-gray-700 font-semibold">

    Subtitle

    </label>


    <input

    name="subtitle"

    value={form.subtitle}

    onChange={handleChange}

    placeholder="Enter subtitle"

    className="
    w-full
    mt-2
    border
    border-pink-200
    rounded-xl
    p-3
    focus:ring-2
    focus:ring-pink-500
    outline-none
    "

    />

    </div>






    {/* Description */}

    {
    [
    "description1",
    "description2",
    "description3",
    "description4"

    ].map((item,index)=>(


    <div key={item}>


    <label className="text-gray-700 font-semibold">

    Paragraph {index+1}

    </label>


    <textarea

    name={item}

    value={form[item]}

    onChange={handleChange}

    rows="4"

    placeholder={`Enter paragraph ${index+1}`}

    className="
    w-full
    mt-2
    border
    border-pink-200
    rounded-xl
    p-3
    focus:ring-2
    focus:ring-pink-500
    outline-none
    resize-none
    "

    />


    </div>


    ))

    }







    {/* Button */}

    <div className="grid md:grid-cols-2 gap-5">


    <div>

    <label className="text-gray-700 font-semibold">

    Button Text

    </label>


    <input

    name="buttonText"

    value={form.buttonText}

    onChange={handleChange}

    className="
    w-full
    mt-2
    border
    border-pink-200
    rounded-xl
    p-3
    focus:ring-2
    focus:ring-pink-500
    outline-none
    "

    />

    </div>




    <div>

    <label className="text-gray-700 font-semibold">

    Button Link

    </label>


    <input

    name="buttonLink"

    value={form.buttonLink}

    onChange={handleChange}

    className="
    w-full
    mt-2
    border
    border-pink-200
    rounded-xl
    p-3
    focus:ring-2
    focus:ring-pink-500
    outline-none
    "

    />

    </div>


    </div>







    {/* Image Upload */}

    <div>


    <label className="text-gray-700 font-semibold">

    About Image

    </label>


    <input

    type="file"

    accept="image/*"

    onChange={(e)=>{

    const file=e.target.files[0];

    setImage(file);

    setPreview(
    URL.createObjectURL(file)
    );

    }}

    className="
    w-full
    mt-2
    border
    border-pink-200
    rounded-xl
    p-3
    "

    />


    </div>







    {/* Preview */}

    {
    preview &&

    <div className="flex justify-center">


    <img

    src={preview}

    alt="About Preview"

    className="
    w-48
    h-48
    rounded-2xl
    object-cover
    shadow-lg
    border-4
    border-pink-100
    "

    />


    </div>

    }





    <button

    disabled={loading}

    className="
    w-full
    bg-pink-600
    hover:bg-pink-700
    text-white
    py-3
    rounded-full
    font-semibold
    shadow-md
    hover:shadow-lg
    transition-all
    duration-300
    "

    >


    {
    loading
    ?
    "Updating..."
    :
    "Update About"
    }


    </button>



    </form>


    </div>


    </div>

    );


    };


    export default AboutEdit;