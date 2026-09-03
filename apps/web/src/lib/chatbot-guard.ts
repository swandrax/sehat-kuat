/**
 * Zavora Life Chatbot Authorization & Visibility Guard
 * 
 * Rules:
 * - Guest + public homepage ('/') / public landing pages -> SHOW (true)
 * - Authenticated PATIENT -> SHOW (true) throughout patient pages
 * - Authenticated DOCTOR -> HIDE (false) completely
 * - Authenticated ADMIN -> HIDE (false) completely
 * - Other internal roles -> HIDE (false)
 */
export function canUseZavoraLifeChatbot(user: any, pathname: string): boolean {
  if (!user) {
    // Guest user: only permitted on public homepage or public discovery
    return pathname === "/" || pathname === "/facilities" || pathname === "/articles";
  }

  const roleName = user.role?.name || user.role;

  // Authenticated PATIENT
  if (roleName === "PATIENT") {
    // Exclude internal routes if somehow navigated
    if (pathname.startsWith("/doctor") || pathname.startsWith("/admin")) {
      return false;
    }
    return true;
  }

  // Doctors, Admins, Staff, Auditors, and other internal roles are strictly forbidden
  return false;
}
