
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

const scriptCode = `(async function() {
  /* ====== Extraction Functions ====== */
  // Pause execution for a given duration
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Returns an array of user objects from the timeline.
  // Each object is { username, followsYou }.
  function getUsersFromTimeline() {
    // Limit to the main timeline container (ignores sidebars)
    const timeline = document.querySelector('div[aria-label^="Timeline:"]');
    if (!timeline) {
      console.error("Timeline container not found. Make sure you're on the /following page.");
      return [];
    }
    const cells = timeline.querySelectorAll('button[data-testid="UserCell"]');
    let users = [];
    cells.forEach(cell => {
      // Get the first anchor link that points to a user profile
      const userLink = cell.querySelector('a[href^="/"]');
      if (userLink) {
        // Extract username (the part after the last '/')
        const urlParts = userLink.getAttribute("href").split("/");
        const username = urlParts.filter(part => part !== "")[0];
        // Check for Twitter's "Follows you" indicator element
        const followsYou = cell.querySelector('[data-testid="userFollowIndicator"]') !== null;
        users.push({ username, followsYou });
      }
    });
    return users;
  }

  // Scrolls down the page repeatedly to load all users
  async function scrollAndCollect() {
    let previousHeight = 0;
    let collectedUsers = new Set();
    while (document.body.scrollHeight !== previousHeight) {
      previousHeight = document.body.scrollHeight;
      window.scrollTo(0, document.body.scrollHeight);
      await sleep(1500); // Allow new content to load
      getUsersFromTimeline().forEach(user => {
        collectedUsers.add(JSON.stringify(user)); // use JSON to prevent duplicate objects
      });
    }
    // Convert back to an array of objects
    return Array.from(collectedUsers).map(userStr => JSON.parse(userStr));
  }

  /* ====== UI Injection Functions ====== */
  function injectUI(nonFollowers) {
    // Create style block (adapted from your Instagram UI code)
    const styleSheet = document.createElement("style");
    styleSheet.textContent = \`
	::-webkit-scrollbar {
    	display: none;
	}

	/* Voor Firefox */
	html {
	    scrollbar-width: none;
	}
      @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
      }
      @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
      }
      @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
      }
      .non-follower-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          height: 60px;
          border-radius: 12px;
          margin-bottom: 10px;
      }
      .non-follower-container {
          position: fixed;
          top: 50px;
          right: 20px;
          width: 350px;
          max-height: 600px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 6px 10px rgba(0, 0, 0, 0.1);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          z-index: 9999;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          animation: slideIn 0.4s ease-out forwards;
          overflow: hidden;
          border: 1px solid rgba(229, 231, 235, 0.8);
      }
      .non-follower-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(229, 231, 235, 0.8);
      }
      .non-follower-title {
          font-size: 18px;
          color: #1e40af;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
      }
      .non-follower-title-count {
          background: #3b82f6;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
      }
      .non-follower-close {
          background: none;
          border: none;
          height: 32px;
          width: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          font-size: 16px;
          transition: all 0.2s ease;
      }
      .non-follower-close:hover {
          background: rgba(0, 0, 0, 0.05);
          color: #1e293b;
      }
      .non-follower-search {
          position: relative;
          margin-bottom: 5px;
      }
      .non-follower-search input {
          width: 100%;
          padding: 10px 15px 10px 40px;
          border-radius: 12px;
          border: 1px solid rgba(229, 231, 235, 0.8);
          font-size: 14px;
          background: rgba(249, 250, 251, 0.8);
          transition: all 0.2s ease;
          box-sizing: border-box;
          color: #333;
      }
      .non-follower-search input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
      }
      .non-follower-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 16px;
      }
      .non-follower-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 450px;
          overflow-y: auto;
          padding-right: 5px;
          scroll-behavior: smooth;
	scrollbar-width: none;
 	-ms-overflow-style: none;
      }
      .non-follower-list::-webkit-scrollbar {
          width: 6px;
      }
      .non-follower-list::-webkit-scrollbar-track {
          background: rgba(243, 244, 246, 0.5);
          border-radius: 10px;
      }
      .non-follower-list::-webkit-scrollbar-thumb {
          background: rgba(209, 213, 219, 0.8);
          border-radius: 10px;
      }
      .non-follower-list::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
      }
      .non-follower-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 15px;
          background: rgba(249, 250, 251, 0.8);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          opacity: 0;
          transform: translateY(8px);
          animation: fadeIn 0.3s ease-out forwards;
      }
      .non-follower-item:hover {
          background: white;
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
      }
      .non-follower-item:active {
          transform: scale(0.98);
      }
      .non-follower-info {
          display: flex;
          align-items: center;
          gap: 12px;
      }
      .non-follower-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
      }
      .non-follower-details {
          display: flex;
          flex-direction: column;
      }
      .non-follower-username {
          color: #0369a1;
          font-size: 14px;
          font-weight: 600;
      }
      .non-follower-action {
          display: flex;
          gap: 10px;
      }
      .non-follower-button {
          background: none;
          border: none;
          height: 32px;
          width: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #64748b;
      }
      .non-follower-button:hover {
          background: rgba(0, 0, 0, 0.05);
          color: #1e293b;
      }
      .non-follower-button.view:hover {
          color: #0284c7;
      }
      .non-follower-button.follow {
          background: #3b82f6;
          color: white;
      }
      .non-follower-button.follow:hover {
          background: #2563eb;
          animation: pulse 1.5s infinite;
      }
      .non-follower-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid rgba(229, 231, 235, 0.8);
          font-size: 13px;
          color: #64748b;
      }
      .non-follower-stats {
          display: flex;
          gap: 5px;
          align-items: center;
      }
      .non-follower-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: #64748b;
          gap: 10px;
      }
      .non-follower-spinner {
          height: 20px;
          width: 20px;
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          border-top-color: #3b82f6;
          animation: spin 1s infinite linear;
      }
      @keyframes spin {
          to { transform: rotate(360deg); }
      }
      @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
      }
      .non-follower-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          text-align: center;
          color: #64748b;
      }
      .non-follower-empty-icon {
          font-size: 40px;
          margin-bottom: 15px;
          opacity: 0.5;
      }
    \`;
    document.head.appendChild(styleSheet);

    // Create the UI container
    const container = document.createElement("div");
    container.id = "nonFollowerList";
    container.className = "non-follower-container";

    // Create header
    const header = document.createElement("div");
    header.className = "non-follower-header";

    const title = document.createElement("h3");
    title.className = "non-follower-title";
    title.innerHTML = \`Non-Followers <span class="non-follower-title-count">\${nonFollowers.length}</span>\`;

    const closeButton = document.createElement("button");
    closeButton.className = "non-follower-close";
    closeButton.innerHTML = "✕";
    closeButton.addEventListener("click", () => {
      container.style.animation = "fadeOut 0.3s forwards";
      setTimeout(() => container.remove(), 300);
    });

    header.appendChild(title);
    header.appendChild(closeButton);
    container.appendChild(header);

    // Create search box
    const searchBox = document.createElement("div");
    searchBox.className = "non-follower-search";

    const searchIcon = document.createElement("span");
    searchIcon.className = "non-follower-search-icon";
    searchIcon.innerHTML = "🔍";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search by username...";
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const items = listContainer.querySelectorAll(".non-follower-item");
      items.forEach(item => {
        const username = item.querySelector(".non-follower-username").textContent.toLowerCase();
        item.style.display = username.includes(searchTerm) ? "flex" : "none";
      });
      // Show empty state if no visible items
      const hasVisibleItems = Array.from(items).some(item => item.style.display !== "none");
      updateEmptyState(hasVisibleItems ? null : "No results found");
    });

    searchBox.appendChild(searchIcon);
    searchBox.appendChild(searchInput);
    container.appendChild(searchBox);

    // Create list container
    const listContainer = document.createElement("div");
    listContainer.className = "non-follower-list";

    // Create empty state element (hidden by default)
    const emptyState = document.createElement("div");
    emptyState.className = "non-follower-empty";
    emptyState.style.display = "none";

    function updateEmptyState(message = null) {
      if (message) {
        emptyState.innerHTML = \`
          <div class="non-follower-empty-icon">🔎</div>
          <div>\${message}</div>
        \`;
        emptyState.style.display = "flex";
      } else {
        emptyState.style.display = "none";
      }
    }
    listContainer.appendChild(emptyState);

    // Show loading skeletons first
    for (let i = 0; i < 5; i++) {
      const skeleton = document.createElement("div");
      skeleton.className = "non-follower-skeleton";
      listContainer.appendChild(skeleton);
    }

    // After a brief delay, remove skeletons and display non-followers
    setTimeout(() => {
      // Remove skeletons
      const skeletons = listContainer.querySelectorAll(".non-follower-skeleton");
      skeletons.forEach(skel => skel.remove());

      if (nonFollowers.length === 0) {
        updateEmptyState("No non-followers found");
      } else {
        nonFollowers.forEach((user, index) => {
          const userElement = document.createElement("div");
          userElement.className = "non-follower-item";
          userElement.style.animationDelay = \`\${index * 0.05}s\`;

          // Get initials for the avatar (first two letters)
          const initials = user.username.substring(0, 2).toUpperCase();

          userElement.innerHTML = \`
            <div class="non-follower-info">
              <div class="non-follower-avatar">\${initials}</div>
              <div class="non-follower-details">
                <span class="non-follower-username">@\${user.username}</span>
              </div>
            </div>
            <div class="non-follower-action">
              <button class="non-follower-button view" title="View Profile">👁️</button>
            </div>
          \`;

          // Add event listener to the view button to open the Twitter profile
          const viewButton = userElement.querySelector(".non-follower-button.view");
          viewButton.addEventListener("click", (e) => {
            e.stopPropagation();
            window.open(\`https://twitter.com/\${user.username}\`, "_blank");
          });

          listContainer.appendChild(userElement);
        });
      }
    }, 800);

    container.appendChild(listContainer);

    // Create footer with stats
    const footer = document.createElement("div");
    footer.className = "non-follower-footer";
    footer.innerHTML = \`
      <div class="non-follower-stats">
        <span>Total: \${nonFollowers.length}</span>
      </div>
      <div>Updated just now</div>
    \`;
    container.appendChild(footer);

    // Append the UI container to the document
    document.body.appendChild(container);

    // Focus on search input shortly after injection
    setTimeout(() => searchInput.focus(), 500);
  }

  /* ====== Main Script Flow ====== */
  console.log("%c TWITTER NON-FOLLOWER FINDER ", "background: #1e40af; color: white; font-size: 14px; padding: 5px 10px; border-radius: 4px;");
  console.log("%c Collecting data, please wait...", "color: #6b7280; font-style: italic;");

  // Scroll and collect all user objects from the following page
  let users = await scrollAndCollect();
  // Filter out users that follow you back (i.e. keep only those that do NOT have followsYou true)
  let nonFollowers = users.filter(user => !user.followsYou);

  console.clear();
  console.log(\`Processed \${users.length} accounts.\`);
  
  // Inject the UI with the non-followers list
  injectUI(nonFollowers);
})();
`;

interface Step {
  title: string;
  description: React.ReactNode;
  image?: string;
}

const TwitterTutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: Step[] = [
    {
      title: "Log in to Twitter",
      description: (
        <div>
          <p className="mb-4">
            First, log in to your Twitter account through the web browser.
            Make sure you're logged in at <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">twitter.com</a>.
          </p>
        </div>
      )
    },
    {
      title: "Navigate to Following Page",
      description: (
        <div>
          <p className="mb-4">
            <strong>Important:</strong> You need to navigate to your Following page before running the script. 
            Click on your profile and then click on "Following", or go directly to:
          </p>
          <p className="mb-4 font-mono bg-gray-100 p-2 rounded text-sm">
            https://twitter.com/[your_username]/following
          </p>
          <div className="p-3 mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <p className="text-sm">
              <strong>Note:</strong> The script needs to start from your Following page to work correctly.
            </p>
          </div>
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
            The script will start running and will automatically:
          </p>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Scan through users you follow</li>
            <li>Navigate to your followers page to scan who follows you</li>
            <li>Return to your following page</li>
            <li>Generate a list of users who don't follow you back</li>
          </ol>
          <div className="p-3 mb-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
            <p className="text-sm">
              <strong>Important:</strong> The script will navigate between different pages automatically. Don't interrupt this process.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "View the Results",
      description: (
        <div>
          <p className="mb-4">
            After the script completes its analysis, it will display a UI panel with the list of Twitter users who don't follow you back.
          </p>
          <p className="mb-4">
            You can search for specific users, view their profiles, and see statistics about your non-followers.
          </p>
          <p className="text-sm text-muted-foreground">
            Note: The script may take some time to run if you follow a large number of accounts. It processes accounts in batches and needs to navigate between pages to collect all the necessary data.
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
        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-4">
          Twitter Analytics Tool
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-400">
        Discover Who Doesn't Follow You Back
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
        A simple browser script to identify Instagram accounts that don't reciprocate your follow. Find out who's not following you back with just a few clicks.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-2">
        <div className="md:col-span-1 space-y-2">
          {steps.map((step, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "w-full text-left p-4 rounded-lg transition-all duration-300 flex items-center",
                currentStep === index 
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                  : "bg-secondary/50 hover:bg-secondary"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={cn(
                "flex items-center justify-center w-7 h-7 rounded-full mr-3 text-xs",
                currentStep === index 
                  ? "bg-white text-blue-500" 
                  : "bg-blue-500/10 text-blue-500"
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
              <span className="bg-blue-500/10 text-blue-500 w-8 h-8 rounded-full flex items-center justify-center mr-3">
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
                    : "bg-blue-500 hover:bg-blue-600 text-white"
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

export default TwitterTutorial;
