
import React, { ReactNode, createContext, useContext, useState, FC } from "react";
import { facebookLink } from "./global";

// Define the structure of the configuration
interface Metadata {
  title: string;
  description: string;
  og_image: string;
  og_title: string;
  og_description: string;
  og_url: string;
  meta_keywords: string;
  meta_description: string;
  meta_author: string;
  facebookLink: string;
  twitterLink: string;
  instagramLink: string;
  linkdingLink: string;



  twitter_card: string;
  twitter_site: string;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  bottomDescription: string | null;
  mainCategory: [];


}

interface GlobalConfigContextType {
  whatsappNumber: string;
  metadata: Metadata;
  setWhatsappNumber: (value: string) => void;
  setMetadata: (value: Metadata) => void;
}

// Create context
const GlobalConfigContext = createContext<GlobalConfigContextType | null>(null);

// Create provider
export const GlobalConfigProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [whatsappNumber, setWhatsappNumber] = useState<string>("9887406806");
  const [metadata, setMetadata] = useState<Metadata>({
    title: "",
    description: "",
    og_image: "",
    og_title: "",
    og_description: "",
    og_url: "",
    meta_keywords: "",
    meta_description: "",
    meta_author: "",
    twitter_card: "",
    twitter_site: "",
    twitter_title: null,
    twitter_description: null,
    twitter_image: null,
    bottomDescription: '',
    facebookLink: '',
    twitterLink: '',
    instagramLink: '',
    linkdingLink: '',
    mainCategory: []

  });

  return (
    <GlobalConfigContext.Provider value={{ whatsappNumber, metadata, setWhatsappNumber, setMetadata }}>
      {children}
    </GlobalConfigContext.Provider>
  );
};

// Custom hook to use the context
export const useGlobalConfig = () => {
  const context = useContext(GlobalConfigContext);
  if (!context) {
    throw new Error("useGlobalConfig must be used within a GlobalConfigProvider");
  }
  // console.log("data update hua kya", context.metadata.mainCategory)
  return context;
};


// globalConfig.ts
// utils/getGlobalConfig.ts
// /utils/getGlobalConfig.ts or /types/GlobalConfigContext.ts
export const getGlobalConfig = () => {
  return {
    metadata: {
      title: "",
      description: "",
      og_title: "",
      og_description: "",
      og_image: "",
      twitter_card: "",
      twitter_title: "",
      twitter_description: "",
      twitter_image: "/images/twitter-image.jpg",
      facebookLink: "",

    },
  };
};