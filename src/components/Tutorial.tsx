
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

const scriptCode = `
`;


interface Step {
  title: string;
  description: React.ReactNode;
  image?: string;
}

const Tutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: Step[] = [
    {
      title: "Log in to Instagram",
      description: (
        <div>
          <p className="mb-4">
            First, log in to your Instagram account through the web browser.
            Make sure you're logged in at <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">instagram.com</a>.
          </p>
        </div>
      )
    },
    {
      title: "Open Developer Tools",
      description: (
        <div>
          <p className="mb-4">
            Open your browser's developer tools:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Chrome/Edge:</strong> Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">F12</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Shift+I</kbd> (Windows/Linux) or <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Cmd+Option+I</kbd> (Mac)</li>
            <li><strong>Firefox:</strong> Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">F12</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Shift+I</kbd></li>
            <li><strong>Safari:</strong> First enable Developer Tools in Safari's Advanced settings, then press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Cmd+Option+I</kbd></li>
          </ul>
          <div className="p-3 mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <p className="text-sm">
              <strong>Note:</strong> If pasting is blocked, type{" "}
              <span className="px-1 py-0.5 bg-gray-200 rounded text-xs font-mono">
                allow pasting
              </span>{" "}
              in the console and press{" "}
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> before
              trying again.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Navigate to the Console Tab",
      description: (
        <div>
          <p className="mb-4">
            In the developer tools that opened, click on the "Console" tab. This is where you'll paste the script.
          </p>
        </div>
      )
    },
    {
      title: "Copy the Script",
      description: (
        <div>
          <p className="mb-4">
            Copy the following script by clicking the copy button in the top-right corner of the code block:
          </p>
          <CodeBlock code={scriptCode} className="my-4" />
        </div>
      )
    },
    {
      title: "Paste and Run the Script",
      description: (
        <div>
          <p className="mb-4">
            Paste the script into the console and press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to run it.
          </p>
          <p className="mb-4">
            The script will start running and will generate a list of Instagram users who don't follow you back.
          </p>
        </div>
      )
    },
    {
      title: "View the Results",
      description: (
        <div>
          <p className="mb-4">
            The script will output a list of usernames in the console. These are the accounts that you follow but who don't follow you back.
          </p>
          <p className="mb-4">
            The results will be displayed with the message "Lijst van te \"populaire\" personen" followed by the usernames.
          </p>
          <p className="text-sm text-muted-foreground">
            Note: The script may take some time to run if you follow a large number of accounts. It processes accounts in batches to avoid being rate-limited by Instagram.
          </p>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 md:py-24" id="tutorial">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          Step-by-Step Guide
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
          How to Find Non-Followers
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Follow these simple steps to discover who doesn't follow you back on Instagram.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-1 space-y-2">
          {steps.map((step, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "w-full text-left p-4 rounded-lg transition-all duration-300 flex items-center",
                currentStep === index 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-secondary/50 hover:bg-secondary"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={cn(
                "flex items-center justify-center w-7 h-7 rounded-full mr-3 text-xs",
                currentStep === index 
                  ? "bg-white text-primary" 
                  : "bg-primary/10 text-primary"
              )}>
                {index + 1}
              </div>
              <span className="font-medium">{step.title}</span>
              {currentStep > index && (
                <CheckCircle size={16} className="ml-auto text-green-500" />
              )}
            </motion.button>
          ))}
        </div>

        <div className="md:col-span-2">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8 glass"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3">
                {currentStep + 1}
              </span>
              {steps[currentStep].title}
            </h3>
            <div className="prose prose-blue max-w-none">
              {steps[currentStep].description}
            </div>
            {steps[currentStep].image && (
              <img 
                src={steps[currentStep].image} 
                alt={steps[currentStep].title} 
                className="rounded-lg mt-6 w-full shadow-md"
              />
            )}
            <div className="flex justify-between mt-8">
              <motion.button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={cn(
                  "px-4 py-2 rounded-lg transition-colors flex items-center gap-2",
                  currentStep === 0 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                )}
                whileHover={currentStep !== 0 ? { scale: 1.02 } : {}}
                whileTap={currentStep !== 0 ? { scale: 0.98 } : {}}
              >
                <ArrowLeft size={16} />
                Previous
              </motion.button>
              <motion.button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
                className={cn(
                  "px-4 py-2 rounded-lg transition-colors flex items-center gap-2",
                  currentStep === steps.length - 1 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-primary hover:bg-primary/90 text-white"
                )}
                whileHover={currentStep !== steps.length - 1 ? { scale: 1.02 } : {}}
                whileTap={currentStep !== steps.length - 1 ? { scale: 0.98 } : {}}
              >
                Next
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
