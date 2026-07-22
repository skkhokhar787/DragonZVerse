import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full py-12 mt-6 bg-surface-container-lowest border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8 max-w-container-max mx-auto">
        <div className="flex flex-col gap-4">
          <Link to="/" className="font-headline-md text-headline-md text-primary italic">
            DragonVerse
          </Link>
          <p className="text-on-surface-variant text-sm">
            The definitive galactic archive for every warrior, planet, and battle across the
            multiverses. Powering your adventure since Age 780.
          </p>
          <div className="flex gap-4">
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined">terminal</span>
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined">shield</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-headline-md text-headline-md text-tertiary mb-4">
            Universe 7 Central
          </h4>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                to="/characters"
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block"
              >
                Fighter Leaderboards
              </Link>
            </li>
            <li>
              <Link
                to="/planets"
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block"
              >
                Galactic Map
              </Link>
            </li>
            <li>
              <Link
                to="/transformations"
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block"
              >
                Dragon Ball Radar
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline-md text-headline-md text-tertiary mb-4">
            Capsule Corp Support
          </h4>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block"
                href="#"
              >
                Equipment Maintenance
              </a>
            </li>
            <li>
              <a
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block"
                href="#"
              >
                Gravity Room Bookings
              </a>
            </li>
            <li>
              <a
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block"
                href="#"
              >
                Saiyan Biology FAQ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline-md text-headline-md text-tertiary mb-4">
            Z-Fighters Hub
          </h4>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                to="/battles"
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block"
              >
                Join the Patrol
              </Link>
            </li>
            <li>
              <Link
                to="/battles"
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block"
              >
                Tournament of Power
              </Link>
            </li>
            <li>
              <a
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block"
                href="#"
              >
                Training Manuals
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center text-on-surface-variant text-sm border-t border-outline-variant/30 pt-8">
        &copy; 780 Age DragonVerse. All Universes Reserved.
      </div>
    </footer>
  );
}
