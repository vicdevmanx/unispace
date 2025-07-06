export function formatDate(date: string | { toDate: () => Date } | undefined): string {
  if (!date) return "N/A";
  
  let jsDate: Date;
  if (typeof date === "string") {
    jsDate = new Date(date);
  } else if (date && typeof date.toDate === "function") {
    jsDate = date.toDate();
  } else {
    return "N/A";
  }
  return jsDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}