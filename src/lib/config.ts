export { parseConfig };

function parseConfig(path: string) {
  const siteConfigPath = args[0];
  const sitePath = Deno.realpathSync(siteConfigPath);
  const siteStr = readFileStrSync(sitePath);
  const site = JSON.parse(siteStr);
  const paths = getPaths(site);

  return { site, paths };
}

function getPaths(site: any) {
  return {
    public: join(dirname(siteConfigPath), site.public),
    content: join(dirname(siteConfigPath), site.content),
    template: join(dirname(siteConfigPath), site.template),
    output: join(dirname(siteConfigPath), site.output),
  };
}
