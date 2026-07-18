export let whatsapp_number: string = "+91 85598 33140";
export let bottomDescription: string = '';
export let facebookLink: string = "";
export let twitterLink: string = "";
export let instagramLink: string = "";
export let linkdingLink: string = "";
export let titleMata: string = "";



// export let service: any =  [
//   {
//       "configId": 9,
//       "serviceId": 2,
//       "service": {
//           "id": 2,
//           "title": "Web Design Development",
//           "slug": "web-design-development",
//           "content": "<p><span style=\"color: rgb(206, 145, 120);\">We convey web advancement benefits that unequivocally line up with your client's prerequisites. Our devoted group of website specialists will take you through the whole task life cycle will start with prerequisite investigation to arranging, ease of use (UX).</span></p>",
//           "metaTitle": null,
//           "metaDescription": null,
//           "featuredImage": "/uploads/e516485a-da2f-41bf-976c-3a0965678335",
//           "featuredImageAltText": null,
//           "authorId": 11,
//           "publishedAt": "2025-01-04T17:16:08.367Z",
//           "updatedAt": "2025-01-05T13:23:46.618Z",
//           "status": "Published",
//           "views": 0,
//           "likes": 0,
//           "icon": null
//       }
//   }
// ];











export const updateData = (data: any) => {
  whatsapp_number = data.whatsapp_number;
  bottomDescription = data.bottomDescription;
  facebookLink = data.facebookLink;
  twitterLink = data.twitterLink;
  instagramLink = data.instagramLink;
  linkdingLink = data.linkdingLink;
  // service = data.services?.map((entry: any) => ({
  //   id: entry.service.id,
  //   title: entry.service.title,
  //   slug: entry.service.slug,
  //   content: entry.service.content,
  //   featuredImage: entry.service.featuredImage,
  // })) || [];
  // console.log(`call data is ${service.length}`)  
  titleMata = data.title;





};