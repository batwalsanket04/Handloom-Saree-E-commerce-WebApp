import React, { useState } from "react";
import ExploreMenu from "../../componant/ExploreMenu/ExploreMenu";
import SareeDisplay from "../../componant/SareeDisplay/SareeDisplay";
import Header from "../../componant/Header/Header";

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div className="pt-[50px]">
      <Header/>
      <ExploreMenu category={category} setCategory={setCategory} />
      <SareeDisplay category={category} />
    </div>
  );
};

export default Home;
