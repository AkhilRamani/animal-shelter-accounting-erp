export const getPaginatedRecords = async (query: {page: number, limit: number}, Model: any, ) => {
    const {page = 0, limit = 10} = query

    return Model.paginate({}, {
        page, limit
    })
}