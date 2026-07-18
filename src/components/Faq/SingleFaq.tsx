import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi"; // Import icons
import parse from "html-react-parser";  // ✅ Import the parser

const SingleFaq = (props: { question: string; answer: string }) => {
  const { question, answer } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggleAnswer = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="mb-6 border-b border-gray-200 pb-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleAnswer}
      >
        <h3 className="text-sm font-medium text-dark dark:text-white sm:text-base lg:text-lg text-left">
          {question}
        </h3>

        {/* Toggle button with + and - icons */}
        <button
          className="text-primary focus:outline-none"
          aria-label="Toggle Answer"
        >
          {isOpen ? (
            <FiMinus className="w-5 h-5" />
          ) : (
            <FiPlus className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Answer is only shown when isOpen is true */}
      {/* {isOpen && (
        <div className="mt-2 text-sm text-gray-600 dark:text-dark-6 text-left">
          <div
            className="prose prose-sm prose-gray max-w-full content-html"  // ✅ Added custom class
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      )} */}

      {isOpen && (
        <div
          className="mt-2 text-sm text-gray-600 dark:text-dark-6 text-left prose prose-sm sm:prose-base text-justify  max-w-full"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
        // <div className="mt-2 text-sm text-gray-600 dark:text-dark-6 text-left">
        //   {/* <div className="prose prose-sm prose-gray max-w-full"> */}
        //   {/* {parse(answer)}  ✅ Render HTML safely */}
        //   {/* </div> */}

        // </div>
      )}

    </div>
  );
};

export default SingleFaq;
