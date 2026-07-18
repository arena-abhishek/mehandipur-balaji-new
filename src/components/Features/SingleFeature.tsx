

const SingleFeature = ({ feature }: { feature: any }) => {
  const { icon, title, content, btn, btnLink } = feature;
  return (
    <div className="w-full px-4 md:w-1/1 lg:w-1/3">
      <div className="wow fadeInUp group mb-12" data-wow-delay=".15s">
        <div className="relative z-10 mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-primary">
          <span className="absolute left-0 top-0 z-[-1] mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-2xl bg-primary bg-opacity-20 duration-300 group-hover:rotate-45"></span>
          <div
            dangerouslySetInnerHTML={{ __html: icon }} // This will inject the raw SVG string
          />
        </div>
        <h3 className="mb-3 text-xl font-bold text-dark dark:text-white">
          {title}
        </h3>
        {/* <p className="mb-8 text-body-color dark:text-dark-6 lg:mb-11"> */}
        <div className="blog-details w-full">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>


      </div>
    </div>
  );
};

export default SingleFeature;


// <Link
// href='/'
// onClick={ConsultationModal}
// className={`relative px-7 py-3 text-base font-medium hover:opacity-70 overflow-hidden rounded-full ${"text-dark dark:text-white"
//   } shine-button`}
// >
// Connect

// {/* Add shine animation */}
// <span className="shine-effect"></span>
// </Link>