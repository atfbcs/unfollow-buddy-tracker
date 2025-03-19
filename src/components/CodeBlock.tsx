
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
      className={cn("relative rounded-lg overflow-hidden shadow-lg", className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between bg-[#1e293b] px-5 py-3">
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
          className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <CheckIcon size={16} />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon size={16} />
              <span className="text-xs">Copy</span>
            </>
          )}
        </motion.button>
      </div>
      <div className="code-block overflow-x-auto bg-[#0f172a] p-4 max-h-[500px] overflow-y-auto">
        <pre className="text-gray-100 font-mono text-sm">{code}</pre>
      </div>
    </motion.div>
  );
};

export default CodeBlock;
