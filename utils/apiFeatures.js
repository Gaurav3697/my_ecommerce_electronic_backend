//master it

class ApiFeature {
    constructor(query, queryStr) {
        this.query = query; //products
        this.queryStr = queryStr; //filteartions
    }

    //To search the keyword str in name
    search() {
        try {
            const keyword = this.queryStr.keyword && this.queryStr.keyword.trim() // Check if keyword exists and is not an empty string
                ? {
                    name: {
                        $regex: this.queryStr.keyword,
                        $options: "i",
                    },
                }
                : {};


    
            this.query = this.query.find({ ...keyword });
            return this;
        } catch (error) {
            console.log(error.message);
        }
    }
    //to give products after filtering
    filter() {
        try {
            const querycopy = { ...this.queryStr }; //copying the data from queryStr into querycopy without affecting queryStr even a percent
            const removeFeild = ["keyword", "page", "limit"];
            removeFeild.forEach(key => { //using map function to remove unrelevent feilds
                delete querycopy[key];
            });
            let queryStr = JSON.stringify(querycopy);
            queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`); //syntax-->  / \b(mongoDB query)\b  /
            this.query = this.query.find(JSON.parse(queryStr)); //Json.parse changes json data into javascript object that can be easily manupulated by js
            return this;
        } catch (error) {
            console.log(error.message);
        }
    }

    //pagination
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1); //How many pages to skip logic
        this.query = this.query.limit(resultPerPage).skip(skip); //to skip the products
        return this;
    }

}

module.exports = ApiFeature;