type NavPage =
  | "invite"
  | "briefs"
  | "projects"
  | "chat"
  | "profile"
  | "settings";

export interface FreelancerNavProps {
  activePage: NavPage;
  setActivePage: (page: NavPage) => void;
}
