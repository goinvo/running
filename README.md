# running.goinvo.com

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), designed to pull data from Google Docs and display them.

## Editing the Content

The content of [running.goinvo.com](running.goinvo.com) can be edited by modifying the Google Drive documents that are internal to the GoInvo team. 

### Navigation
Each document in the root directory will be listed as a menu item. The ordering will be based off of the number that precedes the first detected period `.` 

Submenus can be used here by using letter numbering. For example, a valid structure for file names is:

 1\. Page 1<br>
 2\. Page 2<br>
 3\. Page 3<br>
3.b. Page 3b<br>
3.c. Page 3c

When rendered, `3b` and `3c` will be nested under page 3

### Document Hiding

If you don't want a document to show up in the Navigation, there are two options to hide it

- Use a folder and toss the documents in there
- Append `#unlisted` to the end of the Google Document name. For example, if the document was named `1. Page 1` making this `1. Page 1#unlisted` would prevent this document from showing up in the menu

### Lightboxes

Lightboxes are useful to keep the user on the site while being able to view the pertinent information. Any link can be converted to open in an lightbox iframe. Add `#lightbox` to the end of the link on the Google Document link to trigger the lightbox.

### Two Columns

We detect if columns are present via a `[cols: 2]` at the end of a `Heading 3` in Google Docs. If so, the immediate following content will be split into a special format which is 2 columns on desktop and 1 slim column on mobile. This is currently used for `Quick Links` and `Guides`, which are typically at the top of each document page.

### Links & Buttons

Links by default will open in a new tab if they do not point within the `running.goinvo` domain. If you wish to change this behavior and force the link to replace the existing window, append `#self` to the end of the link.

Buttons are links but in a nice pill-shaped container. To summon a button, the **text** itself should be surrounded by square brackets `[]` 
## Setup And Development of the Code

1. Clone this repo!
1. Navigate to the root using Terminal on a Mac, or some sort of bash shell if you're on a PC. Run `yarn` (if you don't have yarn, you may need to [install it](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable). Yarn is a package management system with a variety of debatable advantages over npm.
1. To run the development server, run: `yarn dev`
1. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployment

This site is deployed to [https://running.goinvo.com/](https://running.goinvo.com/)
