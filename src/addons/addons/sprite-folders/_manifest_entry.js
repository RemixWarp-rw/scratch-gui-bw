const manifest = {
    name: "Sprite File List View",
    description: "Transforms the sprite list into a VSCode-style file explorer with folders (works with // folder naming).",
    tags: ["editor", "sprites", "MistWarp"],
    "credits": [
    {
      "name": "Mistium",
      "link": "https://mistium.com/"
    },
    {
      "name": "BugWarp (Translations)",
      "link": "https://www.bugwarp.org/"
    }
  ],
    userscripts: [
        {
            url: "userscript.js",
        },
    ],
    userstyles: [
        {
            url: "style.css",
        },
    ],
    enabledByDefault: false,
};
export default manifest;
