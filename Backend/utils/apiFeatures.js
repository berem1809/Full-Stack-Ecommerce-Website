class APIFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    search() {
      let keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};
  
      this.query.find({ ...keyword });
      return this;
    }
  
    filter() {
      const queryStrCopy = { ...this.queryStr };
      const removeField = ["keyword", "limit", "page"];
  
      removeField.forEach((field) => delete queryStrCopy[field]);
  
      this.query.find(queryStrCopy);
      return this;
    }
  }
  
  module.exports = APIFeatures;