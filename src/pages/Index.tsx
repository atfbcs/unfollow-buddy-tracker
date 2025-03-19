
import React, { useEffect } from "react";
import Header from "@/components/Header";
import Tutorial from "@/components/Tutorial";
import Footer from "@/components/Footer";
import CodeBlock from "@/components/CodeBlock";
import { motion } from "framer-motion";

const scriptCode = `function getCookie(cookieName) {
  let cookies = \`; \${document.cookie}\`,
      parts = cookies.split(\`; \${cookieName}=\`);
  if (2 === parts.length) return parts.pop().split(";").shift()
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function afterUrlGenerator(cursor) {
  return \`https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables={"id":"\${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24","after":"\${cursor}"}\`
}

function unfollowUserUrlGenerator(userId) {
  return \`https://www.instagram.com/web/friendships/\${userId}/unfollow/\`
}

let followedPeople, 
    csrftoken = getCookie("csrftoken"),
    ds_user_id = getCookie("ds_user_id"),
    initialURL = \`https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables={"id":"\${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24"}\`,
    doNext = true,
    nonFollowers = [],
    processedCount = 0,
    batchCount = 0;

async function startScript() {
  console.log("%c INSTAGRAM NON-FOLLOWER FINDER ", "background: #1e40af; color: white; font-size: 14px; padding: 5px 10px; border-radius: 4px;");
  console.log("%c Starting analysis...", "color: #6b7280; font-style: italic;");
  
  while (doNext) {
    let response;
    try {
      response = await fetch(initialURL).then(res => res.json());
    } catch (error) {
      console.log("%c Network error, retrying...", "color: #ef4444;");
      continue;
    }
    
    // Initialize total count on first run
    if (!followedPeople) {
      followedPeople = response.data.user.edge_follow.count;
      console.log("%c ACCOUNT SUMMARY ", "background: #1e40af; color: white; font-size: 12px; padding: 3px 6px; border-radius: 2px;");
      console.log(\`%c Total accounts you follow: \${followedPeople}\`, "color: #6b7280;");
    }
    
    // Update URL for next batch
    doNext = response.data.user.edge_follow.page_info.has_next_page;
    initialURL = afterUrlGenerator(response.data.user.edge_follow.page_info.end_cursor);
    
    // Process accounts
    processedCount += response.data.user.edge_follow.edges.length;
    response.data.user.edge_follow.edges.forEach(edge => {
      if (!edge.node.follows_viewer) {
        nonFollowers.push(edge.node);
      }
    });
    
    // Display progress
    console.clear();
    console.log("%c INSTAGRAM NON-FOLLOWER FINDER ", "background: #1e40af; color: white; font-size: 14px; padding: 5px 10px; border-radius: 4px;");
    console.log(\`%c Processed: \${processedCount}/\${followedPeople} accounts (\${Math.round((processedCount/followedPeople) * 100)}%)\`, "color: #6b7280;");
    console.log("%c ACCOUNTS NOT FOLLOWING YOU BACK ", "background: #4f46e5; color: white; font-size: 12px; padding: 3px 6px; border-radius: 2px; margin-top: 10px;");
    
    nonFollowers.forEach(user => {
      console.log(\`%c @\${user.username}\`, "color: #1e40af; font-weight: bold;");
    });
    
    // Add delay between batches
    await sleep(Math.floor(400 * Math.random()) + 1000);
    
    // Add longer pause every 6 batches to avoid rate limiting
    batchCount++;
    if (6 < batchCount) {
      batchCount = 0;
      console.log("%c Taking a break to avoid rate limiting...", "color: #f59e0b; font-style: italic;");
      await sleep(10000);
    }
  }
  
  // Final results
  console.log("%c ANALYSIS COMPLETE ", "background: #10b981; color: white; font-size: 14px; padding: 5px 10px; border-radius: 4px;");
  console.log(\`%c Total accounts processed: \${processedCount}\`, "color: #6b7280;");
  console.log(\`%c Found \${nonFollowers.length} accounts that don't follow you back\`, "color: #6b7280;");
}

startScript();`;

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
        <div className="noise opacity-[0.03]"></div>
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
    </div>
  );
};

export default Index;
