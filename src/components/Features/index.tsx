import { Key } from "react";
import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = ({ posts }: any) => {
  return (
    <section className="pb-8 pt-20 dark:bg-dark lg:pb-[70px] lg:pt-[120px]">
      <div className="container">
        <SectionTitle
          subtitle="Empowering Your Digital Presence"
          title="Consulting Service"
          paragraph="User-Centric Interfaces & Innovative Web Design."
        />

        <div className="-mx-4 mt-12 flex flex-wrap lg:mt-20">
          {posts.map((key: unknown, i: Key | null | undefined) => (
            <SingleFeature key={i} feature={key} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
