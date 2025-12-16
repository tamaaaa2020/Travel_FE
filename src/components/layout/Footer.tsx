// src/components/layout/Footer.tsx
import React from "react";

export const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-[#2B2B2B] text-white py-10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center md:justify-between gap-6">

                {/* LEFT TEXT */}
                <p className="text-sm text-[#B5B5B5] max-w-xs text-center md:text-left">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit.
                </p>

                {/* CENTER LOGO */}
                <div className="text-3xl font-semibold tracking-wide">
                    Ezytix
                </div>

                {/* RIGHT TEXT */}
                <p className="text-sm text-[#B5B5B5] max-w-xs text-center md:text-right">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
                    faucibus ex sapien vitae pellentesque sem placerat.
                </p>

            </div>
        </footer>
    );
};
