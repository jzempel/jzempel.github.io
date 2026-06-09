export default {
  "*.{xml,xsl}": () =>
    "fop -xml src/resume.xml -xsl src/xsl/resume2fo.xsl -pdf 'src/Jonathan Zempel.pdf'",
};
