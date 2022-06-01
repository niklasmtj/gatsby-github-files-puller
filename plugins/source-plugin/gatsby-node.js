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

  for (const url of urls) {
    const result = await (await axios.get(url)).data;
    const fileName = url.split("/").pop();
    const f = {
      name: fileName,
      content: result,
    };

    createNode({
      // nameWithOwner and url are arbitrary fields from the data
      ...f,
      // required fields
      id: createNodeId(`${f.name}`),
      parent: null,
      children: [],
      internal: {
        type: `githubFile`,
        content: JSON.stringify(f.content),
        contentDigest: createContentDigest(f),
      },
    });
  }
};
