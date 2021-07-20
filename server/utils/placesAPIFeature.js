class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedStrings = ['page', 'sort', 'limit', 'fields'];
    excludedStrings.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-created_at');
    }

    return this;
  }

  specificFields() {
    if (this.queryString.fields) {
      const specificFields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(specificFields);
    } else {
      // Select everything except the '__v' field
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const pageNum = +this.queryString.page || 1;
    const limitValue = +this.queryString.limit || 50;
    const skipValue = (pageNum - 1) * limitValue;

    this.query = this.query.skip(skipValue).limit(limitValue);

    return this;
  }
}

module.exports = APIFeatures;
