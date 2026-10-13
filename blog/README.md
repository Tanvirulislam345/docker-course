# Blog: Docker One Shot

Source for the Medium post **"Docker One Shot: Learn Docker from Zero to Full-Stack"**.

| Path | What it is |
| --- | --- |
| `docker-one-shot.md` | The full post |
| `images/` | The cover banner, 8 diagrams used in the post, and `00-thumbnail.png` (Medium preview image) |
| `src/diagrams/` | HTML source of each image |
| `src/style.css` | Shared colors and fonts |
| `src/trim.py` | Trims empty space at the bottom of each rendered image |
| `render.sh` | Renders every source to `images/*.png` with headless Chrome (2× for sharp text) |

## Re-render the images

Requires Google Chrome and Python 3 with Pillow.

```bash
./blog/render.sh            # all images
./blog/render.sh 05-ports   # only images whose name contains "05-ports"
```

## Publish on Medium

1. Push this repo, so the cheat sheet link at the end of the post works.
2. Create a new story. Use the first two lines of `docker-one-shot.md` as the title and subtitle.
3. Copy the post section by section. Where you see `![...](images/....png)`, drag that file from `images/` into the editor.
4. Code blocks: type three backticks (```) in Medium to start one, then paste the code. Medium adds the copy button.
5. Headings: `##` → large heading (T), `###` → small heading (t).
6. Table of contents: after publishing, copy each section heading's link and link the matching contents line to it.
7. Story settings → **Preview image**: upload `images/00-thumbnail.png`. Suggested tags: `Docker`, `DevOps`, `Docker Compose`, `MERN`, `Web Development`.
