@echo off
echo Compiling CipherShield Paper...
echo.

REM Try pdflatex first
pdflatex -interaction=nonstopmode paperV0.0.tex
if %errorlevel% equ 0 goto success

REM Try xelatex if pdflatex fails
echo pdflatex failed, trying xelatex...
xelatex -interaction=nonstopmode paperV0.0.tex
if %errorlevel% equ 0 goto success

REM Try lualatex if others fail
echo xelatex failed, trying lualatex...
lualatex -interaction=nonstopmode paperV0.0.tex
if %errorlevel% equ 0 goto success

echo All LaTeX compilers failed. Please install MiKTeX or TeX Live.
echo Visit: https://miktex.org or https://www.tug.org/texlive/
goto end

:success
echo.
echo Compilation successful!
echo PDF created: paperV0.0.pdf
echo Opening PDF...
start paperV0.0.pdf

:end
pause
