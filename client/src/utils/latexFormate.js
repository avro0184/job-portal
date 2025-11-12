import { MathJax, MathJaxContext } from "better-react-mathjax";
import parse from "html-react-parser";

// latexFormate.js
export const mathJaxConfig = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
  },
};

export const parseLatexHtml = (htmlText = "") => {
  const sanitized = htmlText
    .replace(/\\\\/g, "\\") // Convert double backslash to single
    .replace(/\\<br\\>/g, "<br />") // Replace \ <br\> with proper <br />
    .replace(/<br\\?>/gi, "<br />"); // Normalize all <br>

  return parse(sanitized, {
    replace: (domNode) => {
      if (
        domNode.type === "text" &&
        typeof domNode.data === "string" &&
        domNode.data.includes("$")
      ) {
        return (
          <MathJax inline dynamic>
            {domNode.data}
          </MathJax>
        );
      }
    },
  });
};

