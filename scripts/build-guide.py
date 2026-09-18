"""Optional documentation build: Python + reportlab; the published PDF is committed."""
from pathlib import Path
import re
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Preformatted, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT

root = Path(__file__).resolve().parent.parent
out = root / 'public/docs/ShockCraft-telepitesi-utmutato.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
pdfmetrics.registerFont(TTFont('Noto', str(root / 'public/fonts/NotoSans-Regular.ttf')))
green = colors.HexColor('#256459')
body = ParagraphStyle('Body', fontName='Noto', fontSize=11, leading=16.5, textColor='#263b49', spaceAfter=10)
title = ParagraphStyle('Title', parent=body, fontSize=25, leading=32, textColor=green, spaceAfter=18)
heading = ParagraphStyle('Heading', parent=body, fontSize=19, leading=25, textColor=green, spaceAfter=17)
bullet = ParagraphStyle('Bullet', parent=body, leftIndent=11, firstLineIndent=-9, spaceAfter=6)
code = ParagraphStyle('Code', fontName='Courier', fontSize=9, leading=12, backColor=colors.HexColor('#eef4f2'), borderPadding=8, spaceBefore=5, spaceAfter=14)

def rich(text):
    text = escape(text)
    return re.sub(r'(https://[^\s]+)', r'<link href="\1" color="#256459">\1</link>', text)

story, paragraph, block = [], [], None
def flush():
    if paragraph:
        story.append(Paragraph(rich(' '.join(paragraph)), body))
        paragraph.clear()

for line in (root / 'docs/telepites.md').read_text(encoding='utf8').splitlines():
    if line.startswith('```'):
        flush()
        if block is None: block = []
        else:
            story.append(Preformatted('\n'.join(block), code))
            block = None
    elif block is not None: block.append(line)
    elif line.startswith('# '):
        flush(); story.append(Paragraph(rich(line[2:]), title))
    elif line.startswith('## '):
        flush()
        if not line.startswith('## 1.'): story.append(PageBreak())
        story.append(Paragraph(rich(line[3:]), heading))
    elif line.startswith('- ') or re.match(r'^\d+\. ', line):
        flush(); story.append(Paragraph(rich('• '+line[2:] if line.startswith('- ') else line), bullet))
    elif not line.strip(): flush()
    else: paragraph.append(line)
flush()

def page(canvas, doc):
    canvas.setStrokeColor(green); canvas.setLineWidth(2)
    canvas.line(43, 804, 552, 804)
    canvas.setFont('Noto', 8); canvas.setFillColor(green)
    canvas.drawString(43, 816, 'SHOCKCRAFT  /  TELEPÍTÉS')
    canvas.setFillColor(colors.HexColor('#71828a'))
    canvas.drawString(43, 26, 'Node.js + MySQL  ·  2026. szeptember 18.')
    canvas.drawRightString(552, 26, str(doc.page))

SimpleDocTemplate(str(out), pagesize=(595.28,841.89), rightMargin=43, leftMargin=43, topMargin=56, bottomMargin=48, title='ShockCraft – Node.js és VPS telepítési útmutató', author='ShockCraft').build(story, onFirstPage=page, onLaterPages=page)
print(out)
