
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

const scriptCode = `
function getCookie(cookieName) {
    let cookies = document.cookie,
        parts = cookies.split(\`; \${cookieName}=\`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function afterUrlGenerator(cursor) {
    return \`https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables={"id":"\${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24","after":"\${cursor}"}\`;
}

let csrftoken = getCookie("csrftoken"),
    ds_user_id = getCookie("ds_user_id"),
    initialURL = \`https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables={"id":"\${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24"}\`,
    doNext = true,
    nonFollowers = [],
    processedCount = 0;

async function startScript() {
    console.log("%c INSTAGRAM NON-FOLLOWER FINDER ", "background: #1e40af; color: white; font-size: 14px; padding: 5px 10px; border-radius: 4px;");
    console.log("%c Collecting data, please wait...", "color: #6b7280; font-style: italic;");

    while (doNext) {
        let response;
        try {
            response = await fetch(initialURL).then(res => res.json());
        } catch (error) {
            console.log("%c Network error, retrying...", "color: #ef4444;");
            continue;
        }

        doNext = response.data.user.edge_follow.page_info.has_next_page;
        initialURL = afterUrlGenerator(response.data.user.edge_follow.page_info.end_cursor);

        response.data.user.edge_follow.edges.forEach(edge => {
            if (!edge.node.follows_viewer) {
                nonFollowers.push(edge.node);
            }
        });

        processedCount += response.data.user.edge_follow.edges.length;
        console.clear();
        console.log(\`%c Processed: \${processedCount} accounts...\`, "color: #6b7280;");
        
        await sleep(1000);
    }

    console.log("%c Analysis complete! Injecting UI...", "color: #10b981; font-weight: bold;");
    injectUI(nonFollowers);
}

function injectUI(nonFollowers) {
    // Create styles for the component
    const styleSheet = document.createElement("style");
    styleSheet.textContent = \`
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
        }
        
        .non-follower-search input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }

        .non-follower-search input {
            color: #333;
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
    
    // Create container
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
            if (username.includes(searchTerm)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
        
        // Show empty state if no results
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
    
    // After a brief delay, remove skeletons and show actual content
    setTimeout(() => {
        // Remove skeletons
        const skeletons = listContainer.querySelectorAll(".non-follower-skeleton");
        skeletons.forEach(skeleton => skeleton.remove());
        
        // Add user items with staggered animation
        if (nonFollowers.length === 0) {
            updateEmptyState("No non-followers found");
        } else {
            nonFollowers.forEach((user, index) => {
                const userElement = document.createElement("div");
                userElement.className = "non-follower-item";
                userElement.style.animationDelay = \`\${index * 0.05}s\`;
                
                // Get initials for avatar
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
                
                // Add event listeners
                const viewButton = userElement.querySelector(".non-follower-button.view");
                viewButton.addEventListener("click", (e) => {
                    e.stopPropagation();
                    window.open(\`https://www.instagram.com/\${user.username}/\`, "_blank");
                });
                
                
                // Add user element to container
                listContainer.appendChild(userElement);
            });
        }
    }, 800);
    
    container.appendChild(listContainer);
    
    // Add footer with stats
    const footer = document.createElement("div");
    footer.className = "non-follower-footer";
    footer.innerHTML = \`
        <div class="non-follower-stats">
            <span>Total: \${nonFollowers.length}</span>
        </div>
        <div>Updated just now</div>
    \`;
    container.appendChild(footer);
    
    // Add to document
    document.body.appendChild(container);
    
    // Focus search input
    setTimeout(() => searchInput.focus(), 500);
    
    // Return API for controlling the UI
    return {
        close: () => {
            container.style.animation = "fadeOut 0.3s forwards";
            setTimeout(() => container.remove(), 300);
        },
        refresh: (newNonFollowers) => {
            const count = document.querySelector(".non-follower-title-count");
            count.textContent = newNonFollowers.length;
            
            // Clear existing items
            const items = listContainer.querySelectorAll(".non-follower-item");
            items.forEach(item => item.remove());
            
            // Show loading state
            for (let i = 0; i < 3; i++) {
                const skeleton = document.createElement("div");
                skeleton.className = "non-follower-skeleton";
                listContainer.appendChild(skeleton);
            }
            
            // After a brief delay, remove skeletons and show actual content
            setTimeout(() => {
                // Remove skeletons
                const skeletons = listContainer.querySelectorAll(".non-follower-skeleton");
                skeletons.forEach(skeleton => skeleton.remove());
                
                if (newNonFollowers.length === 0) {
                    updateEmptyState("All caught up!");
                } else {
                    newNonFollowers.forEach((user, index) => {
                        // Create new user elements similar to original code
                        // ...
                    });
                }
                
                // Update footer stats
                const statsEl = footer.querySelector(".non-follower-stats");
                statsEl.innerHTML = \`<span>Total: \${newNonFollowers.length}</span>\`;
                
                // Update "Updated" text
                footer.querySelector("div:last-child").textContent = "Updated just now";
            }, 800);
        }
    };
}

startScript();
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
