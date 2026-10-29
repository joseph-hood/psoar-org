"""Check that every link, image, font, and stylesheet in the built site points to a real file.

    npm run build
    python3 tools/check-site.py

Looks at href, src and srcset in every HTML page in dist/, and url(...) in CSS. Links to
other websites are not checked. Exits with an error listing anything broken, so the
GitHub workflow stops before publishing a broken site.
"""
import pathlib
import re
import sys
from urllib.parse import unquote, urlsplit

site = pathlib.Path(__file__).resolve().parent.parent / "dist"
if not (site / "index.html").is_file():
    sys.exit("No built site in dist/. Run `npm run build` first.")

ATTR = re.compile(r'\b(href|src|srcset)="([^"]*)"')
CSS_URL = re.compile(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)")


def urls(text):
    for name, value in ATTR.findall(text):
        if name == "srcset":
            yield from (part.split()[0] for part in value.split(",") if part.strip())
        else:
            yield value
    yield from CSS_URL.findall(text)


def target(page, url):
    """The file a URL on this page points to, or None if it's not a local file."""
    parts = urlsplit(url)
    if parts.scheme or parts.netloc or url.startswith("#") or not parts.path:
        return None
    path = unquote(parts.path)
    base = site if path.startswith("/") else page.parent
    found = (base / path.lstrip("/")).resolve()
    if found.is_dir():
        found = found / "index.html"
    return found


problems = []
for page in sorted(site.rglob("*")):
    if page.suffix not in (".html", ".css"):
        continue
    for url in urls(page.read_text(encoding="utf-8")):
        found = target(page, url)
        if found and not found.is_file():
            problems.append(f"{page.relative_to(site)}: {url}")

if problems:
    print("Broken links (the file they point to doesn't exist):")
    print("\n".join(f"  {p}" for p in sorted(set(problems))))
    sys.exit(1)
print("All links OK.")
