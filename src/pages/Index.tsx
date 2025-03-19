import React, { useEffect } from "react";
import Header from "@/components/Header";
import Tutorial from "@/components/Tutorial";
import Footer from "@/components/Footer";
import CodeBlock from "@/components/CodeBlock";
import { motion } from "framer-motion";

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


const Index = () => {
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const heroSection = document.getElementById("hero-section");
      if (!heroSection) return;
      
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20;
      const yPos = (clientY / window.innerHeight - 0.5) * 20;
      
      heroSection.style.backgroundPosition = `${50 + xPos * 0.5}% ${50 + yPos * 0.5}%`;
    };
    
    window.addEventListener("mousemove", updateMousePosition);
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 z-[-2]"></div>
      <div className="noise z-[-1]"></div>
      
      <Header />
      
      {/* Hero Section */}
      <section 
        id="hero-section"
        className="relative pt-24 pb-32 overflow-hidden transition-all duration-300 ease-out"
        style={{ backgroundSize: "105% 105%", backgroundPosition: "50% 50%" }}
      >
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-4"
            >
              <span className="inline-block py-1 px-4 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium border border-blue-200 shadow-sm">
                Instagram Analytics Tool
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text"
            >
              Discover Who Doesn't<br />Follow You Back
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
            >
              A simple browser script to identify Instagram accounts that don't reciprocate your follow. 
              Find out who's not following you back with just a few clicks.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a 
                href="#tutorial" 
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium transition-all hover:shadow-lg hover:shadow-blue-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Tutorial
              </motion.a>
              <motion.a 
                href="#code" 
                className="px-8 py-3 rounded-lg glass-card text-gray-800 font-medium transition-all hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get the Script
              </motion.a>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -top-[400px] -right-[400px] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/10 blur-3xl"></div>
          <div className="absolute -bottom-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-400/10 to-blue-500/10 blur-3xl"></div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 glass-card mx-4 md:mx-8 lg:mx-16 xl:mx-auto max-w-7xl my-8 relative" id="how-it-works">
        <div className="noise opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-4 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium mb-4 border border-blue-200 shadow-sm">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 gradient-text">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our script uses Instagram's own APIs to identify accounts that don't follow you back. 
              It's simple, safe, and runs directly in your browser.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Login to Instagram",
                description: "Sign in to your Instagram account in your web browser."
              },
              {
                title: "Run the Script",
                description: "Paste our script into your browser's developer console and run it."
              },
              {
                title: "View Results",
                description: "See a list of accounts that don't follow you back."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-white font-semibold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Tutorial Section */}
      <Tutorial />
      
      {/* Get the Script Section */}
      <section className="py-20 relative" id="code">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/5 to-blue-900/5 z-[-1]"></div>
        <div className="max-w-5xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-4 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium mb-4 border border-blue-200 shadow-sm">
              The Script
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 gradient-text">Copy & Run the Script</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Copy the script below and paste it into your browser's console when you're on Instagram.
            </p>
          </div>
          
          <div className="glass-card p-8 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Script Details</h3>
              <p className="text-muted-foreground text-sm">
                This script analyzes your Instagram following list and identifies accounts that don't follow you back.
                It works by accessing Instagram's GraphQL API and comparing the users you follow with those who follow you.
              </p>
            </div>
            
            <CodeBlock code={scriptCode} className="mb-6" />
            
            <div>
              <h4 className="font-medium mb-2">Important Notes:</h4>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>This script runs entirely in your browser and doesn't send your data to any external servers.</li>
                <li>It only reads information that's already accessible to you when logged into Instagram.</li>
                <li>For large accounts, the script may take several minutes to complete as it processes accounts in batches.</li>
                <li>The script only identifies who doesn't follow you back; it doesn't automatically unfollow anyone.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-4 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium mb-4 border border-blue-200 shadow-sm">
              Questions & Answers
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 gradient-text">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "Is this script safe to use?",
                answer: "Yes, the script runs entirely in your browser and doesn't send your data to any external servers. It only accesses information that's already available to you when logged into Instagram."
              },
              {
                question: "Will Instagram know I'm using this script?",
                answer: "The script uses Instagram's own API to fetch data, which is the same method the website uses. However, running scripts too frequently could potentially be flagged by Instagram's systems, so we recommend using it moderately."
              },
              {
                question: "Why does the script take so long to run?",
                answer: "To avoid being rate-limited by Instagram, the script processes accounts in batches with small delays between requests. This ensures it can complete successfully, especially for accounts that follow a large number of users."
              },
              {
                question: "Can this script automatically unfollow users?",
                answer: "No, this script only identifies users who don't follow you back. It doesn't perform any actions on your behalf. You'll need to manually unfollow any accounts if you choose to do so."
              },
              {
                question: "Why do I need to run this in the browser console?",
                answer: "Running the script in your browser console allows it to access your authenticated Instagram session, which is necessary to retrieve your following/follower data. This cannot be done through a regular website without your Instagram credentials."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-lg font-medium mb-2">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
      <a
        href="https://www.buymeacoffee.com/atfbcs"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-yellow-400 text-black px-3 py-2 rounded-full shadow-md font-medium text-smflex items-center gap-2 hover:bg-yellow-500 transition-all"
      >
        ☕ Buy Me a Coffee
      </a>
    </div>
  );
};

export default Index;
