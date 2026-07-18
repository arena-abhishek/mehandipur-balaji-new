// import { service } from "@/types/global";
import { Menu } from "@/types/menu";
// home, booking, Gallery, Blog, about us, contact us 
const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  // {
  //   id: 1,
  //   title: "DashBoard",
  //   path: "/admin",
  //   newTab: false,
  // },
  {
    id: 3,
    title: "Booking",
    path: "/booking",
    newTab: false,
  },


  // {
  //   id: 3,
  //   title: "FAQ",
  //   path: "/pricing",
  //   newTab: false,
  // },
  {
    id: 5,
    title: "Gallery",
    path: "/gallery",
    newTab: false,
  },
  {
    id: 5,
    title: "Blog",
    path: "/blogs",
    newTab: false,
  },
  {
    id: 6,
    title: "About us",
    newTab: false,
    path: "/about",


  },
  {
    id: 5,
    title: "Contact Us",
    path: "/contact",
    newTab: false,
  },

];
export default menuData;
