export default {
  extends: "book",

  rootUrl: "/bok",

  paths: {
    output: "../../docs",
    public: ["public"],
  },

  params: {
    title: "bok",
    author: "Samir Alajmovic",
    description: "A fast, minimal static site generator built with Bun",
    url: "https://github.com/alajmo/bok",
    github: "https://github.com/alajmo/bok",
  },
};
