# LaTeX Compilation Guide for CipherShield Paper

## 🚀 Quick Compilation Options

Since LaTeX compiler is not found on your system, here are several ways to compile your paper:

### Option 1: Online LaTeX Compiler (Recommended)

**Overleaf** (https://www.overleaf.com)
1. Go to https://www.overleaf.com
2. Create a new project
3. Upload `paperV0.0.tex`
4. Click "Recompile" - PDF will be generated automatically

**CoCalc** (https://cocalc.com)
1. Go to https://cocalc.com
2. Create a new LaTeX project
3. Upload your `.tex` file
4. Compile using the toolbar

### Option 2: Install MiKTeX (Windows)

**Download and Install:**
1. Go to https://miktex.org/download
2. Download MiKTeX for Windows
3. Run the installer (requires admin rights)
4. Restart your computer

**After Installation:**
```bash
# Test if LaTeX is working
pdflatex --version

# Compile your paper
pdflatex paperV0.0.tex
```

### Option 3: Install TeX Live (Cross-platform)

**Download and Install:**
1. Go to https://www.tug.org/texlive/
2. Download TeX Live for Windows
3. Run the installer
4. Add to system PATH during installation

### Option 4: VS Code with LaTeX Workshop

**Setup:**
1. Install VS Code: https://code.visualstudio.com/
2. Install LaTeX Workshop extension
3. Open your `.tex` file
4. Use Ctrl+Alt+B to build

## 📋 LaTeX File Structure

Your `paperV0.0.tex` includes:
- ✅ Complete paper content
- ✅ All tables and figures (placeholders)
- ✅ Bibliography
- ✅ Proper formatting for academic publication

## 🖼️ Figure Placeholders

Your paper has figure placeholders that you need to replace:

```
[Figure 1: High-Level CipherShield System Architecture Diagram]
[Figure 2: Frontend Interface Screenshot]  
[Figure 3: Backend Architecture / API Flow Diagram]
[Figure 4: Performance Comparison Charts]
```

**To add actual figures:**
1. Create images (PNG/PDF format)
2. Save in same folder as `.tex` file
3. Replace placeholder boxes with:
```latex
\includegraphics[width=\columnwidth]{figure1.pdf}
```

## 🔧 Common Compilation Issues

### Missing Packages
If you get package errors, add these to preamble:
```latex
\usepackage{graphicx}
\usepackage{booktabs}
\usepackage{amsmath}
\usepackage{hyperref}
```

### Bibliography Issues
The bibliography is included inline. If you want separate `.bib` file:
1. Create `references.bib`
2. Replace inline bibliography with:
```latex
\bibliographystyle{plain}
\bibliography{references}
```

### Font Issues
If you get font warnings, add:
```latex
\usepackage{lmodern}
\usepackage[T1]{fontenc}
```

## 📊 Expected Output

When successfully compiled, your paper will be:
- **Format**: Two-column academic paper
- **Length**: ~8-10 pages
- **Style**: IEEE/ACM conference format
- **Content**: Complete research paper with all sections

## 🚀 Quick Test

To test if LaTeX is working on your system:

```latex
\documentclass{article}
\begin{document}
Hello, LaTeX World!
\end{document}
```

Save as `test.tex` and try compiling.

## 📞 Need Help?

**Online Resources:**
- Overleaf Documentation: https://www.overleaf.com/learn
- LaTeX Community: https://tex.stackexchange.com
- MiKTeX Support: https://miktex.org/support

**VS Code Extension:**
- LaTeX Workshop: https://github.com/James-Yu/LaTeX-Workshop

---

**Next Steps:**
1. Choose a compilation method above
2. Compile `paperV0.0.tex`
3. Review the PDF output
4. Make any necessary adjustments
5. Ready for submission!
