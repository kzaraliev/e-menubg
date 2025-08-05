import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import logo from "@/app/icon.png";

// Simple footer for dashboard pages
const DashboardFooter = () => {
  return (
    <footer className="footer footer-center p-6 bg-base-200 border-t border-base-content/10 text-base-content">
      <aside>
        <Link href="/dashboard" className="flex items-center gap-2 mb-2">
          <Image
            src={logo}
            alt={`${config.appName} logo`}
            className="w-6 h-6"
            width={24}
            height={24}
          />
          <span className="font-bold text-lg">{config.appName}</span>
        </Link>
        <p className="text-sm text-base-content/70">
          {config.appDescription}
        </p>
        <p className="text-xs text-base-content/60">
          Copyright © {new Date().getFullYear()} - Всички права запазени
        </p>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-4 text-sm">
          {config.resend.supportEmail && (
            <Link
              href={`mailto:${config.resend.supportEmail}`}
              className="link link-hover"
            >
              Поддръжка
            </Link>
          )}
          <Link href="/privacy-policy" className="link link-hover">
            Поверителност
          </Link>
          <Link href="/tos" className="link link-hover">
            Условия
          </Link>
          <Link href="/" className="link link-hover">
            Начална страница
          </Link>
        </div>
      </nav>
    </footer>
  );
};

export default DashboardFooter;