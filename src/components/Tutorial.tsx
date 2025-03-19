
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";

const scriptCode = `function getCookie(b) {
    let c = \`; \${document.cookie}\`,
        a = c.split(\`; \${b}=\`);
    if (2 === a.length) return a.pop().split(";").shift()
}

function sleep(a) {
    return new Promise(b => {
        setTimeout(b, a)
    })
}

function afterUrlGenerator(a) {
    return \`https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables={"id":"\${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24","after":"\${a}"}\`
}

function unfollowUserUrlGenerator(a) {
    return \`https://www.instagram.com/web/friendships/\${a}/unfollow/\`
}
let followedPeople, csrftoken = getCookie("csrftoken"),
    ds_user_id = getCookie("ds_user_id"),
    initialURL = \`https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables={"id":"\${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24"}\`,
    doNext = !0,
    filteredList = [],
    getUnfollowCounter = 0,
    scrollCicle = 0;
async function startScript() {
    for (var c, d, e, b, f, g = Math.floor; doNext;) {
        let a;
        try {
            a = await fetch(initialURL).then(a => a.json())
        } catch (h) {
            continue
        }
        followedPeople || (followedPeople = a.data.user.edge_follow.count), doNext = a.data.user.edge_follow.page_info.has_next_page, initialURL = afterUrlGenerator(a.data.user.edge_follow.page_info.end_cursor), getUnfollowCounter += a.data.user.edge_follow.edges.length, a.data.user.edge_follow.edges.forEach(a => {
            a.node.follows_viewer || filteredList.push(a.node)
        }), console.clear(), console.log("%c Lijst van te \\"populaire\\" personen.", "background: #222; color: #FC4119;font-size: 13px;"), filteredList.forEach(a => {
            console.log(a.username)
        }), await sleep(g(400 * Math.random()) + 1e3), scrollCicle++, 6 < scrollCicle && (scrollCicle = 0, console.log("%c w817", "background: #222; color: ##FF0000;font-size: 35px;"), await sleep(1e4))
    }
    console.log("%c 💯" , "background: #222; color: #bada55;font-size: 25px;")
}
startScript()`;

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
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-20" id="tutorial">
      <div className="text-center mb-12 animate-fade-up">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">Step-by-Step Tutorial</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Follow these steps to find out who doesn't follow you back on Instagram.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-1 space-y-2">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "w-full text-left p-4 rounded-lg transition-all duration-300 hover:bg-secondary",
                currentStep === index 
                  ? "bg-primary text-white hover:bg-primary/90" 
                  : "bg-secondary/50"
              )}
            >
              <span className="flex items-center">
                <span className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full mr-3 text-xs",
                  currentStep === index ? "bg-white text-primary" : "bg-primary/10 text-primary"
                )}>
                  {index + 1}
                </span>
                <span>{step.title}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="md:col-span-2">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6 glass"
          >
            <h3 className="text-xl font-semibold mb-4">{steps[currentStep].title}</h3>
            <div className="prose prose-blue max-w-none">
              {steps[currentStep].description}
            </div>
            {steps[currentStep].image && (
              <img 
                src={steps[currentStep].image} 
                alt={steps[currentStep].title} 
                className="rounded-lg mt-4 w-full"
              />
            )}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={cn(
                  "px-4 py-2 rounded-lg transition-colors",
                  currentStep === 0 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                )}
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
                className={cn(
                  "px-4 py-2 rounded-lg transition-colors",
                  currentStep === steps.length - 1 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-primary hover:bg-primary/90 text-white"
                )}
              >
                Next
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
