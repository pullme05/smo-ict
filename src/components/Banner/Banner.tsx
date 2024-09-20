import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import slide1 from '../../assets/sc1.png';
import slide2 from '../../assets/sc2.png';
import slide3 from '../../assets/sc3.jpg';

const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<any>(null);

  const settings = {
    dots: false, // เราจะสร้าง custom dots เอง
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    draggable: true,
    afterChange: (index: number) => setCurrentSlide(index), // เก็บค่า index ของสไลด์ปัจจุบัน
  };

  const slides = [slide1, slide2, slide3]; // สามารถเพิ่ม slide ได้ (!!อัตราส่วน 4:1: ภาพควรมีขนาด 1920x480 พิกเซล (กว้าง 1920px และสูง 480px!!)

  return (
    <div className="relative w-full overflow-hidden">
      <Slider {...settings} ref={sliderRef}> {/* เชื่อม sliderRef กับ Slider */}
        {slides.map((slide, index) => (
          <div key={index} className="w-full aspect-[4/1.6]"> {/* ปรับ aspect ratio เป็น 4:1 ให้ slide ไม่ใหญ่เกินไป */}
            <img
              src={slide}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
      </Slider>

      {/* Custom Dots */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-3">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => sliderRef.current?.slickGoTo(index)} // ใช้ slickGoTo เพื่อเปลี่ยนสไลด์
            className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 transform ${
              currentSlide === index
                ? 'bg-[#996600] scale-125' // สี #996600 เมื่อ active
                : 'bg-gray-400 hover:bg-[#996600]' // เปลี่ยนเป็นสี #996600 เมื่อ hover
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;