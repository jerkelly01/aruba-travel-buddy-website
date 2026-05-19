import * as React from "react";

interface SocialLinksProps {
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  className?: string;
}

export default function SocialLinks({ facebookUrl, instagramUrl, tiktokUrl, className = "" }: SocialLinksProps) {
  const fb = facebookUrl?.trim();
  const ig = instagramUrl?.trim();
  const tt = tiktokUrl?.trim();

  if (!fb && !ig && !tt) return null;

  return (
    <div className={`mt-8 border-t border-gray-200 pt-8 ${className}`}>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Connect with Us</h2>
      <div className="flex flex-wrap items-center gap-4">
        {fb && (
          <a
            id="social-link-facebook"
            href={fb}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Facebook"
            className="group flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-blue-50/50 hover:shadow-md hover:shadow-blue-500/10"
          >
            <svg
              className="h-6 w-6 text-gray-600 transition-colors duration-300 group-hover:text-[#1877F2]"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        )}
        {ig && (
          <a
            id="social-link-instagram"
            href={ig}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Instagram"
            className="group flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 hover:border-pink-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-pink-50/50 hover:shadow-md hover:shadow-pink-500/10"
          >
            <svg
              className="h-6 w-6 text-gray-600 transition-colors duration-300 group-hover:text-[#E4405F]"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.01 3.71.054 1.14.051 1.76.24 2.17.4.54.21.93.46 1.34.87.41.41.66.8.87 1.34.16.41.35 1.03.4 2.17.044.926.054 1.28.054 3.71s-.01 2.784-.054 3.71c-.051 1.14-.24 1.76-.4 2.17a3.86 3.86 0 01-.87 1.34 3.86 3.86 0 01-1.34.87c-.41.16-1.03.35-2.17.4-.926.044-1.28.054-3.71.054s-2.784-.01-3.71-.054c-1.14-.051-1.76-.24-2.17-.4a3.86 3.86 0 01-1.34-.87 3.86 3.86 0 01-.87-1.34c-.16-.41-.35-1.03-.4-2.17C2.01 14.784 2 14.43 2 12c0-2.43.01-2.784.054-3.71.051-1.14.24-1.76.4-2.17.21-.54.46-.93.87-1.34.41-.41.8-.66 1.34-.87.41-.16 1.03-.35 2.17-.4.926-.044 1.28-.054 3.71-.054zM12 7.25a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zM12 9a3.25 3.25 0 110 6.5 3.25 3.25 0 010-6.5zm5.75-.75a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        )}
        {tt && (
          <a
            id="social-link-tiktok"
            href={tt}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on TikTok"
            className="group flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 hover:border-neutral-300 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-neutral-100 hover:shadow-md hover:shadow-black/5"
          >
            <svg
              className="h-6 w-6 text-gray-600 transition-colors duration-300 group-hover:text-black"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.525.02c1.31 0 2.57.34 3.68.96.08.04.14.1.18.18.04.08.05.18.02.27a13.39 13.39 0 01-3.23 4.41c-.04.03-.07.08-.09.13-.02.05-.02.1-.01.15.01.05.03.1.07.14.04.03.09.05.14.06 1.83.18 3.52.88 4.9 2.02.05.04.11.06.17.06.06 0 .12-.02.17-.06l2.12-2.12c.05-.05.08-.12.08-.19 0-.07-.03-.14-.08-.19C19.78 4.88 18.91 3.2 18.91.03c0-.08-.03-.16-.09-.22a.31.31 0 00-.22-.09h-3.03c-.08 0-.16.03-.22.09-.06.06-.09.14-.09.22v11.75a2.53 2.53 0 01-1.07 2.06c-.84.6-1.87.72-2.8.31a2.54 2.54 0 01-1.53-2.31c0-1.12.72-2.12 1.77-2.45.08-.03.14-.09.18-.17.04-.08.04-.18 0-.26l-1.05-2.1c-.04-.08-.11-.14-.2-.17a.3.3 0 00-.26.02A6.52 6.52 0 005.02 12.5c0 3.03 2.06 5.69 5.01 6.47a6.52 6.52 0 005.99-1.92c1.23-1.28 1.91-2.99 1.91-4.78V5.03a16.48 16.48 0 003.54 2.12c.07.03.16.02.23-.02.07-.04.12-.1.14-.18l.84-3.03c.02-.08.01-.16-.03-.23a.31.31 0 00-.2-.14c-2.34-.6-4.23-2.16-5.2-4.26a.31.31 0 00-.28-.18h-4.39a.31.31 0 00-.31.31c0 .08.03.16.09.22.06.06.14.09.22.09h1.03v.01z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
