// type NavPage =
//   | "home"
//   | "briefs"
//   | "chat"
//   | "profile"
//   | "settings";

export interface ClientNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
}