import React from "react";
import SimpleImageSlider from "react-simple-image-slider";
const Home = () => {
   const sliderImages = [
      '/hero3.webp',
      '/hero4.webp',
      '/hero5.webp',
   ];
   return (
      <div>
        
         <SimpleImageSlider
            width='100%'
            height={710}
            images={sliderImages}
            showNavs={true}
         />
      </div>
   );
}
export default Home;