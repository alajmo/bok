export default {
  extends: "book",

  rootUrl: "",

  paths: {
    output: "../../docs",
    public: ["public"],
  },

  params: {
    title: "bok",
    author: "Samir Alajmovic",
    description: "A fast, minimal static site generator built with Bun",
    url: "https://github.com/alajmo/bok",
  },
};
