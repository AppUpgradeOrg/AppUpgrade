export * from "./dtos";
export * from "./models/account";
export * from "./models/environment";
export * from "./models/project";

// Currently there isn't an executable code in this project, just types.
// Adding this executable code as a proof of concept.

export const sum = (a: number, b: number) => {
  return a + b;
};

export const buildWebSdkCodeSnippet = (
  webSdkUrl: string,
  environmentId: string,
  withBody: boolean
) => {
  let snippet = "";
  let indent = (s: string) => `${s}  `;
  let newLine = (s: string) => `${s}\n`;

  if (withBody) {
    snippet += "<body>";
    snippet = newLine(snippet);
    snippet = indent(snippet);
    snippet +=
      "<!-- Add the snippet below near the bottom of your <body> tag -->";
    snippet = newLine(snippet);
    snippet = indent(snippet);
  }

  snippet += "<script>";
  snippet = newLine(snippet);
  snippet = indent(snippet);
  if (withBody) snippet = indent(snippet);
  snippet += `window.appUpgrade=window.appUpgrade||{},appUpgrade.init=function(p,e){window.appUpgrade.appUpgradeId=p,(e=document.createElement("script")).type="text/javascript",e.async=!0,e.src="${webSdkUrl}",(p=document.getElementsByTagName("script")[0]).parentNode.insertBefore(e,p)},appUpgrade.init("${environmentId}");`;
  snippet = newLine(snippet);
  if (withBody) snippet = indent(snippet);
  snippet += "</script>";
  if (withBody) snippet = newLine(snippet);
  if (withBody) snippet += "</body>";

  return snippet;
};
