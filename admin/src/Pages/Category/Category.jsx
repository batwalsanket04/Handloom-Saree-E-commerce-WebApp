import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";


const Category = () => {


  const [image,setImage]=useState(null);
  const [name,setName]=useState("");
  const [loading,setLoading]=useState(false)
  const [categories,setCategories]=useState([]);

  const [editId,setEditId]=useState(null);



  const resetForm = () => {
  setName("");
  setImage(null);
  setEditId(null);
};



  // GET CATEGORIES

 const fetchCategories=async()=>{

try{

setLoading(true);


const res=await api.get("/category/list");

setCategories(res.data.categories);


}catch(error){

console.log(error);

toast.error("Failed to load categories");


}
finally{

setLoading(false);

}

};



  useEffect(()=>{

    fetchCategories();

  },[]);





  // CREATE / UPDATE

const submit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    if (!name) {
      toast.error("Category name required");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);

    if (image) {
      formData.append("image", image);
    }


    let res;


    if (editId) {

      res = await api.put(
        `/category/update/${editId}`,
        formData
      );

      toast.success("Category Updated Successfully");
      resetForm();
      


    } else {


      if (!image) {
        toast.error("Category image required");
        return;
      }


      res = await api.post(
        "/category/create",
        formData
      );


      toast.success("Category Added Successfully");
      resetForm()

    }



    if(res.data.success){

      setName("");
      setImage(null);
      setEditId(null);

      fetchCategories();

    }


  } catch(error){

    console.log(
      "Category Error:",
      error.response?.data || error.message
    );


    toast.error(
      error.response?.data?.message ||
      "Something went wrong"
    );


  } finally {

    setLoading(false);

  }

};







  // DELETE

const deleteCategory = async(id)=>{

try{

await api.delete(`/category/${id}`);


toast.success("Category deleted");
resetForm();

fetchCategories();


}catch(error){

console.log(error);

toast.error(
error.response?.data?.message || "Delete failed"
);

}

};




  // EDIT

  const editCategory=(item)=>{


    setEditId(item.id);

    setName(item.name);

    setImage(null);


  };




return (

<div className="h-[calc(100vh-80px)] overflow-y-auto bg-gray-100 p-6 mt-10">
 


<h1 className="text-4xl font-bold text-center text-pink-600 mb-8">
  Manage Categories
</h1>



{/* FORM SECTION */}

<div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 mb-10">


<h2 className="text-2xl font-bold mb-6 text-gray-800">

{editId ? "Update Category" : "Add Category"}

</h2>



<form 
onSubmit={submit}
className="space-y-5"
>


<div>

<label className="font-medium text-gray-700">
Category Name
</label>


<input

type="text"

value={name}

onChange={(e)=>setName(e.target.value)}

placeholder="Enter category name"

className="w-full mt-2 border rounded-lg p-3 focus:ring-2 focus:ring-pink-500"

 />


</div>




<div>

<label className="font-medium text-gray-700">
Category Image
</label>


<input

type="file"

accept="image/*"

onChange={(e)=>setImage(e.target.files[0])}

className="w-full mt-2"

 />

</div>




{
image &&

<div className="mt-4">

<img

src={URL.createObjectURL(image)}

className="w-32 h-32 rounded-xl object-cover border"

/>

</div>

}


<button
type="submit"
disabled={loading}
className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold"
>
{
loading
?
"Processing..."
:
editId
?
"Update Category"
:
"Add Category"
}

</button>



</form>


</div>





{/* TABLE SECTION */}


<div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8">


<h2 className="text-2xl font-bold mb-6">
Category List
</h2>



<div className="overflow-x-auto">


<table className="w-full border-collapse">


<thead>


<tr className="bg-gray-100">


<th className="p-3 text-left">
Image
</th>


<th className="p-3 text-left">
Name
</th>


<th className="p-3 text-left">
Status
</th>


<th className="p-3 text-center">
Action
</th>


</tr>


</thead>




<tbody>


{
categories.map((item)=>(


<tr 
key={item.id}
className="border-b hover:bg-gray-50"
>



<td className="p-3">


<img

src={item.image}

className="w-16 h-16 rounded-lg object-cover"

/>


</td>




<td className="p-3 font-semibold">

{item.name}

</td>





<td className="p-3">


<span

className={`px-3 py-1 rounded-full text-sm ${
item.status
?
"bg-green-100 text-green-600"
:
"bg-red-100 text-red-600"
}`}

>


{
item.status
?
"Active"
:
"Inactive"
}


</span>


</td>





<td className="p-3 text-center">


<button

onClick={()=>editCategory(item)}

className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"

>

Edit

</button>




<button

onClick={()=>deleteCategory(item.id)}

className="bg-red-500 text-white px-4 py-2 rounded-lg"

>

Delete

</button>



</td>



</tr>


))

}



</tbody>


</table>


</div>


</div>



</div>

);


};


export default Category;