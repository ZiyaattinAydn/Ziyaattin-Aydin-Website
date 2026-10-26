/** One section root for every Studio navigation item, including nested editors. */
export function studioNavigationState(pathname: string, href: string) {
  const currentPage = pathname === href;
  const nested = href !== "/studio" && pathname.startsWith(`${href}/`);
  return { active: currentPage || nested, nested, currentPage };
}
