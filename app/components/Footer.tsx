import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-neutral-50 w-full py-16 bg-extra-strong">
      <div className="mt-8 py-6 border-t items-center justify-between px-10 py-4 mx-auto sm:px-6 row max-w-7xl">
        <div className="items-center gap-4 row">
          <div className="text-sm text-light">&copy; {new Date().getFullYear()} Vaka</div>
        </div>
      </div>
    </footer>
  );
};
