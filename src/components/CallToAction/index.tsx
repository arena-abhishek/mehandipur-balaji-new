import Link from "next/link";
import Image from 'next/image'; // Import Image component for background image

const CallToAction = () => {
  return (
    <section className="relative z-10 overflow-hidden bg-primary py-20 lg:py-[115px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-black/30">
        <Image
          src='/images/logo/bg1.jpeg' // Replace with your image path
          alt="Background"
          layout="fill"  // Fill the container
          objectFit="cover"  // Ensure it covers the entire container
          className="w-full h-full object-cover mix-blend-overlay"
        />
      </div>

      {/* Content Container */}
      <div className="container mx-auto relative z-20">
        <div className="relative overflow-hidden">
          <div className="-mx-4 flex flex-wrap items-stretch">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[570px] text-center">
                <h2 className="mb-2.5 text-3xl font-bold text-white md:text-[38px] md:leading-[1.44]">
                  <span>Unlock Spiritual Blessings with</span>
                  <span className="text-3xl font-normal md:text-[40px]">
                    {" "}
                    Mehandipur Balaji{" "}
                  </span>
                </h2>
                <p className="mx-auto mb-6 max-w-[515px] text-base leading-[1.5] text-white">
                  Sawamani, Arji, Chola Booking. Contact for bookings. Pure prasad. Book online now.
                </p>
                <Link
                  href="/about"
                  className="inline-block rounded-md border border-transparent bg-secondary px-7 py-3 text-base font-medium text-white transition hover:bg-[#0BB489]"
                >
                  Get More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default CallToAction;
