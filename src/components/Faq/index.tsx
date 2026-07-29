
'use client'
import { useEffect, useState } from "react";
import SingleFaq from "./SingleFaq";
import axios from "axios";
interface Faq {
  id: string;
  questions: string;
  answer: string;
}
const Faq = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);

  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(`/api/faq`);
        setFaqs(response.data.faqs);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setError("Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) return <p>Loading FAQs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="relative z-20 overflow-hidden bg-white pb-8 pt-0 dark:bg-dark lg:pb-[10px] lg:pt-[10px]">
      <div className="container mx-auto px-4 text-center">
        <span className="mb-2 block text-xl font-semibold text-primary">
          FAQ
        </span>

        <div className="-mx-4 mt-[60px] flex flex-wrap lg:mt-20">
          {faqs.length > 0 ? (
            faqs.map((faq, index) => (
              <div key={faq.id} className="w-full px-4 lg:w-1/2">
                <SingleFaq question={faq.questions} answer={faq.answer} />
              </div>
            ))
          ) : (
            <p>No FAQs available</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Faq;
