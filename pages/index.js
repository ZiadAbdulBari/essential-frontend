import Section from "@/components/Section/Section";
import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "@/layout/MainLayout";
import { ToastContainer, toast } from "react-toastify";
import CommonSlider from "@/components/CommonSlider/CommonSlider";
import CategorySection from "@/components/Home/CategorySection";
import Promotion from "@/components/Home/Promotion";
import { useDispatch } from "react-redux";
import { getLoggedinStatus, getToken } from "@/store/authSlice";
import { getCartProduct } from "@/store/cartSlice";
import HomePageSlider from "@/components/SwiperSlider/HomePageSlider";
export default function Home() {
  const dispatch = useDispatch();
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const getSection = () => {
    const URL = `${process.env.baseurl}/get-section`;
    axios
      .get(URL)
      .then((response) => {
        if (response?.data?.status == 200) {
          setSections(response?.data?.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getSliderImage = () => {
    const img = [
      "../image/banner-1.jpg",
      "../image/banner-2.jpg",
      // "../image/banner-3.jpg",
    ];
    setImages(img);
  };
  const homepageCategory = () => {
    axios.get(`${process.env.baseurl}/get-category`).then((response) => {
      if (response?.data?.status == 200) {
        setCategories(response?.data?.categories);
      }
    });
  };
  useEffect(() => {
    dispatch(getLoggedinStatus());
    dispatch(getToken());
  }, []);
  useEffect(() => {
    homepageCategory();
    getSliderImage();
    getSection();
  }, []);
  return (
    <MainLayout>
      {/* <CommonSlider images={images} /> */}
      <HomePageSlider images={images}/>
      {/* CATEGORY */}
      {categories.length > 0 ? (
        <div className="lg:container mx-auto grid grid-flow-row xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xs:gap-0 sm:lg:gap-4 lg:gap-6 my-[50px] lg:my-[100px] max-h-[300px] overflow-hidden">
          {categories.map((cat) => (
            <CategorySection
              id={cat.id}
              iURL={cat.image_url}
              name={cat.category_name}
              key={cat.id}
            />
          ))}
        </div>
      ) : (
        <div>
          <p className="text-center font-medium text-[18px] text-gary-600">
            Categories are not found
          </p>
        </div>
      )}
      <div className="lg:container mx-auto w-full">
        {sections.length > 0 ? (
          sections.map((section, index) => (
            <Section
              key={index}
              id={section.id}
              sectionName={section.section_name}
              count="0"
              products={section.products}
            />
          ))
        ) : (
          <div>
            <p className="text-center font-medium text-[18px] text-gary-600">
              Products are not found
            </p>
          </div>
        )}
      </div>
      {/* <div className="my-[100px]">
        <Promotion pIURL="https://images.unsplash.com/photo-1511511450040-677116ff389e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80" />
      </div> */}
    </MainLayout>
  );
}
