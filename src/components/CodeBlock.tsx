
import React, { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = "javascript", className }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      className={cn("relative overflow-hidden shadow-2xl border border-white/10", className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between bg-[#1e293b] px-5 py-3 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs font-medium text-gray-300 ml-2">{language}</span>
        </div>
        <motion.button
          onClick={copyToClipboard}
          className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <CheckIcon size={14} />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon size={14} />
              <span className="text-xs">Copy</span>
            </>
          )}
        </motion.button>
      </div>
      <div className="code-block bg-gradient-to-b from-[#0f172a] to-[#0f1729] p-5 max-h-[600px] overflow-y-auto">
        <pre className="text-gray-100 font-mono text-sm leading-relaxed">{code}</pre>
      </div>
    </motion.div>
  );
};

export default CodeBlock;
