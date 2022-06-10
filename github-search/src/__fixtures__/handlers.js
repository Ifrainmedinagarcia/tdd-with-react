import {  makeFakeResponse,  getReposPerPage } from "./repos";
import { OK_STATUS } from "../consts";

// eslint-disable-next-line import/prefer-default-export
export const handlePaginated =  (req, res, ctx) => {
    return res(
        ctx.status(OK_STATUS),
        ctx.json({
            ...makeFakeResponse({totalCount: 1000}), 
            items: getReposPerPage({
                perPage: Number(req.url.searchParams.get('per_page')), 
                currentPage: req.url.searchParams.get('page')
            })
        })
    )
}

export default {
    handlePaginated
}
  