const axios = require("axios");

/**
 * You can uncomment the following line to verify that
 * your plugin is being loaded in your site.
 *
 * See: https://www.gatsbyjs.com/docs/creating-a-local-plugin/#developing-a-local-plugin-that-is-outside-your-project
 */
exports.onPreInit = () => console.log("Loaded gatsby-starter-plugin");

exports.sourceNodes = async (
  { actions: { createNode }, createContentDigest, createNodeId },
  pluginOptions
) => {
  const { urls } = pluginOptions;

  const c = [];

  for (const url of urls) {
    const result = await (await axios.get(url)).data;
    const fileName = url.split("/").pop();
    c.push({
      name: fileName,
      content: result,
    });
  }

  for (const file of c) {
    createNode({
      // nameWithOwner and url are arbitrary fields from the data
      ...file,
      // required fields
      id: createNodeId(`${file.name}`),
      parent: null,
      children: [],
      internal: {
        type: `githubFile`,
        content: JSON.stringify(file.content),
        contentDigest: createContentDigest(file),
      },
    });
  }
};
