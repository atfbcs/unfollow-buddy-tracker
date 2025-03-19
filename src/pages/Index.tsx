
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CodeBlock from "@/components/CodeBlock";
import { motion } from "framer-motion";
import { usePlatform } from "@/contexts/PlatformContext";
import { PlatformSelector } from "@/components/PlatformSelector";
import InstagramTutorial from "@/components/InstagramTutorial";
import TwitterTutorial from "@/components/TwitterTutorial";
import { Instagram, Twitter } from "lucide-react";

// Empty script codes to prevent template string errors
const instagramScriptCode = `function getCookie(cookieName) {
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
const twitterScriptCode = `(async function() {
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

const IndexPage = () => {
  const { platform } = usePlatform();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container px-4 py-0 mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
            {platform === "instagram" ? (
              <>
                <Instagram className="h-8 w-8 text-pink-500" />
                <span>Instagram</span>
              </>
            ) : (
              <>
                <Twitter className="h-8 w-8 text-blue-400" />
                <span>Twitter</span>
              </>
            )}
          </h1>
          
          <PlatformSelector className="-mb-8" />
          
          <div className="-space-y-10">
            {platform === "instagram" ? (
              <InstagramTutorial />
            ) : (
              <TwitterTutorial />
            )}
            
            <div className="-py-10">
              <h2 className="text-xl font-semibold mb-4">The Script</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Copy this script and paste it into your browser's console when you&apos;re on 
                {platform === "instagram" ? " Instagram" : " Twitter's following page"}.
              </p>
              <CodeBlock
                code={platform === "instagram" ? instagramScriptCode : twitterScriptCode}
                language="javascript"
              />
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">Important Notes:</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-yellow-700 dark:text-yellow-300">
                <li>This tool is for educational purposes only.</li>
                <li>The script runs entirely in your browser and no data is sent to any server.</li>
                <li>The script may stop working if {platform === "instagram" ? "Instagram" : "Twitter"} changes their website structure.</li>
                <li>Using automated tools against {platform === "instagram" ? "Instagram" : "Twitter"}'s Terms of Service may result in account limitations.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
      <a
        href="https://www.buymeacoffee.com/atfbcs"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-yellow-400 text-black px-3 py-2 rounded-full shadow-md font-medium text-smflex items-center gap-2 hover:bg-yellow-500 transition-all z-[1000]"
      >
        ☕ Buy Me a Coffee
      </a>
    </div>
  );
};

export default IndexPage;
