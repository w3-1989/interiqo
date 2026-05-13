export interface FreelancerNav  {
    activePage: string ,
    setActivePage: (activePage: 'invite' | 'briefs' | 'projects' | 'chat' | 'profile' | 'settings') => void
}