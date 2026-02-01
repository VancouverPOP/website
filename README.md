# VanPOP website

This is a repository for the VanPOP website source code. You can find this website online at <https://vanpop.ca/>.

## 🚀 Project Structure

VanPOP website is a [JAMstack](https://jamstack.org/what-is-jamstack/) static web application written in TypeScript using Astro framework. Inside of this project, you'll see the following folders:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
```

All website pages are defined in `src/pages/` folder as `.astro` or `.md` files. Each page is exposed as a route based on its file name, e.g. page with filename `about.astro` will be in `/about` route.

The `src/components/` folder contains various reusable components for a website. Example of these components are header, footer, page links, etc. Components are defined in `.astro` files.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. VanPOP blog posts are stored in this folder. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, are placed in the `public/` directory.

## 🧞 Getting Started

### Running in Devcontainer

Best option to develop and run website server locally is by running [Dev Container](https://containers.dev/). Dev container preinstalls all the necessary dependencies like NodeJS and pnpm making development envrionement consistent and isolated.

Here are guides to run dev container in [Visual Studio Code](https://code.visualstudio.com/docs/devcontainers/containers) or in [JetBrains IDEs](https://www.jetbrains.com/help/idea/connect-to-devcontainer.html). There are 2 dev containers available - AMD64 (for x64, e.g. Windows PCs, Intel-based Macs) and ARM64 (M-based Macs, Raspberry PI, etc.).

### Run manually

VanPOP website uses `pnpm`. In order to run it locally, you need to have Node.js and pnpm installed.

- [Installing Node.js](https://nodejs.org/en/download/current)
- [Installing pnpm](https://pnpm.io/installation)

After Node.js and pnpm installed, you can use command below to run and manage project. All commands are run from the root of the project, from a terminal:

| Command                | Action                                                                        |
| :--------------------- | :---------------------------------------------------------------------------- |
| `pnpm install`         | Install website dependencies                                                  |
| `pnpm dev`             | Starts local development server at `localhost:4321` with live reload support. |
| `pnpm build`           | Build your production site to `./dist/`                                       |
| `pnpm preview`         | Preview your build locally, before deploying                                  |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check`                              |
| `pnpm astro -- --help` | Get help using the Astro CLI                                                  |

## ⭐ Want to contribute?

Check out [Astro documentation](https://docs.astro.build) to get familiar with the framework. We are happy to accept contributions, but we don't have an SLA to respond on issues or to review contributions. Please be respectful to other contributors!

### Want to add new blog post?

If you want to add a new blog post, feel free to create a Pull Request with new post placed in [src/content/blog](https://github.com/VancouverPOP/website/tree/main/src/content/blog). If you're not feeling confident using GitHub and development tools, feel free to send a draft of your post along with original images to any of the VanPOP administrators, they will be happy to help you get published.

## Deployment

This website is deployed using Cloudflare pages. Deployment happens from `main` branch on every new push. Please talk to any of the VanPOP administrators for more information or access.
