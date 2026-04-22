from pathlib import Path
from datetime import date
import xml.etree.ElementTree as ET

SITE = "https://uscalculator.online"
LOCALES = ["en", "fr", "es", "nl", "ar", "ja"]

sitemap_path = Path("public/sitemap.xml")
xml = sitemap_path.read_text(encoding="utf-8")
root = ET.fromstring(xml)
ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

paths = []
for node in root.findall("sm:url", ns):
    loc = node.find("sm:loc", ns)
    if loc is None or not loc.text:
        continue
    path = loc.text.replace(SITE, "") or "/"
    paths.append(path)

ordered = []
seen = set()
for path in paths:
    if path not in seen:
        seen.add(path)
        ordered.append(path)

lastmod = date.today().isoformat()

lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
]

for path in ordered:
    variants = [path]
    for locale in LOCALES:
        if locale == "en":
            continue
        variants.append(f"/{locale}" if path == "/" else f"/{locale}{path}")

    if path == "/":
        priority = "1.0"
    elif path in {"/finance", "/health", "/math"}:
        priority = "0.9"
    else:
        priority = "0.8"

    for variant in variants:
        lines.append(
            f"  <url><loc>{SITE}{variant}</loc><lastmod>{lastmod}</lastmod><changefreq>monthly</changefreq><priority>{priority}</priority></url>"
        )

lines.append("</urlset>")
sitemap_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

print(f"Generated {len(lines) - 3} sitemap URL entries")
