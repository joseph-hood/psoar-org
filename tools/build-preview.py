"""Build an Artifact-ready copy of the site for a live preview in Claude.

    npm run build
    python3 tools/build-preview.py <output-dir>

Copies the built site (dist/) to <output-dir> and makes it work from the Artifact host:
- addresses that start at the top of the domain ("/about", "/_astro/x.css") become
  relative ones ("about/index.html", "astro/x.css"), in every page and stylesheet;
- top-level folders starting with "_" lose the "_" (the Artifact host reserves those);
- index.html loses its own doctype/html/head/body wrapper (the Artifact page skeleton
  supplies those), keeping the title, styles, and scripts from its head.
Prints the supporting files to publish alongside index.html.
"""
import pathlib
import posixpath
import re
import shutil
import sys

site = pathlib.Path(__file__).resolve().parent.parent / "dist"
out = pathlib.Path(sys.argv[1]).resolve()
if not (site / "index.html").is_file():
    sys.exit("No built site in dist/. Run `npm run build` first.")

ATTR = re.compile(r'\b(href|src|srcset)="([^"]*)"')
CSS_URL = re.compile(r"url\(\s*(['\"]?)(/[^/'\")][^'\")]*)\1\s*\)")


def relative(url, page):
    """Rewrite a top-of-domain URL so it works relative to `page` (a path inside out/)."""
    if not url.startswith("/") or url.startswith("//"):
        return url
    path, hash_ = (url.split("#", 1) + [""])[:2]
    if not posixpath.splitext(path)[1]:
        path = path.rstrip("/") + "/index.html"
    path = path.lstrip("/_")
    rel = posixpath.relpath(path, page.parent.relative_to(out).as_posix())
    return rel + ("#" + hash_ if hash_ else "")


def rewrite(text, page):
    def attr(m):
        name, value = m.groups()
        if name == "srcset":
            value = ", ".join(
                " ".join([relative(p.split()[0], page)] + p.split()[1:])
                for p in value.split(",")
                if p.strip()
            )
        else:
            value = relative(value, page)
        return f'{name}="{value}"'

    text = ATTR.sub(attr, text)
    return CSS_URL.sub(lambda m: f"url({m[1]}{relative(m[2], page)}{m[1]})", text)


shutil.rmtree(out, ignore_errors=True)
shutil.copytree(site, out)
for entry in out.glob("_*"):
    entry.rename(out / entry.name.lstrip("_"))

for page in out.rglob("*"):
    if page.suffix in (".html", ".css"):
        page.write_text(rewrite(page.read_text(encoding="utf-8"), page), encoding="utf-8")

index = out / "index.html"
html = index.read_text(encoding="utf-8")
head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
body = re.search(r"<body[^>]*>(.*?)</body>", html, re.S).group(1)
head = re.sub(r"<!--.*?-->|<meta[^>]*>|<link[^>]*rel=\"(icon|apple-touch-icon)\"[^>]*>", "", head, flags=re.S)
index.write_text(head.strip() + "\n" + body.strip() + "\n", encoding="utf-8")

for path in sorted(out.rglob("*")):
    if path.is_file() and path != index:
        print(path.relative_to(out).as_posix())
