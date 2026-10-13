# Blog: Docker One Shot

Source for the Medium post **"Docker One Shot: Learn Docker from Zero to Full-Stack"**.

| Path | What it is |
| --- | --- |
| `docker-one-shot.md` | The full post |
| `images/` | Every image used in the post (PNG, 1400px wide), plus `00-thumbnail.png` (1200×630) for the preview |
| `captures/` | Real terminal output recorded while running the four projects. The terminal screenshots are made from these files. |
| `src/diagrams/` | HTML sources of the banner, thumbnail and diagrams |
| `src/shots.mjs` | Generates section banners, project cards, terminal and code screenshots (code is read straight from the project files) |
| `src/style.css` | Shared colors and fonts for every image |
| `render.sh` | Renders every source to `images/*.png` with headless Chrome |

## Re-render the images

Requires Google Chrome, Node.js and Python 3 with Pillow.

```bash
./blog/render.sh            # all images
./blog/render.sh 07-port    # only images whose name contains "07-port"
```

If you change a Dockerfile or compose file, re-run `render.sh` so the code screenshots stay in sync.

## Publish on Medium

1. Push this repo, so the cheat sheet link in the post (`docker-commands-cheatsheet.md` on GitHub) works.
2. Create a new Medium story. Set the title and subtitle from the first two lines of `docker-one-shot.md`.
3. Copy the post section by section. For each `![...](images/....png)` line, upload that file from `images/` (drag and drop into the editor). Use the text in `[...]` as the image caption or alt text.
4. Code blocks: type three backticks (```) in Medium to start a code block, then paste the code.
5. Headings: `##` → Medium **large heading (T)**, `###` → **small heading (t)**.
6. Table of contents: after publishing (or in preview), copy each section heading's link and link the matching TOC line to it.
7. Story settings → **Preview image**: upload `images/00-thumbnail.png`. Add tags such as `Docker`, `DevOps`, `Docker Compose`, `MERN`, `Web Development`.
