// search,rating[gte],price[gte&&lte],

class WhereClause {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }

  search() {
    const searchword = this.bigQ.search
      ? {
          name: {
            $regex: this.bigQ.search,
            $options: "i",
          },
        }
      : {};

    this.base = this.base.find({ ...searchword });
    return this;
  }
  filter() {
    let copyQ = { ...this.bigQ };
    delete copyQ.search;
    delete copyQ.page;
    delete copyQ.limit;

    let stringCopy = JSON.stringify(copyQ);
    stringCopy = stringCopy.replace(/\b(gte|lte|lt|gt)\b/, (m) => `$${m}`);
    const copyOfJson = JSON.parse(stringCopy);
    this.base = this.base.find(copyOfJson);
    return this;
  }
  pager(resultPerPage) {
    let currentPage = 1;
    if (this.bigQ.page) {
      currentPage = this.bigQ.page;
    }
    this.base = this.base
      .limit(resultPerPage)
      .skip(resultPerPage * (currentPage - 1));
    return this;
  }
}
module.exports = WhereClause;
