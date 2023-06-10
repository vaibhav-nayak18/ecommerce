export class WhereClause {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }

  search() {
    const searchWord = this.bigQ.search
      ? {
          name: {
            $regex: this.bigQ.search,
            $options: "i",
          },
        }
      : {};
    this.base = this.base.find({ ...searchWord });
    return this;
  }

  filter() {
    const copyQ = { ...this.bigQ };
    // console.log("copyQ", copyQ);
    delete copyQ["search"];
    delete copyQ["limit"];
    delete copyQ["page"];

    // console.log("copyQ", copyQ);
    // convert bigQ into a string => copyQ
    let stringOfCopyQ = JSON.stringify(copyQ);
    // console.log("string", stringOfCopyQ);
    stringOfCopyQ = stringOfCopyQ.replace(
      /\b(gte|lte|gt|lt)\b/g,
      (m) => `$${m}`
    );

    // console.log("string", stringOfCopyQ);
    const jsonOfCopyQ = JSON.parse(stringOfCopyQ);
    // console.log("jsonOfCopy", jsonOfCopyQ);
    this.base = this.base.find(jsonOfCopyQ);
    // console.log("this", this);
    return this;
  }

  pager(resultPerPage) {
    let currentPage = 1;

    if (this.bigQ.page) {
      currentPage = this.bigQ.page;
    }
    // console.log("base", this.base);
    const skipVal = resultPerPage * (currentPage - 1);
    this.base = this.base.limit(resultPerPage).skip(skipVal);
    return this;
  }
}
