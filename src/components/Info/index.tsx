// TempleSchedule.jsx
import React from 'react';

const TempleSchedule = () => {
  return (
    <section className="py-12  dark:bg-dark-2 bg-gray-50 ">
            <div className="container mx-auto px-4 mx-auto p-6 mb-10 mt-10 rounded-xl bg-gradient-to-r from-orange-300 to-orange-500 shadow-lg shining">
    {/* <div className="max-w-7xl  mx-auto p-6 mb-10 mt-10 rounded-xl bg-gradient-to-r from-orange-300 to-orange-500 shadow-lg shining"> */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Details */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-4">Details</h2>
          <ul className="space-y-4">
            <li className="text-white">सुबह की आरती</li>
            <li className="text-white">प्रातः कालीन दर्शन</li>
            <li className="text-white">श्री बालाजी को राजभोग</li>
            <li className="text-white">दोपहर के दर्शन</li>
            <li className="text-white">शाम की आरती</li>
            <li className="text-white">मंदिर के कपाट बंद होने का समय</li>
          </ul>
        </div>
        
        {/* White border between columns */}
        <div className="hidden md:block w-px bg-white"></div>
        
        {/* Right Column - Timings */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-4">Timings</h2>
          <ul className="space-y-4">
            <li className="text-white">6.00 बजे से 6.40 तक</li>
            <li className="text-white">7.00 बजे से 11.00 बजे तक</li>
            <li className="text-white">11.30 AM से 12.00 PM तक</li>
            <li className="text-white">
              12.00 बजे से 6.50 तक(नोट: सोमवार, बुधवार एवं शुक्रवार को श्री बालाजी के विशेष श्रृंगार (चोला 
              चढ़ाने) हेतु सांय 4:00 बजे से 6:00 बजे तक दर्शन बंद रहते हैं।)
            </li>
            <li className="text-white">6.50 से 7.30 तक</li>
            <li className="text-white">रात्रि 9.00 बजे</li>
          </ul>
        </div>
      </div>
    </div>
    {/* </div> */}
    </section>
  );
};

export default TempleSchedule;