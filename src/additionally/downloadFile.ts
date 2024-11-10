export default function download(url: string, filename: string) {
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", filename || "file");
  link.style.display = "none";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}
