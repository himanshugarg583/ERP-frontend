import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Heart } from "lucide-react";

const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-auto bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left Section - Logo & Copyright */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-sm text-gray-700">
                                Copyright © 2025{" "}
                                <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    gurukulsarthi School
                                </span>
                                . All rights reserved.
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Version <span className="font-mono font-medium text-indigo-600">(0.11)</span>
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Made with Love */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Made with</span>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                        >
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        </motion.div>
                        <span>for Education</span>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
