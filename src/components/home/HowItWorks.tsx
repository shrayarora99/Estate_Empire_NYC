import { useState, useEffect } from 'react';

interface Step {
  id: number;
  title: string;
  description: string;
}

export default function HowItWorks() {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Submit Documents Once",
      description: "Upload your documents to our secure platform and get pre-screened for all qualified listings."
    },
    {
      id: 2,
      title: "Get Pre-Screened",
      description: "Our AI-powered system analyzes your credentials and matches you with properties you qualify for."
    },
    {
      id: 3,
      title: "Tour Qualified Units",
      description: "Schedule viewings for properties you're already qualified for, saving time for both you and landlords."
    }
  ]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0D1929] mb-4">How Estate Empire Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform streamlines the rental process for both tenants and landlords, eliminating unnecessary viewings and accelerating the speed-to-lease process.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(step => (
            <div key={step.id} className="bg-gray-50 rounded-xl p-6 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                {step.id}
              </div>
              <h3 className="text-xl font-bold text-[#0D1929] mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              <div className="mt-4">
                <span className="text-[#2563EB] text-sm font-medium flex items-center cursor-pointer">
                  Learn more
                  <i className="fas fa-arrow-right ml-2"></i>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
