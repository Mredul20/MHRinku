import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-background-dark font-bold">M</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Mobarak<span className="text-primary text-2xl">.</span></span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">A results-driven designer specialized in building digital experiences that matter.</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all" href="#">
                <span className="material-symbols-outlined text-lg">person</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all" href="#">
                <span className="material-symbols-outlined text-lg">mail</span>
              </a>
            </div>
          </div>
          <div>
            <h5 className="font-bold mb-6">Services</h5>
            <ul className="space-y-4 text-slate-400">
              <li><Link className="hover:text-primary transition-colors" href="/ui-design">UI/UX Design</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/graphic-design">Graphic Design</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/meta-ads">Meta Ads</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/wordpress-dev">CMS Dev</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/seo">SEO Service</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6">Company</h5>
            <ul className="space-y-4 text-slate-400">
              <li><Link className="hover:text-primary transition-colors" href="/about">About Me</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/#testimonials">Testimonials</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/#contact">Contact</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
          <p>© 2026 Mobarak Hossain Rinku. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
